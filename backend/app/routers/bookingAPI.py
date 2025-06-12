from fastapi import FastAPI, APIRouter, HTTPException, Query
from firebase_config import ref
from typing import Dict, Any, List
from models import BookingRequest, BookingResponse
from helper_function import get_bookings_by_restaurant

# Create a router for booking-related endpoints
booking_router = APIRouter(
    prefix="/bookings",
    tags=["bookings"]
)

 
@booking_router.post("/", response_model=BookingResponse)
def create_booking(booking: BookingRequest):
    try:
        book_ref = ref.child("bookings").push()
        book_ref.set(booking.dict())
        return BookingResponse(booking_id=book_ref.key, message="booking successful")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@booking_router.get("/", response_model=Dict[str, Any])
def get_all_bookings(restaurant_id: str = Query(...)):
    bookings = get_bookings_by_restaurant(restaurant_id)
    if bookings:
        return {"restaurant_id": restaurant_id, "bookings": bookings}
    else:
        return {"message": "No bookings found for this restaurant"}

