"""
K-FIN INTELLIGENCE - Document Service
Document metadata registry, duplicate detection, and version status management.
"""

from fastapi import FastAPI
app = FastAPI(title="K-FIN Document Service", version="1.0.0")

@app.get("/health")
def health():
    return {"status": "ONLINE"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
