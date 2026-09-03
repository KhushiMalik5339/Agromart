from typing import List
from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from app.core.deps import get_db, get_current_user
from app.models.notification import NotificationResponse

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("", response_model=List[NotificationResponse])
async def get_user_notifications(current_user: dict = Depends(get_current_user), db=Depends(get_db)):
    cursor = db.notifications.find({"user_id": ObjectId(current_user["id"])}).sort("created_at", -1)
    notes = await cursor.to_list(length=50)
    
    return [
        NotificationResponse(
            id=str(n["_id"]),
            user_id=str(n["user_id"]),
            type=n.get("type", "system"),
            title=n["title"],
            body=n["body"],
            read=n.get("read", False),
            created_at=n.get("created_at")
        ) for n in notes
    ]

@router.patch("/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db)
):
    if not ObjectId.is_valid(notification_id):
        raise HTTPException(status_code=400, detail="Invalid notification_id")
        
    await db.notifications.update_one(
        {"_id": ObjectId(notification_id), "user_id": ObjectId(current_user["id"])},
        {"$set": {"read": True}}
    )
    return {"message": "Notification marked as read"}
