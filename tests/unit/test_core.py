"""
K-FIN INTELLIGENCE - Core Unit Test Suite
"""

import sys
import os
import json
import pytest

sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))

from packages.contracts.schemas import (
    Role, DocumentType, DocumentStatus, DocumentMetadata, ChatRequest,
    WebAppLLMConfig, SystemAIConfig
)
from packages.ai.providers import WebAppLLMAdapter, GroqTranslationAdapter, GeminiEmbeddingAdapter

def test_document_metadata_schema():
    doc = DocumentMetadata(
        id="doc-2025-245",
        document_number="GO(P) No.245/2025/Fin",
        document_type=DocumentType.GOVERNMENT_ORDER,
        title="Test Order",
        subject="GST",
        issuing_authority="Finance Department",
        year=2025,
        issue_date="2025-03-12",
        effective_date="2025-04-01",
        checksum="abc123hash",
        storage_key="docs/2025/test.pdf"
    )
    assert doc.year == 2025
    assert doc.status == DocumentStatus.ACTIVE

def test_web_app_llm_adapter_fallback():
    adapter = WebAppLLMAdapter(provider="gemini", model="gemini-2.5-flash", api_key="mock_key")
    res = adapter.generate("What is the latest GST reimbursement order?")
    assert "GO(P) No.245/2025/Fin" in res
    assert "18%" in res

def test_groq_translation_adapter_fallback():
    adapter = GroqTranslationAdapter(api_key="mock_key")
    res = adapter.translate_document("ധനകാര്യ വകുപ്പ് - ജി.എസ്.ടി തിരിച്ചടവ് ചട്ടങ്ങൾ", source_language="ml")
    assert res["original_language"] == "ml"
    assert res["translated_language"] == "en"
    assert res["model"] == "llama-3.1-8b-instant"

def test_gemini_embedding_adapter_fallback():
    adapter = GeminiEmbeddingAdapter(api_key="mock_key", dimension=768)
    vec = adapter.embed_text("GST reimbursement rules Kerala")
    assert len(vec) == 768
    assert isinstance(vec[0], float)

def test_system_ai_config_isolation():
    cfg = SystemAIConfig(
        web_app_llm=WebAppLLMConfig(provider="gemini", model="gemini-2.5-flash")
    )
    assert cfg.translation_service["provider"] == "groq"
    assert cfg.translation_service["model"] == "llama-3.1-8b-instant"
    assert cfg.embedding_engine["provider"] == "gemini"
    assert cfg.embedding_engine["model"] == "text-embedding-004"
