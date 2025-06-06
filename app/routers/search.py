from fastapi import APIRouter, HTTPException, Query
from app.firebase.client import rtdb

router = APIRouter(prefix="/search", tags=["Search & Ratings"])

@router.get("/")
def search_restaurants(q: str = Query(...)):
    all_docs = rtdb.collection("restaurants").stream()
    return [doc.to_dict() for doc in all_docs if q.lower() in doc.to_dict().get("name", "").lower()]

