# Security, RBAC & Parameterized Cypher Specification

## Role-Based Access Control (RBAC) Matrix

| Role | Dashboard | AI Chat | Search | View PDF | Knowledge Graph | Upload PDF | Policy Note Generator | Admin & AI Wizard |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **OFFICER** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **DOCUMENT_MANAGER** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **POLICY_ANALYST** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **ADMIN** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🛡️ Pre-LLM Data Authorization Pipeline

```
USER
  ↓
Keycloak JWT Token
  ↓
FastAPI Gateway Validation
  ↓
RBAC Role Authorization
  ↓
DOCUMENT ACCESS POLICY FILTERING
  ↓
[UNAUTHORIZED DOCUMENTS EXCLUDED (Count = 0)]
  ↓
LLM Context Assembly
```

Unauthorized document chunks are filtered out **BEFORE** context is sent to the LLM.

---

## 🔒 Parameterized Cypher & Injection Defense

To prevent Cypher injection or unauthorized database mutation:
1. All database queries use pre-registered templates in `APPROVED_CYPHER_TEMPLATES`.
2. Destructive Cypher queries (`DETACH DELETE`, `DELETE`, `DROP`, `SET`, `CREATE`) from user inputs or untrusted query planners are automatically rejected.
3. Tested via `tests/unit/test_security.py`.

---

## 🔑 Multi-Model AI Credential Isolation
- `WEB_APP_LLM_API_KEY`: Managed via UI AI Model Wizard.
- `TRANSLATION_GROQ_API_KEY`: Isolated server-side environment variable (`Groq llama-3.1-8b-instant`).
- `EMBEDDING_GEMINI_API_KEY`: Isolated server-side environment variable (`Gemini text-embedding-004`).

The UI AI Model Wizard cannot view or alter Groq translation or Gemini embedding keys.
