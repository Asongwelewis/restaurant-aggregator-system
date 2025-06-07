from fastapi import FastAPI
from app.routers import restaurants, ratings, search

app = FastAPI(
    title="RAS Platform API",
    description="Restaurant Aggregator System API",
    version="1.0.0"
)

app.include_router(restaurants.router, prefix="/api/restaurants", tags=["Restaurants"])
app.include_router(ratings.router, prefix="/api/ratings", tags=["Ratings"])
app.include_router(search.router, prefix="/api/search", tags=["Search"])

@app.get("/")
def read_root():
    return {"message": "Welcome to odis the best food Platform API"}