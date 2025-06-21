from fastapi import FastAPI
from app.routers import restaurants

app = FastAPI(
    title="Restaurant API",
    description="API for managing restaurants - Development Mode (No Auth)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url=None
)

app.include_router(
    restaurants.router,
    prefix="/restaurants",
    tags=["restaurants"]
)

@app.get("/")
def read_root():
    return {"message": "Restaurant API - Running in development mode (no authentication)"}