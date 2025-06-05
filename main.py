from fastapi import FastAPI
from app.routers import restaurants, ratings, search  

app = FastAPI()

app.include_router(restaurants.router, prefix="/api/restaurants")
app.include_router(ratings.router, prefix="/api/ratings")
app.include_router(search.router, prefix="/api/search")

@app.get("/")
def read_root():
    return {"message": "welcome to odis the best app for your food "}
