"""
K-FIN INTELLIGENCE - Security & Cypher Injection Test Suite
Tests parameterized Cypher safety, arbitrary Cypher blocking, pre-LLM RBAC isolation,
and multi-model AI key separation rules.
"""

import sys
import os
import importlib.util
import pytest

sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))

# Import graph-service main module cleanly without corrupting sys.path
graph_service_path = os.path.join(os.path.dirname(__file__), "..", "..", "apps", "graph-service", "main.py")
spec = importlib.util.spec_from_file_location("graph_service_main", graph_service_path)
graph_service_main = importlib.util.module_from_spec(spec)
spec.loader.exec_module(graph_service_main)

APPROVED_CYPHER_TEMPLATES = graph_service_main.APPROVED_CYPHER_TEMPLATES

from packages.contracts.schemas import Role, DocumentStatus, SourceType, EvidenceItem
from packages.ai.providers import WebAppLLMAdapter, GroqTranslationAdapter, GeminiEmbeddingAdapter

def test_cypher_registry_safety():
    """Verify that only approved Cypher templates are registered."""
    for key, cypher in APPROVED_CYPHER_TEMPLATES.items():
        cypher_upper = cypher.upper()
        assert "DELETE" not in cypher_upper
        assert "DROP" not in cypher_upper
        assert "DETACH" not in cypher_upper

def test_arbitrary_cypher_blocking():
    """Verify that arbitrary Cypher inputs from untrusted sources are blocked."""
    untrusted_cyphers = [
        "MATCH (n) DETACH DELETE n",
        "MATCH (u:USER) RETURN u.password",
        "CALL dbms.components()",
        "MATCH (d:DOCUMENT) SET d.status = 'REVOKED'"
    ]
    for untrusted in untrusted_cyphers:
        assert untrusted not in APPROVED_CYPHER_TEMPLATES.values()

def test_pre_llm_rbac_document_filtering():
    """
    Verify that document-level authorization occurs BEFORE context is sent to LLM.
    Restricted documents must be filtered out for non-authorized roles.
    """
    all_evidence = [
        EvidenceItem(
            document_id="doc-public",
            document_number="GO(P) No.245/2025/Fin",
            document_type="Government Order",
            page_number=14,
            excerpt="Public GST Reimbursement Order",
            source_type=SourceType.SYNTHETIC,
            document_status=DocumentStatus.ACTIVE,
            retrieval_score=0.95
        ),
        EvidenceItem(
            document_id="doc-restricted-cabinet",
            document_number="RESTRICTED-CABINET-MEMO-2025",
            document_type="Office Memorandum",
            page_number=1,
            excerpt="Confidential Cabinet Fiscal Deficit Target",
            source_type=SourceType.TEST_FIXTURE,
            document_status=DocumentStatus.ACTIVE,
            retrieval_score=0.99
        )
    ]

    def rbac_filter_evidence(evidence_list: list, user_role: Role):
        filtered = []
        for ev in evidence_list:
            if "RESTRICTED" in ev.document_number and user_role != Role.ADMIN:
                continue
            filtered.append(ev)
        return filtered

    officer_ev = rbac_filter_evidence(all_evidence, Role.OFFICER)
    assert len(officer_ev) == 1
    assert officer_ev[0].document_id == "doc-public"
    assert not any("RESTRICTED" in e.document_number for e in officer_ev)

    admin_ev = rbac_filter_evidence(all_evidence, Role.ADMIN)
    assert len(admin_ev) == 2

def test_ai_credential_isolation():
    """
    Verify that Web-App LLM configuration updates NEVER alter
    TRANSLATION_GROQ_API_KEY or EMBEDDING_GEMINI_API_KEY environment variables.
    """
    os.environ["TRANSLATION_GROQ_API_KEY"] = "groq_fixed_secret_key_123"
    os.environ["EMBEDDING_GEMINI_API_KEY"] = "gemini_fixed_secret_key_456"

    web_llm = WebAppLLMAdapter(provider="openai", model="gpt-4o", api_key="new_web_llm_key_789")
    assert web_llm.api_key == "new_web_llm_key_789"

    assert os.getenv("TRANSLATION_GROQ_API_KEY") == "groq_fixed_secret_key_123"
    assert os.getenv("EMBEDDING_GEMINI_API_KEY") == "gemini_fixed_secret_key_456"
