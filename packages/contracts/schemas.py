"""
K-FIN INTELLIGENCE - Domain Schemas and API Contracts
"""

from enum import Enum
from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field
from datetime import datetime

# ============================================================
# ENUMS
# ============================================================

class Role(str, Enum):
    ADMIN = "ADMIN"
    USER = "USER"
    OFFICER = "OFFICER"
    DOCUMENT_MANAGER = "DOCUMENT_MANAGER"
    POLICY_ANALYST = "POLICY_ANALYST"

class DocumentType(str, Enum):
    GOVERNMENT_ORDER = "Government Order"
    CIRCULAR = "Circular"
    NOTIFICATION = "Notification"
    OFFICE_MEMORANDUM = "Office Memorandum"
    BUDGET_DOCUMENT = "Budget Document"
    GST_POLICY = "GST Policy"
    REPORT = "Report"

class DocumentStatus(str, Enum):
    DRAFT = "DRAFT"
    ACTIVE = "ACTIVE"
    AMENDED = "AMENDED"
    SUPERSEDED = "SUPERSEDED"
    REVOKED = "REVOKED"
    EXPIRED = "EXPIRED"
    UNKNOWN = "UNKNOWN"

class SourceType(str, Enum):
    OFFICIAL_PUBLIC = "OFFICIAL_PUBLIC"
    SYNTHETIC = "SYNTHETIC"
    TEST_FIXTURE = "TEST_FIXTURE"

class IngestionStatus(str, Enum):
    QUEUED = "QUEUED"
    PROCESSING = "PROCESSING"
    OCR_PROCESSING = "OCR_PROCESSING"
    TRANSLATING = "TRANSLATING"
    EXTRACTING = "EXTRACTING"
    GRAPH_BUILDING = "GRAPH_BUILDING"
    EMBEDDING = "EMBEDDING"
    VALIDATING = "VALIDATING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class PolicyNoteStatus(str, Enum):
    DRAFT = "DRAFT"
    UNDER_REVIEW = "UNDER_REVIEW"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class ConfidenceLevel(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    INSUFFICIENT = "INSUFFICIENT"

# ============================================================
# DOCUMENT & CLAUSE SCHEMAS
# ============================================================

class FinancialFigure(BaseModel):
    id: str
    raw_text: str
    normalized_value: float
    currency: str = "INR"
    unit: str = "absolute"
    page: int
    context: str

class Clause(BaseModel):
    id: str
    clause_number: str
    heading: Optional[str] = None
    text: str
    translated_text: Optional[str] = None
    page: int
    parent_section: Optional[str] = None
    financial_figures: List[FinancialFigure] = []

class Section(BaseModel):
    id: str
    section_number: str
    title: str
    page: int
    clauses: List[Clause] = []

class DocumentReference(BaseModel):
    target_document_number: str
    relationship_type: str  # e.g., SUPERSEDES, AMENDS, REFERENCES
    description: Optional[str] = None

class DocumentMetadata(BaseModel):
    id: str
    document_number: str
    document_type: DocumentType
    title: str
    subject: str
    issuing_authority: str
    department: str = "Finance Department"
    year: int
    issue_date: str
    effective_date: str
    status: DocumentStatus = DocumentStatus.ACTIVE
    source_type: SourceType = SourceType.SYNTHETIC
    original_language: str = "en"
    translated: bool = False
    gst_topics: List[str] = []
    keywords: List[str] = []
    page_count: int = 1
    checksum: str
    storage_key: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class DocumentDetail(BaseModel):
    metadata: DocumentMetadata
    sections: List[Section] = []
    referenced_documents: List[DocumentReference] = []
    lineage_parent_id: Optional[str] = None
    lineage_child_id: Optional[str] = None

# ============================================================
# HYBRID GRAPHRAG & CHAT SCHEMAS
# ============================================================

class EvidenceItem(BaseModel):
    document_id: str
    document_number: str
    document_type: str
    page_number: int
    section: Optional[str] = None
    clause: Optional[str] = None
    excerpt: str
    source_type: SourceType
    document_status: DocumentStatus
    version: str = "1.0"
    retrieval_score: float
    graph_score: float = 1.0
    authority_score: float = 1.0

class QueryIntent(str, Enum):
    CURRENT_POLICY = "CURRENT_POLICY"
    DOCUMENT_LOOKUP = "DOCUMENT_LOOKUP"
    SEMANTIC_SEARCH = "SEMANTIC_SEARCH"
    DOCUMENT_LINEAGE = "DOCUMENT_LINEAGE"
    VERSION_COMPARISON = "VERSION_COMPARISON"
    CLAUSE_LOOKUP = "CLAUSE_LOOKUP"
    FINANCIAL_FIGURE_LOOKUP = "FINANCIAL_FIGURE_LOOKUP"
    GST_RESEARCH = "GST_RESEARCH"
    POLICY_NOTE = "POLICY_NOTE"
    GENERAL_QA = "GENERAL_QA"

class ChatRequest(BaseModel):
    conversation_id: str
    question: str
    user_role: Role = Role.OFFICER
    selected_model: Optional[str] = None

class Citation(BaseModel):
    document_number: str
    document_id: str
    page_number: int
    clause_number: Optional[str] = None
    status: DocumentStatus
    excerpt: str
    signed_url: Optional[str] = None

class ChatResponse(BaseModel):
    conversation_id: str
    answer: str
    intent: QueryIntent
    confidence: ConfidenceLevel
    citations: List[Citation] = []
    evidence_items: List[EvidenceItem] = []
    suggested_followups: List[str] = []
    model_used: str

# ============================================================
# POLICY NOTE SCHEMAS
# ============================================================

class PolicyNoteSection(BaseModel):
    title: str
    content: str
    citations: List[Citation] = []

class PolicyNote(BaseModel):
    id: str
    title: str
    topic: str
    created_by: str
    status: PolicyNoteStatus = PolicyNoteStatus.DRAFT
    subject: str
    background: str
    existing_position: str
    current_position: str
    changes: str
    financial_implications: str
    gst_implications: str
    recommendations: str
    citations: List[Citation] = []
    ai_generated_warning: str = "AI GENERATED DRAFT - REQUIRES HUMAN REVIEW AND APPROVAL"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# ============================================================
# MULTI-MODEL AI CONFIGURATION SCHEMAS
# ============================================================

class WebAppLLMConfig(BaseModel):
    provider: str = "gemini"  # gemini, openai, azure, groq
    model: str = "gemini-2.5-flash"
    temperature: float = 0.2
    max_tokens: int = 4096
    api_key_masked: str = "••••••••••••••••"

class SystemAIConfig(BaseModel):
    web_app_llm: WebAppLLMConfig
    translation_service: Dict[str, Any] = {
        "provider": "groq",
        "model": "llama-3.1-8b-instant",
        "status": "FIXED_SYSTEM_SERVICE"
    }
    embedding_engine: Dict[str, Any] = {
        "provider": "gemini",
        "model": "text-embedding-004",
        "status": "FIXED_SYSTEM_SERVICE"
    }

# ============================================================
# AUDIT & SYSTEM METRICS SCHEMAS
# ============================================================

class AuditEvent(BaseModel):
    id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    user_id: str
    role: Role
    action: str
    resource_type: str
    resource_id: Optional[str] = None
    status: str = "SUCCESS"
    details: Optional[str] = None

class DashboardStats(BaseModel):
    total_documents: int
    government_orders: int
    circulars: int
    notifications: int
    clauses_extracted: int
    active_percentage: float
    superseded_percentage: float
    amended_percentage: float
    used_storage_bytes: int
    limit_storage_bytes: int
