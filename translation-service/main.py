"""
K-FIN INTELLIGENCE - Translation Service
Fixed Service running Groq llama-3.1-8b-instant to translate Malayalam/non-English text to English.
"""

import sys
import os
import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))
from packages.ai.providers import GroqTranslationAdapter

app = FastAPI(title="K-FIN Translation Service", version="1.0.0")
logger = logging.getLogger("kfin.translation_service")

adapter = GroqTranslationAdapter()

class TranslationRequest(BaseModel):
    document_id: str
    original_text: str
    source_language: str = "ml"

@app.post("/translate")
def translate_document(req: TranslationRequest):
    logger.info(f"Received translation request for doc_id={req.document_id}, lang={req.source_language}")
    result = adapter.translate_document(req.original_text, req.source_language)
    return result

@app.get("/health")
def health():
    return {"status": "ONLINE", "provider": "Groq", "model": "llama-3.1-8b-instant"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
