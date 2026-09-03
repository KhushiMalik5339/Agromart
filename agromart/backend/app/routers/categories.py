from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from app.core.deps import get_db, require_role
from app.models.category import CategoryCreate, CategoryResponse

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("", response_model=List[CategoryResponse])
async def list_categories(db=Depends(get_db)):
    cursor = db.categories.find()
    categories_raw = await cursor.to_list(length=100)
    
    cat_map = {}
    parent_cats = []
    
    for c in categories_raw:
        cid = str(c["_id"])
        c_res = CategoryResponse(
            id=cid,
            name=c["name"],
            slug=c["slug"],
            icon=c.get("icon", "eco"),
            parent_id=str(c["parent_id"]) if c.get("parent_id") else None,
            subcategories=[]
        )
        cat_map[cid] = c_res
    
    for cid, c_res in cat_map.items():
        if c_res.parent_id and c_res.parent_id in cat_map:
            cat_map[c_res.parent_id].subcategories.append(c_res)
        else:
            parent_cats.append(c_res)
            
    return parent_cats

@router.post("", response_model=CategoryResponse)
async def create_category(
    cat_in: CategoryCreate,
    db=Depends(get_db),
    admin_user: dict = Depends(require_role(["admin"]))
):
    existing = await db.categories.find_one({"slug": cat_in.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Category slug already exists")
        
    doc = {
        "name": cat_in.name,
        "slug": cat_in.slug,
        "icon": cat_in.icon or "eco",
        "parent_id": ObjectId(cat_in.parent_id) if cat_in.parent_id else None
    }
    res = await db.categories.insert_one(doc)
    
    return CategoryResponse(
        id=str(res.inserted_id),
        name=doc["name"],
        slug=doc["slug"],
        icon=doc["icon"],
        parent_id=cat_in.parent_id,
        subcategories=[]
    )
