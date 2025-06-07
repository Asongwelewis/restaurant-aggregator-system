from fastapi import APIRouter, Query, Depends
from app.dependencies.auth import verify_api_key
from app.firebase.client import rtdb
from math import radians, cos, sin, asin, sqrt

router = APIRouter()

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    return R * c

@router.get("/")
def search_restaurants(
    q: str = Query("", description="Search query"),
    lat: float = Query(None, description="Latitude"),
    lon: float = Query(None, description="Longitude"),
    radius_km: float = Query(5, description="Search radius in km"),
    user=Depends(verify_api_key)
):
    all_restaurants = rtdb.child("restaurants").get()
    if not all_restaurants:
        return []
    results = []
    for rid, data in all_restaurants.val().items():
        # Text search
        if q and q.lower() not in data.get("name", "").lower() and q.lower() not in data.get("location", "").lower():
            continue
        # Location filter
        if lat is not None and lon is not None:
            rest_lat = data.get("latitude")
            rest_lon = data.get("longitude")
            if rest_lat is None or rest_lon is None:
                continue
            distance = haversine(lat, lon, rest_lat, rest_lon)
            if distance > radius_km:
                continue
            data["distance_km"] = round(distance, 2)
        data["id"] = rid
        results.append(data)
    if lat is not None and lon is not None:
        results.sort(key=lambda x: x.get("distance_km", 9999))
    return results