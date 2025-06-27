from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, bookings, restaurants, meals, search

app = FastAPI(
    title="Restaurant Aggregator System API",
    description="API for Restaurant Aggregator System with authentication",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(bookings.router, prefix="/api")
app.include_router(restaurants.router, prefix="/api")
app.include_router(meals.router, prefix="/api")
app.include_router(search.router, prefix="/api")

@app.get("/")
async def root():
    return {
        "message": "Restaurant Aggregator System API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "Restaurant Aggregator System API is running"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="192.168.66.36", port=8000) 