from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import firestore
from pydantic import BaseModel
from typing import Optional
from auth import get_current_user  # Add this import

router = APIRouter()

class Rating(BaseModel):
    value: float
    comment: Optional[str] = None

def get_db():
    from firestore_test import db
    return db

@router.post("/restaurants/{restaurant_id}/rate")
async def rate_restaurant(
        restaurant_id: str,
        rating: Rating,
        db: firestore.Client = Depends(get_db),
        current_user: dict = Depends(get_current_user)  # Add user dependency
):
    try:
        if not 1 <= rating.value <= 5:
            raise HTTPException(400, "Rating must be 1-5")

        rating_ref = db.collection("ratings").document()
        rating_ref.set({
            "restaurant_id": restaurant_id,
            "user_id": current_user["uid"],  # Store user ID
            "value": rating.value,
            "comment": rating.comment,
            "created_at": firestore.SERVER_TIMESTAMP
        })
        return {"message": "Rating added"}
    except Exception as e:
        raise HTTPException(500, f"Rating failed: {str(e)}")