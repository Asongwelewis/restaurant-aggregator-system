from fastapi import APIRouter, HTTPException
from firebase_setup import db

router = APIRouter()

@router.post("/restaurants/{restaurant_id}/menu")
def add_menu(restaurant_id: str, data: dict):
    try:
        db.collection("menus").document(restaurant_id).set(data)
        return {"message": "Menu added"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/restaurants/{restaurant_id}/menu")
def get_menu(restaurant_id: str):
    doc = db.collection("menus").document(restaurant_id).get()
    if doc.exists:
        return doc.to_dict()
    raise HTTPException(status_code=404, detail="Menu not found")
