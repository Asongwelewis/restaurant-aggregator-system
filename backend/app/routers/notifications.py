from fastapi import APIRouter
from app.firebase.client import rtdb

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.post("/")
def send_notification(notification: dict):
    ref = rtdb.child("notifications").push(notification)
    return {"message": "Notification sent", "id": ref.key}

@router.get("/")
def get_notifications(user_id: str):
    data = rtdb.child("notifications").order_by_child("user_id").equal_to(user_id).get()
    return list(data.values()) if data else []