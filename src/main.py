from fastapi import FastAPI
from routes import menus, bookings, ratings, status, search

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to the RAS Restaurant Booking API 🚀"}

app.include_router(menus.router)
app.include_router(bookings.router)
app.include_router(ratings.router)
app.include_router(status.router)
app.include_router(search.router)
