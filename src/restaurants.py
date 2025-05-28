from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import firestore
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/api/v1")

# Models
class Restaurant(BaseModel):
    id: Optional[str]
    name: str
    cuisine: str
    rating: Optional[float]

class RestaurantSearch(BaseModel):
    cuisine: Optional[str] = None

# Database dependency
def get_db(firestore_test=None):
    from firestore_test import db
    return db

@router.get("/restaurants", response_model=List[Restaurant])
async def get_restaurants(
        cuisine: Optional[str] = None,
        db: firestore.Client = Depends(get_db)
):
    try:
        restaurants_ref = db.collection("restaurants")
        if cuisine:
            query = restaurants_ref.where("cuisine", "==", cuisine)
        else:
            query = restaurants_ref

        return [doc.to_dict() for doc in query.stream()]
    except Exception as e:
        raise HTTPException(500, f"Database error: {str(e)}")
    @router.post("/restaurants/{restaurant_id}/rate")
    async def rate_restaurant(restaurant_id: int, value: float):
        return {"message": f"Rated restaurant {restaurant_id} with {value}"}