from fastapi import APIRouter, HTTPException
from firebase_setup import db
from datetime import datetime

router = APIRouter()

@router.post("/bookings")
def create_booking(data: dict):
    try:
        data["bookingTime"] = datetime.utcnow().isoformat()
        db.collection("bookings").add(data)
        return {"message": "Booking created"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
