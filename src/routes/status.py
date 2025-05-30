
from fastapi import APIRouter, HTTPException
from firebase_setup import db

router = APIRouter()

@router.put("/restaurants/{restaurant_id}/status")
def update_status(restaurant_id: str, data: dict):
    try:
        status = data.get("status")
        if status not in ["open", "closed"]:
            raise ValueError("Status must be 'open' or 'closed'")
        db.collection("restaurants").document(restaurant_id).update({"status": status})
        return {"message": f"Restaurant status updated to {status}"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
