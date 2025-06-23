from fastapi import APIRouter, HTTPException
from app.models.restaurant import Restaurant
from app.firebase.client import rtdb  

router = APIRouter(prefix="/restaurants", tags=["Restaurants"])

@router.post("/")
def add_restaurant(restaurant: Restaurant):
    ref = rtdb.child("restaurants").child(restaurant.id)
    if ref.get(): 
        raise HTTPException(status_code=400, detail="Restaurant already exists")
    data = restaurant.model_dump()
    data.pop('id', None)
    ref.set(data)
    
    return {"message": "Restaurant added successfully"}

@router.get("/")
def list_restaurants():
    restaurants = rtdb.child("restaurants").get()
    if not restaurants:
        return []
    
    return [{"id": key, **value} for key, value in restaurants.items()]

@router.get("/{restaurant_id}")
def get_restaurant(restaurant_id: str):
    data = rtdb.child("restaurants").child(restaurant_id).get()
    if not data:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return {"id": restaurant_id, **data}