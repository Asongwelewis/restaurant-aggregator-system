from fastapi import APIRouter
from src.firestore import db

router = APIRouter(tags=["Ratings"])

@router.post("/restaurants/{id}/rate")
async def rate_restaurant(restaurant_id: str, rating: float):
    rating_data = {
        "value": rating,
        "timestamp": firestore.SERVER_TIMESTAMP
    }
    db.collection("ratings").document(restaurant_id).collection("ratings").add(rating_data)
    return {"status": "Rating added"}