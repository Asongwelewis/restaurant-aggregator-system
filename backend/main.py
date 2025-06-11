from fastapi import FastAPI
from app.routers import restaurants, ratings, search, menu ,notifications, users, reservations

app = FastAPI(
    title="RAS Platform API",
    description="Restaurant Aggregator System API",
    version="1.0.0"
)

app.include_router(restaurants.router, prefix="/api/restaurants", tags=["Restaurants"])
app.include_router(ratings.router, prefix="/api/ratings", tags=["Ratings"])
app.include_router(search.router, prefix="/api/search", tags=["Search"])
app.include_router(restaurants.router, prefix="/api/notifications", tags=["notifications"])
app.include_router(menu.router,prefix="/api/menu", tags=["Menu"])
app.include_router(users.router, prefix="/api/users")
app.include_router(reservations.router, prefix="/api/reservations", tags=["Reservations"])

@app.get("/")
def read_root():
    return {"message": "Welcome to odis the best food Platform API"}