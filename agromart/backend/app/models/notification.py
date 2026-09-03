from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class NotificationResponse(BaseModel):
    id: str
    user_id: str
    type: str  # "order", "offer", "payment", "system"
    title: str
    body: str
    read: bool = False
    created_at: Optional[datetime] = None
