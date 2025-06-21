from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from pydantic import BaseModel
from typing import Optional, Dict, List
from app.dependencies.auth import verify_api_key, verify_owner, verify_admin
from app.firebase.client import rtdb
from geopy.distance import geodesic
from collections import Counter
import time
import cloudinary
import cloudinary.uploader
from datetime import datetime

router = APIRouter()

# Configure Cloudinary (you should have this in your app config)
cloudinary.config(
    cloud_name="diheka7k8",
    api_key="664916238983119",
    api_secret="F80U_QN4EgYw7yvG-3PFiG8mEw0"
)

class Restaurant(BaseModel):
    name: str
    location: str
    latitude: float
    longitude: float
    menu: Dict[str, float]
    services: List[str]
    cuisine: List[str]
    open_hours: str
    close_hours: str
    description: Optional[str] = None
    subscription_status: str = "free"
    profile_picture: Optional[str] = None  # URL from Cloudinary
    background_picture: Optional[str] = None  # URL from Cloudinary

@router.post("/")
async def create_restaurant(
    restaurant: Restaurant, 
    user=Depends(verify_api_key),
    profile_pic: Optional[UploadFile] = File(None),
    background_pic: Optional[UploadFile] = File(None)
):
    restaurant_data = restaurant.dict()
    
    # Upload profile picture if provided
    if profile_pic:
        upload_result = cloudinary.uploader.upload(
            profile_pic.file,
            folder=f"restaurants/profile_pics",
            public_id=f"profile_{int(time.time())}"
        )
        restaurant_data['profile_picture'] = upload_result['secure_url']
    
    # Upload background picture if provided
    if background_pic:
        upload_result = cloudinary.uploader.upload(
            background_pic.file,
            folder=f"restaurants/background_pics",
            public_id=f"bg_{int(time.time())}"
        )
        restaurant_data['background_picture'] = upload_result['secure_url']
    
    ref = rtdb.reference("restaurants").push(restaurant_data)
    return {"message": "Restaurant created", "id": ref.key}

@router.put("/{restaurant_id}/images")
async def update_restaurant_images(
    restaurant_id: str,
    user=Depends(verify_owner),
    profile_pic: Optional[UploadFile] = File(None),
    background_pic: Optional[UploadFile] = File(None)
):
    updates = {}
    
    # Handle profile picture update
    if profile_pic:
        # Delete old image if exists
        current_data = rtdb.reference(f"restaurants/{restaurant_id}").get()
        if current_data and current_data.get('profile_picture'):
            try:
                public_id = current_data['profile_picture'].split('/')[-1].split('.')[0]
                cloudinary.uploader.destroy(f"restaurants/profile_pics/{public_id}")
            except Exception as e:
                print(f"Error deleting old profile picture: {e}")
        
        # Upload new image
        upload_result = cloudinary.uploader.upload(
            profile_pic.file,
            folder=f"restaurants/profile_pics",
            public_id=f"profile_{restaurant_id}_{int(time.time())}"
        )
        updates['profile_picture'] = upload_result['secure_url']
    
    # Handle background picture update
    if background_pic:
        # Delete old image if exists
        current_data = rtdb.reference(f"restaurants/{restaurant_id}").get()
        if current_data and current_data.get('background_picture'):
            try:
                public_id = current_data['background_picture'].split('/')[-1].split('.')[0]
                cloudinary.uploader.destroy(f"restaurants/background_pics/{public_id}")
            except Exception as e:
                print(f"Error deleting old background picture: {e}")
        
        # Upload new image
        upload_result = cloudinary.uploader.upload(
            background_pic.file,
            folder=f"restaurants/background_pics",
            public_id=f"bg_{restaurant_id}_{int(time.time())}"
        )
        updates['background_picture'] = upload_result['secure_url']
    
    if updates:
        rtdb.reference(f"restaurants/{restaurant_id}").update(updates)
    
    return {"message": "Images updated successfully"}

@router.delete("/{restaurant_id}/images")
async def delete_restaurant_images(
    restaurant_id: str,
    image_type: str,  # "profile" or "background"
    user=Depends(verify_owner)
):
    current_data = rtdb.reference(f"restaurants/{restaurant_id}").get()
    if not current_data:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    if image_type == "profile" and current_data.get('profile_picture'):
        try:
            public_id = current_data['profile_picture'].split('/')[-1].split('.')[0]
            cloudinary.uploader.destroy(f"restaurants/profile_pics/{public_id}")
            rtdb.reference(f"restaurants/{restaurant_id}").update({"profile_picture": None})
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error deleting profile picture: {e}")
    
    elif image_type == "background" and current_data.get('background_picture'):
        try:
            public_id = current_data['background_picture'].split('/')[-1].split('.')[0]
            cloudinary.uploader.destroy(f"restaurants/background_pics/{public_id}")
            rtdb.reference(f"restaurants/{restaurant_id}").update({"background_picture": None})
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error deleting background picture: {e}")
    
    else:
        raise HTTPException(status_code=400, detail="Invalid image type or no image exists")
    
    return {"message": f"{image_type} picture deleted successfully"}

# The rest of your existing endpoints (get_restaurant, update_restaurant, etc.) 
#  will now include the image URLs in their responses

@router.get("/search/nearby")
def search_nearby_restaurants(
    lat: float,
    lon: float,
    radius: float = 5.0,
    cuisine: Optional[str] = None,
    min_rating: Optional[float] = None
):
    all_restaurants = rtdb.reference("restaurants").get() or {}
    results = []
    
    for rid, rdata in all_restaurants.items():
        # Calculate distance
        rest_loc = (rdata['latitude'], rdata['longitude'])
        user_loc = (lat, lon)
        distance = geodesic(user_loc, rest_loc).km
        
        if distance <= radius:
            # Apply cuisine filter
            if cuisine and cuisine not in rdata.get('cuisine', []):
                continue
                
            # Get average rating
            ratings = rtdb.reference(f"restaurants/{rid}/ratings").get() or {}
            avg_rating = 0
            if ratings:
                rating_vals = [r['rating'] for r in ratings.values()]
                avg_rating = sum(rating_vals) / len(rating_vals)
            
            # Apply rating filter
            if min_rating and avg_rating < min_rating:
                continue
                
            results.append({
                **rdata,
                "id": rid,
                "distance": distance,
                "average_rating": avg_rating
            })
    
    # Sort by distance
    return sorted(results, key=lambda x: x['distance'])