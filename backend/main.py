from fastapi import FastAPI
from routes import router

app = FastAPI(docs_url="/docs", redoc_url="/redoc")

# Include routes
app.include_router(router)

@app.get("/")
def read_root():
    return {"message": "Welcome to SaaS Inventory!"}
