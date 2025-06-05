from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.firebase.client import rtdb

router = APIRouter()


ratings_store = []

class Rating(BaseModel):
    restaurant_id: str
    user_id: str
    rating: float  
    comment: str = ""

@router.post("/", status_code=201)
def submit_rating(rating: Rating):
    if not (1.0 <= rating.rating <= 5.0):
        raise HTTPException(status_code=400, detail="Rating must be between 1.0 and 5.0")

    ratings_store.append(rating)
    return {"message": "Rating submitted successfully", "rating": rating}

@router.get("/{restaurant_id}", response_model=List[Rating])
def get_ratings_for_restaurant(restaurant_id: str):
    result = [r for r in ratings_store if r.restaurant_id == restaurant_id]
    return result
