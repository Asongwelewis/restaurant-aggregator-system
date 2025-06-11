from fastapi import APIRouter, HTTPException
from app.firebase.client import rtdb

router = APIRouter(prefix="/menu", tags=["Menu"])

@router.post("/")
def add_menu_item(item: dict):
    ref = rtdb.child("menu").push(item)
    return {"message": "Menu item added", "id": ref.key}

@router.get("/daily")
def get_daily_posts():
    data = rtdb.child("menu").order_by_child("category").equal_to("daily").get()
    return list(data.values()) if data else []

@router.get("/exclusive")
def get_exclusive():
    data = rtdb.child("menu").order_by_child("category").equal_to("exclusive").get()
    return list(data.values()) if data else []

@router.get("/popular")
def get_popular():
    data = rtdb.child("menu").order_by_child("category").equal_to("popular").get()
    return list(data.values()) if data else []