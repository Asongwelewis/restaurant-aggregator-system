from fastapi import APIRouter, HTTPException
from app.models.restaurant import Restaurant
from app.firebase.client import rtdb

router = APIRouter(prefix="/restaurants", tags=["Restaurants"])

@router.post("/")
def add_restaurant(restaurant: Restaurant):
    doc_ref = rtdb.collection("restaurants").document(restaurant.id)
    if doc_ref.get().exists:
        raise HTTPException(status_code=400, detail="Restaurant already exists")
    doc_ref.set(restaurant.dict())
    return {"message": "Restaurant added successfully"}

@router.get("/")
def list_restaurants():
    docs = rtdb.collection("restaurants").stream()
    return [doc.to_dict() for doc in docs]

@router.get("/{restaurant_id}")
def get_restaurant(restaurant_id: str):
    doc = rtdb.collection("restaurants").document(restaurant_id).get()
    if doc.exists:
        return doc.to_dict()
    raise HTTPException(status_code=404, detail="Restaurant not found")
