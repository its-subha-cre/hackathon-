# 🎬 K-FIN INTELLIGENCE — Hackathon Demo Script (5–7 Minutes)

This script guides the presenter through demonstrating K-FIN INTELLIGENCE to judges.

---

## ⏱️ Step-by-Step Presentation Flow

### STEP 1: Executive Login & Overview (1 Min)
- **Action**: Open [http://localhost:5173](http://localhost:5173).
- **Script**: *"Welcome to K-FIN Intelligence, the enterprise document-intelligence and policy assistance platform for the Finance Department, Government of Kerala."*
- **Highlight**:
  - Point out the Deep Navy Sidebar (`#0F172A`), Government Seal logo, active user `Anoop Dev`, and Storage Usage meter (`128 GB / 500 GB`).
  - Emphasize the **5 Executive Stat Cards** (Total Seed Documents: 24, GOs: 5, Circulars: 5, Notifications: 3, Clauses: 142) and **Status Donut Chart** (62.5% Active, 29.2% Superseded, 8.3% Amended) calculated dynamically from backend data.

### STEP 2: Synthetic Data Transparency & PDF Explorer (1 Min)
- **Action**: Navigate to **Documents** page. Click `GO(P) No.245/2025/Fin`.
- **Script**: *"Our synthetic seed dataset covers 24 realistic government documents spanning 2021 to 2026. Every test record is explicitly tagged `source_type = SYNTHETIC` with a clear demo disclaimer in the UI."*
- **Highlight**:
  - Center panel PDF viewer showing Page 14 Clause 4.2.
  - Right panel intelligence drawer displaying extracted financial figures (`₹25,50,00,000` / `18% ceiling`) and cross-year document supersession lineage.

### STEP 3: Multi-Model AI Architecture & Security (1 Min)
- **Action**: Navigate to **Admin Settings**.
- **Script**: *"K-FIN features a multi-model AI architecture with strict credential isolation:"*
  - **1. Web-App LLM**: User-configurable in the UI (Gemini 2.5 Flash, OpenAI GPT-4o, Groq Llama 70B).
  - **2. Translation Agent**: System-managed and **READ-ONLY**, permanently running **Groq `llama-3.1-8b-instant`** for Malayalam document translation.
  - **3. Embedding Engine**: System-managed and **READ-ONLY**, permanently running **Gemini Embeddings (`text-embedding-004`)**.

### STEP 4: Hybrid GraphRAG Conversational Intelligence (2 Mins)
- **Action**: Navigate to **AI Chat**. Submit query: *"What is the latest GST reimbursement order?"*
- **Script**: *"Watch how our controlled Hybrid GraphRAG engine handles cross-year policy lineage."*
- **Highlight**:
  - The answer cites **GO(P) No.245/2025/Fin** Clause 4.2 as `ACTIVE` (18% direct reimbursement) and explicitly identifies **GO(P) No.155/2024/Fin** as `SUPERSEDED` (12% interim ceiling).
  - Click the citation link to open Page 14 in the PDF viewer.

### STEP 5: Knowledge Graph & Lineage Traversal (1 Min)
- **Action**: Navigate to **Knowledge Graph**.
- **Script**: *"Here is our interactive Cytoscape.js Neo4j graph visualization showing cross-year supersession chains:"*
  - `GO(P) No.245/2025/Fin` (ACTIVE) → `SUPERSEDES` → `GO(P) No.155/2024/Fin` (SUPERSEDED) → `SUPERSEDES` → `GO(P) No.100/2022/Fin` (SUPERSEDED).

### STEP 6: Policy Note Assistant & Benchmark Analytics (1 Min)
- **Action**: Navigate to **Policy Notes**, then **Analytics**.
- **Script**: *"Finally, our Policy Note Assistant drafts source-backed policy briefs with a mandatory human review warning header. Our automated benchmark evaluation demonstrates 100% Recall@5 and 0.0% Unauthorized Retrieval Rate under strict RBAC."*
