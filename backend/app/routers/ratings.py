from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from app.dependencies.auth import verify_api_key
from app.firebase.client import rtdb

router = APIRouter()

class Rating(BaseModel):
    user_id: str
    rating: float
    comment: Optional[str] = ""

@router.post("/{restaurant_id}")
def rate_restaurant(restaurant_id: str, rating: Rating, user=Depends(verify_api_key)):
    if not (1.0 <= rating.rating <= 5.0):
        raise HTTPException(status_code=400, detail="Rating must be between 1.0 and 5.0")
    ref = rtdb.child("restaurants").child(restaurant_id).child("ratings").push(rating.dict())
    return {"message": "Rating submitted", "id": ref.key}

@router.get("/{restaurant_id}")
def get_ratings(restaurant_id: str, user=Depends(verify_api_key)):
    ratings = rtdb.child("restaurants").child(restaurant_id).child("ratings").get()
    if not ratings:
        return []
    return list(ratings.val().values())