from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from jose import jwt, JWTError
from bson import ObjectId
from app.core.config import settings
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token
)
from app.core.deps import get_db, get_current_user
from app.models.user import (
    UserRegister,
    UserLogin,
    GoogleAuthRequest,
    RefreshTokenRequest,
    UserResponse,
    TokenResponse
)
from app.integrations.google_oauth import verify_google_id_token

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=TokenResponse)
async def register(user_in: UserRegister, db=Depends(get_db)):
    existing = await db.users.find_one({"email": user_in.email.lower()})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    user_doc = {
        "name": user_in.name,
        "email": user_in.email.lower(),
        "password_hash": get_password_hash(user_in.password),
        "role": user_in.role,
        "phone": user_in.phone,
        "avatar_url": f"https://api.dicebear.com/7.x/avataaars/svg?seed={user_in.email}",
        "created_at": datetime.utcnow()
    }
    
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    # If farmer role, create farmer profile doc
    if user_in.role == "farmer":
        farmer_doc = {
            "user_id": ObjectId(user_id),
            "farm_name": user_in.farm_name or f"{user_in.name}'s Organic Farm",
            "bio": "Certified local organic farmer committed to sustainable agriculture.",
            "location": {
                "address": user_in.farm_location or "Green Valley, Highway 44",
                "city": "Nashik",
                "state": "Maharashtra",
                "lat": 19.9975,
                "lng": 73.7898
            },
            "verified": True,
            "rating_avg": 5.0,
            "created_at": datetime.utcnow()
        }
        await db.farmer_profiles.insert_one(farmer_doc)

    access_token = create_access_token(subject=user_id, role=user_in.role)
    refresh_token = create_refresh_token(subject=user_id, role=user_in.role)
    
    user_response = UserResponse(
        id=user_id,
        name=user_doc["name"],
        email=user_doc["email"],
        role=user_doc["role"],
        phone=user_doc.get("phone"),
        avatar_url=user_doc.get("avatar_url"),
        created_at=user_doc["created_at"]
    )
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_response
    )

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db=Depends(get_db)):
    user = await db.users.find_one({"email": credentials.email.lower()})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    user_id = str(user["_id"])
    role = user.get("role", "customer")
    access_token = create_access_token(subject=user_id, role=role)
    refresh_token = create_refresh_token(subject=user_id, role=role)
    
    user_response = UserResponse(
        id=user_id,
        name=user["name"],
        email=user["email"],
        role=role,
        phone=user.get("phone"),
        avatar_url=user.get("avatar_url"),
        created_at=user.get("created_at")
    )
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_response
    )

@router.post("/google", response_model=TokenResponse)
async def google_login(payload: GoogleAuthRequest, db=Depends(get_db)):
    try:
        id_info = verify_google_id_token(payload.id_token)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Google Token"
        )
    
    email = id_info.get("email", "").lower()
    name = id_info.get("name", "Google User")
    google_id = id_info.get("sub")
    avatar = id_info.get("picture")
    
    user = await db.users.find_one({"email": email})
    if not user:
        user_doc = {
            "name": name,
            "email": email,
            "password_hash": get_password_hash(f"google_{google_id}"),
            "role": "customer",
            "google_id": google_id,
            "avatar_url": avatar,
            "created_at": datetime.utcnow()
        }
        res = await db.users.insert_one(user_doc)
        user_id = str(res.inserted_id)
        role = "customer"
    else:
        user_id = str(user["_id"])
        role = user.get("role", "customer")
        if not user.get("google_id"):
            await db.users.update_one({"_id": user["_id"]}, {"$set": {"google_id": google_id, "avatar_url": avatar}})
    
    access_token = create_access_token(subject=user_id, role=role)
    refresh_token = create_refresh_token(subject=user_id, role=role)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserResponse(
            id=user_id,
            name=name,
            email=email,
            role=role,
            avatar_url=avatar,
            created_at=datetime.utcnow()
        )
    )

@router.post("/refresh")
async def refresh_token(payload: RefreshTokenRequest, db=Depends(get_db)):
    try:
        data = jwt.decode(payload.refresh_token, settings.JWT_REFRESH_SECRET, algorithms=[settings.ALGORITHM])
        if data.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user_id = data.get("sub")
        role = data.get("role", "customer")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    new_access_token = create_access_token(subject=user_id, role=role)
    return {"access_token": new_access_token}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=current_user["id"],
        name=current_user["name"],
        email=current_user["email"],
        role=current_user.get("role", "customer"),
        phone=current_user.get("phone"),
        avatar_url=current_user.get("avatar_url"),
        created_at=current_user.get("created_at")
    )
