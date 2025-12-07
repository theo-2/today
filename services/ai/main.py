from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Today AI Service")


class ItemPayload(BaseModel):
    id: str
    title: str
    content: str | None = None


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/categorize")
async def categorize(item: ItemPayload):
    # Placeholder: return a single inferred category
    return {"category": "inbox", "confidence": 0.6}


@app.post("/prioritize")
async def prioritize(item: ItemPayload):
    # Placeholder: compute a simple priority score
    score = 1
    if item.title:
        score += 1
    return {"priority": score}


@app.post("/embed")
async def embed(item: ItemPayload):
    # Placeholder: return a fake vector
    return {"vector": [0.0, 0.1, 0.2]}
