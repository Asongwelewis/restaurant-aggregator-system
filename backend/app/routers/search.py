from fastapi import APIRouter, HTTPException, Query
from app.firebase.client import rtdb

router = APIRouter(prefix="/search", tags=["Search & Ratings"])

@router.get("/")
def search_restaurants(q: str = Query(...)):
    all_docs = rtdb.collection("restaurants").stream()
    return [doc.to_dict() for doc in all_docs if q.lower() in doc.to_dict().get("name", "").lower()]

@router.post("/rate/{restaurant_id}")
def rate_restaurant(restaurant_id: str, rating: float):
    ref = rtdb.collection("restaurants").document(restaurant_id)
    doc = ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    data = doc.to_dict()
    num_ratings = data.get("num_ratings", 0) + 1
    new_rating = round(((data.get("rating", 0) * (num_ratings - 1)) + rating) / num_ratings, 2)

    ref.update({"rating": new_rating, "num_ratings": num_ratings})
    return {"message": "Rating submitted", "new_rating": new_rating}
