from fastapi import APIRouter, HTTPException
from app.firebase.client import rtdb

router = APIRouter(prefix="/reservations", tags=["Reservations"])

@router.post("/")
def create_reservation(reservation: dict):
    ref = rtdb.child("reservations").push(reservation)
    return {"message": "Reservation created", "id": ref.key}

@router.get("/")
def list_reservations(user_id: str):
    data = rtdb.child("reservations").order_by_child("user_id").equal_to(user_id).get()
    return list(data.values()) if data else []

@router.delete("/{reservation_id}")
def cancel_reservation(reservation_id: str):
    ref = rtdb.child("reservations").child(reservation_id)
    if not ref.get():
        raise HTTPException(status_code=404, detail="Reservation not found")
    ref.delete()
    return {"message": "Reservation cancelled"}