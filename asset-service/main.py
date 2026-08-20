"""
K-FIN INTELLIGENCE - Asset Service
Generates short-lived signed MinIO/S3 URLs for original PDFs, page renderings, and extracted assets.
"""

from fastapi import FastAPI
app = FastAPI(title="K-FIN Asset Service", version="1.0.0")

@app.get("/health")
def health():
    return {"status": "ONLINE", "object_storage": "MinIO S3"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8009)
