from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel, Field
from typing import Optional, Dict, List
from geopy.distance import geodesic
from collections import Counter
import time
import cloudinary
import cloudinary.uploader
from app.firebase.client import rtdb

router = APIRouter()

# Configure Cloudinary
cloudinary.config(
    cloud_name="diheka7k8",
    api_key="664916238983119",
    api_secret="F80U_QN4EgYw7yvG-3PFiG8mEw0"
)

class Restaurant(BaseModel):
    name: str = Field(..., example="Great Burger")
    location: str = Field(..., example="123 Food Street")
    latitude: float = Field(..., example=40.7128)
    longitude: float = Field(..., example=-74.0060)
    menu: Dict[str, float] = Field(..., example={"Cheeseburger": 9.99})
    services: List[str] = Field(..., example=["delivery", "takeout"])
    cuisine: List[str] = Field(..., example=["american", "burgers"])
    open_hours: str = Field(..., example="09:00")
    close_hours: str = Field(..., example="21:00")
    description: Optional[str] = Field(None, example="Best burgers in town!")
    subscription_status: str = Field("free", example="free")
    profile_picture: Optional[str] = None
    background_picture: Optional[str] = None

@router.post("/", summary="Create a new restaurant")
async def create_restaurant(
    restaurant: Restaurant,
    profile_pic: Optional[UploadFile] = File(None),
    background_pic: Optional[UploadFile] = File(None)
):
    restaurant_data = restaurant.dict()
    
    if profile_pic:
        upload_result = cloudinary.uploader.upload(
            profile_pic.file,
            folder="restaurants/profile_pics",
            public_id=f"profile_{int(time.time())}"
        )
        restaurant_data['profile_picture'] = upload_result['secure_url']
    
    if background_pic:
        upload_result = cloudinary.uploader.upload(
            background_pic.file,
            folder="restaurants/background_pics",
            public_id=f"bg_{int(time.time())}"
        )
        restaurant_data['background_picture'] = upload_result['secure_url']
    
    ref = rtdb.reference("restaurants").push(restaurant_data)
    return {"message": "Restaurant created", "id": ref.key}

@router.get("/{restaurant_id}", summary="Get restaurant details")
def get_restaurant(restaurant_id: str):
    data = rtdb.reference(f"restaurants/{restaurant_id}").get()
    if not data:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return data

@router.put("/{restaurant_id}", summary="Update restaurant info")
def update_restaurant(restaurant_id: str, restaurant: Restaurant):
    rtdb.reference(f"restaurants/{restaurant_id}").update(restaurant.dict())
    return {"message": "Restaurant updated"}

@router.delete("/{restaurant_id}", summary="Delete a restaurant")
def delete_restaurant(restaurant_id: str):
    rtdb.reference(f"restaurants/{restaurant_id}").delete()
    return {"message": "Restaurant deleted"}

@router.put("/{restaurant_id}/images", summary="Update restaurant images")
async def update_restaurant_images(
    restaurant_id: str,
    profile_pic: Optional[UploadFile] = File(None),
    background_pic: Optional[UploadFile] = File(None)
):
    updates = {}
    
    if profile_pic:
        upload_result = cloudinary.uploader.upload(
            profile_pic.file,
            folder=f"restaurants/profile_pics",
            public_id=f"profile_{restaurant_id}_{int(time.time())}"
        )
        updates['profile_picture'] = upload_result['secure_url']
    
    if background_pic:
        upload_result = cloudinary.uploader.upload(
            background_pic.file,
            folder=f"restaurants/background_pics",
            public_id=f"bg_{restaurant_id}_{int(time.time())}"
        )
        updates['background_picture'] = upload_result['secure_url']
    
    if updates:
        rtdb.reference(f"restaurants/{restaurant_id}").update(updates)
        return {"message": "Images updated", **updates}
    return {"message": "No images provided"}

@router.get("/search/nearby", summary="Search nearby restaurants")
def search_nearby_restaurants(
    lat: float,
    lon: float,
    radius: float = 5.0,
    cuisine: Optional[str] = None
):
    all_restaurants = rtdb.reference("restaurants").get() or {}
    results = []
    
    for rid, rdata in all_restaurants.items():
        rest_loc = (rdata['latitude'], rdata['longitude'])
        user_loc = (lat, lon)
        distance = geodesic(user_loc, rest_loc).km
        
        if distance <= radius and (not cuisine or cuisine in rdata.get('cuisine', [])):
            results.append({
                **rdata,
                "id": rid,
                "distance": distance
            })
    
    return sorted(results, key=lambda x: x['distance'])