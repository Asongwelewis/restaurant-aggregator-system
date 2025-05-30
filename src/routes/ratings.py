
from fastapi import APIRouter, HTTPException
from firebase_setup import db

router = APIRouter()

@router.post("/ratings/meal")
def rate_meal(data: dict):
    try:
        db.collection("meal_ratings").add(data)
        return {"message": "Meal rating submitted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ratings/restaurant")
def rate_restaurant(data: dict):
    try:
        db.collection("restaurant_ratings").add(data)
        return {"message": "Restaurant rating submitted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ratings/aggregate")
def get_aggregate_ratings():
    try:
        ratings = db.collection("restaurant_ratings").stream()
        total = count = 0
        for r in ratings:
            data = r.to_dict()
            total += data.get("score", 0)
            count += 1
        if count == 0:
            return {"average_rating": 0}
        return {"average_rating": round(total / count, 2)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
