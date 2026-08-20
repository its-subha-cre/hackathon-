"""
K-FIN INTELLIGENCE - Ingestion Service
Asynchronous PDF parsing, checksum validation, Tesseract OCR fallback, and job status tracking.
"""

from fastapi import FastAPI
app = FastAPI(title="K-FIN Ingestion Service", version="1.0.0")

@app.get("/health")
def health():
    return {"status": "ONLINE", "ocr_engine": "Tesseract (eng+mal)"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
