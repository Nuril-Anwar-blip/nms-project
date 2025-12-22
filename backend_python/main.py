from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import olts, onus, alarms, provisioning, locations, maps, client_api

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NMS ZTE OLT API",
    description="Network Management System for ZTE OLT",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(olts.router, prefix="/api/olts", tags=["OLTs"])
app.include_router(onus.router, prefix="/api/onus", tags=["ONUs"])
app.include_router(alarms.router, prefix="/api/alarms", tags=["Alarms"])
app.include_router(provisioning.router, prefix="/api/provisioning", tags=["Provisioning"])
app.include_router(locations.router, prefix="/api/locations", tags=["Locations"])
app.include_router(maps.router, prefix="/api/maps", tags=["Maps"])
app.include_router(client_api.router, tags=["Client API"])

@app.get("/")
async def root():
    return {"message": "NMS ZTE OLT API", "version": "1.0.0"}

@app.get("/api/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

