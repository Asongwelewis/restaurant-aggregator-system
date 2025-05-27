from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from restaurants import router as restaurants_router
from ratings import router as ratings_router
from auth import router as auth_router  # Add this import

app = FastAPI(title="Restaurant API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include auth router first
app.include_router(auth_router, prefix="/api/v1")
app.include_router(restaurants_router, prefix="/api/v1")
app.include_router(ratings_router, prefix="/api/v1")

@app.get("/")
def health_check():
    return dict(status="ok")