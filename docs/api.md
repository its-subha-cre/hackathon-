# K-FIN INTELLIGENCE — OpenAPI Endpoints & Contracts

**Base URL**: `http://localhost:8000/api/v1`  
**Interactive Swagger UI**: `http://localhost:8000/docs`

---

## 🛠️ API Endpoint Summary

| Category | Endpoint | Method | RBAC Roles Allowed | Description |
| :--- | :--- | :---: | :--- | :--- |
| **System** | `/health` | `GET` | All | Service health status and database connectivity |
| **Analytics** | `/analytics/dashboard` | `GET` | All | Dynamic document stats, status distribution, and storage meter |
| **Documents** | `/documents` | `GET` | All | Returns list of registered finance documents |
| **Ingestion** | `/documents/upload` | `POST` | `DOCUMENT_MANAGER`, `ADMIN` | Asynchronous PDF upload, OCR, translation, and graph indexing |
| **Chat** | `/chat` | `POST` | All | Hybrid GraphRAG streaming conversational assistant |
| **Policy Notes** | `/policy-notes` | `GET` | All | Returns list of policy note drafts |
| **Policy Notes** | `/policy-notes/generate` | `POST` | `POLICY_ANALYST`, `ADMIN` | Synthesizes source-backed policy note drafts |
| **Audit** | `/audit` | `GET` | `ADMIN` | Returns security and user activity audit event logs |
| **AI Config** | `/ai-config` | `GET` | All | Returns multi-model AI configuration status |
| **AI Config** | `/ai-config/web-app-llm` | `POST` | `ADMIN` | Updates Web-App LLM provider settings securely |
| **Evaluation** | `/evaluation/run` | `GET` | All | Executes ground-truth benchmark suite and returns metrics |
