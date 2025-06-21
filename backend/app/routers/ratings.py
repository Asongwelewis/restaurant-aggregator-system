# ratings.py - Corrected to use Firebase Realtime Database
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.firebase.client import rtdb
import time

router = APIRouter(prefix="/ratings", tags=["Ratings"])

class Rating(BaseModel):
    restaurant_id: str
    user_id: str
    rating: float  
    comment: str = ""
    timestamp: Optional[int] = None

class RatingResponse(BaseModel):
    id: str
    restaurant_id: str
    user_id: str
    rating: float
    comment: str
    timestamp: int

@router.post("/", status_code=201)
def submit_rating(rating: Rating):
    """Submit a rating for a restaurant"""
    # Validate rating range
    if not (1.0 <= rating.rating <= 5.0):
        raise HTTPException(status_code=400, detail="Rating must be between 1.0 and 5.0")
    
    # Check if restaurant exists
    restaurant = rtdb.reference(f"restaurants/{rating.restaurant_id}").get()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    # Prepare rating data
    rating_data = rating.dict()
    rating_data['timestamp'] = int(time.time())
    
    try:
        # Store rating in Firebase
        ref = rtdb.reference("ratings").push(rating_data)
        
        # Update restaurant's average rating
        update_restaurant_average_rating(rating.restaurant_id)
        
        return {
            "message": "Rating submitted successfully",
            "rating_id": ref.key,
            "rating": rating_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to submit rating: {str(e)}")

@router.get("/{restaurant_id}", response_model=List[RatingResponse])
def get_ratings_for_restaurant(restaurant_id: str):
    """Get all ratings for a specific restaurant"""
    try:
        # Check if restaurant exists
        restaurant = rtdb.reference(f"restaurants/{restaurant_id}").get()
        if not restaurant:
            raise HTTPException(status_code=404, detail="Restaurant not found")
        
        # Get all ratings
        all_ratings = rtdb.reference("ratings").get() or {}
        
        # Filter ratings for this restaurant
        restaurant_ratings = []
        for rating_id, rating_data in all_ratings.items():
            if rating_data.get("restaurant_id") == restaurant_id:
                restaurant_ratings.append(RatingResponse(
                    id=rating_id,
                    **rating_data
                ))
        
        # Sort by timestamp (newest first)
        restaurant_ratings.sort(key=lambda x: x.timestamp, reverse=True)
        
        return restaurant_ratings
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch ratings: {str(e)}")

@router.get("/user/{user_id}", response_model=List[RatingResponse])
def get_ratings_by_user(user_id: str):
    """Get all ratings submitted by a specific user"""
    try:
        all_ratings = rtdb.reference("ratings").get() or {}
        
        user_ratings = []
        for rating_id, rating_data in all_ratings.items():
            if rating_data.get("user_id") == user_id:
                user_ratings.append(RatingResponse(
                    id=rating_id,
                    **rating_data
                ))
        
        # Sort by timestamp (newest first)
        user_ratings.sort(key=lambda x: x.timestamp, reverse=True)
        
        return user_ratings
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch user ratings: {str(e)}")

@router.put("/{rating_id}")
def update_rating(rating_id: str, rating: Rating):
    """Update an existing rating"""
    try:
        # Check if rating exists
        existing_rating = rtdb.reference(f"ratings/{rating_id}").get()
        if not existing_rating:
            raise HTTPException(status_code=404, detail="Rating not found")
        
        # Validate new rating
        if not (1.0 <= rating.rating <= 5.0):
            raise HTTPException(status_code=400, detail="Rating must be between 1.0 and 5.0")
        
        # Update rating data
        rating_data = rating.dict()
        rating_data['timestamp'] = int(time.time())
        
        rtdb.reference(f"ratings/{rating_id}").update(rating_data)
        
        # Update restaurant's average rating
        update_restaurant_average_rating(rating.restaurant_id)
        
        return {"message": "Rating updated successfully", "rating": rating_data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update rating: {str(e)}")

@router.delete("/{rating_id}")
def delete_rating(rating_id: str):
    """Delete a rating"""
    try:
        # Check if rating exists and get restaurant_id
        existing_rating = rtdb.reference(f"ratings/{rating_id}").get()
        if not existing_rating:
            raise HTTPException(status_code=404, detail="Rating not found")
        
        restaurant_id = existing_rating.get("restaurant_id")
        
        # Delete the rating
        rtdb.reference(f"ratings/{rating_id}").delete()
        
        # Update restaurant's average rating
        if restaurant_id:
            update_restaurant_average_rating(restaurant_id)
        
        return {"message": "Rating deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete rating: {str(e)}")

def update_restaurant_average_rating(restaurant_id: str):
    """Helper function to update restaurant's average rating"""
    try:
        # Get all ratings for this restaurant
        all_ratings = rtdb.reference("ratings").get() or {}
        restaurant_ratings = [
            rating_data for rating_data in all_ratings.values() 
            if rating_data.get("restaurant_id") == restaurant_id
        ]
        
        if restaurant_ratings:
            # Calculate average
            total_rating = sum(r.get("rating", 0) for r in restaurant_ratings)
            avg_rating = round(total_rating / len(restaurant_ratings), 2)
            
            # Update restaurant record
            rtdb.reference(f"restaurants/{restaurant_id}").update({
                "average_rating": avg_rating,
                "total_ratings": len(restaurant_ratings)
            })
        else:
            # No ratings, reset to defaults
            rtdb.reference(f"restaurants/{restaurant_id}").update({
                "average_rating": 0,
                "total_ratings": 0
            })
    except Exception as e:
        print(f"Error updating restaurant average rating: {str(e)}")
