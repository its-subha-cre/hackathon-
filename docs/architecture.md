# K-FIN INTELLIGENCE — System Architecture

```mermaid
graph TD
    Client[React/TypeScript Web App] --> Gateway[API Gateway / FastAPI]
    Gateway --> Auth[Keycloak JWT & RBAC]
    Gateway --> DocSvc[Document Service]
    Gateway --> IngestSvc[Ingestion Pipeline]
    Gateway --> TransSvc[Translation Service - Groq Llama 3.1 8B]
    Gateway --> GraphSvc[Graph Service - Neo4j Ontology]
    Gateway --> RetrSvc[Retrieval Engine - Gemini Vector Search]
    Gateway --> PolicySvc[Policy Note Assistant]
    Gateway --> EvalSvc[Evaluation Service]

    IngestSvc --> MinIO[(MinIO S3 - PDF Storage)]
    IngestSvc --> TransSvc
    IngestSvc --> RetrSvc
    RetrSvc --> Neo4j[(Neo4j Knowledge Graph)]
    Gateway --> Postgres[(PostgreSQL DB)]
```

## Architecture Summary
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide icons, Recharts, Cytoscape.js, PDF.js.
- **API Gateway**: FastAPI unified routing, JWT validation, rate limiting, and OpenAPI documentation.
- **Multi-Model AI Plane**:
  1. **Web-App LLM**: Configurable in Admin AI Wizard (Gemini, OpenAI, Azure, Groq).
  2. **Translation LLM**: Fixed system service running **Groq `llama-3.1-8b-instant`**.
  3. **Embedding Engine**: Fixed system service running **Gemini Embeddings (`text-embedding-004`)**.
- **Data Layer**: Neo4j (Knowledge Graph), PostgreSQL (Application State & Audit Logs), MinIO (S3 PDF Assets), Redis (Job Queue & Caching).
