from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, Dict, List
from app.dependencies.auth import verify_api_key
from app.firebase.client import rtdb

router = APIRouter()

class Restaurant(BaseModel):
    name: str
    location: str
    latitude: float
    longitude: float
    menu: Dict[str, float]
    services: List[str]
    open_hours: str
    close_hours: str
    description: Optional[str] = None

@router.post("/")
def create_restaurant(restaurant: Restaurant, user=Depends(verify_api_key)):
    ref = rtdb.reference("restaurants").push(restaurant.dict())
    return {"message": "Restaurant created", "id": ref.key}

@router.get("/{restaurant_id}")
def get_restaurant(restaurant_id: str, user=Depends(verify_api_key)):
    data = rtdb.reference(f"restaurants/{restaurant_id}").get()
    if not data:
        raise HTTPException(status_code=404, detail="Not found")
    return data

@router.put("/{restaurant_id}")
def update_restaurant(restaurant_id: str, restaurant: Restaurant, user=Depends(verify_api_key)):
    rtdb.reference(f"restaurants/{restaurant_id}").update(restaurant.dict())
    return {"message": "Updated"}

@router.delete("/{restaurant_id}")
def delete_restaurant(restaurant_id: str, user=Depends(verify_api_key)):
    rtdb.reference(f"restaurants/{restaurant_id}").delete()
    return {"message": "Deleted"}