
from fastapi import APIRouter, HTTPException, Query
import requests
import os

router = APIRouter()

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "")  # Replace or use env variable

@router.get("/search")
def search_restaurants(query: str = Query(...), location: str = "3.8480,11.5021", radius: int = 5000):
    try:
        endpoint = "https://maps.googleapis.com/maps/api/place/textsearch/json"
        params = {
            "query": f"{query} restaurants in Cameroon",
            "location": location,
            "radius": radius,
            "key": GOOGLE_MAPS_API_KEY
        }
        response = requests.get(endpoint, params=params)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Google API error")

        results = response.json().get("results", [])
        return [{"name": r["name"], "address": r.get("formatted_address", ""), "rating": r.get("rating", None)} for r in results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
