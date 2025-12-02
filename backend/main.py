from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.routes import metrics

# Load environment variables
load_dotenv()

app = FastAPI(title="GitHub Metrics Service", version="1.0.0")

import os

# Configure CORS
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(metrics.router, prefix="/api", tags=["metrics"])

@app.get("/")
async def root():
    return {"message": "GitHub Metrics Service API"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

