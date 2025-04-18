from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="SMEE Backend API")

# تنظیمات CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SensoryInput(BaseModel):
    visual_data: str
    audio_data: str
    tactile_data: str
    biosensor_data: dict

@app.get("/")
async def root():
    return {"message": "SMEE Backend API is running"}

@app.post("/process-sensory-input")
async def process_sensory_input(input: SensoryInput):
    try:
        # TODO: پیاده‌سازی پردازش داده‌های حسی
        return {"status": "success", "message": "Sensory data processed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 