from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from google import genai

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client(api_key="AQ.Ab8RN6J-IfZXRKFn64ob6LjcMG2jjZRnvv6IypxusshYZSdgfw")

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def home():
    return {"message": "AI Backend Server Running!"}

@app.post("/chat")
def chat(req: ChatRequest):
    def event_generator():
        try:
            response = client.models.generate_content_stream(
                model="models/gemini-3.5-flash-lite",
                contents=req.message,
            )
            for chunk in response:
                if chunk.text:
                    yield chunk.text
        except Exception as e:
            yield f"Error: {str(e)}"

    return StreamingResponse(event_generator(), media_type="text/plain")