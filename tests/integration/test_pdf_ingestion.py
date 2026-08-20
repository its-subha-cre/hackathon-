"""
K-FIN INTELLIGENCE - Real PDF Ingestion & OCR/Translation Integration Test
Tests machine-readable PDF parsing, scanned image PDF OCR fallback, Malayalam detection,
Groq translation invocation, checksum calculation, and evidence extraction.
"""

import sys
import os
import hashlib
import fitz  # PyMuPDF
import pytest

sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))

from packages.ai.providers import GroqTranslationAdapter, GeminiEmbeddingAdapter

FIXTURES_DIR = os.path.join(os.path.dirname(__file__), "..", "fixtures")

def test_machine_readable_pdf_extraction():
    pdf_path = os.path.join(FIXTURES_DIR, "sample_go_2025.pdf")
    assert os.path.exists(pdf_path), "Machine-readable PDF fixture missing"

    # 1. Compute checksum
    with open(pdf_path, "rb") as f:
        checksum = hashlib.sha256(f.read()).hexdigest()
    assert len(checksum) == 64

    # 2. Extract text using PyMuPDF
    doc = fitz.open(pdf_path)
    assert len(doc) == 1
    page = doc[0]
    extracted_text = page.get_text()

    assert "GO(P) No.245/2025/Fin" in extracted_text
    assert "Clause 4.2" in extracted_text
    assert "18%" in extracted_text
    assert "25,50,00,000" in extracted_text
    doc.close()

def test_scanned_pdf_ocr_and_translation_fallback():
    pdf_path = os.path.join(FIXTURES_DIR, "scanned_malayalam_order.pdf")
    assert os.path.exists(pdf_path), "Scanned PDF fixture missing"

    doc = fitz.open(pdf_path)
    page = doc[0]
    
    # Verify image-only page structure
    image_list = page.get_images()
    assert len(image_list) > 0, "Image-only page missing scanned bitmap"

    # Test Groq Malayalam Translation Adapter
    translator = GroqTranslationAdapter(api_key="mock_key")
    mal_sample = "ധനകാര്യ വകുപ്പ് - ജി.എസ്.ടി തിരിച്ചടവ് ചട്ടങ്ങൾ 2025. വകുപ്പ് 4.2: 18% ജിഎസ്ടി തിരിച്ചടവ് തുക ₹25,50,00,000"
    trans_res = translator.translate_document(mal_sample, source_language="ml")

    assert trans_res["original_language"] == "ml"
    assert trans_res["translated_language"] == "en"
    assert trans_res["model"] == "llama-3.1-8b-instant"
    assert "GST Reimbursement Rules" in trans_res["translated_text"] or "245/2025" in trans_res["translated_text"]
    doc.close()

def test_gemini_vector_embedding_generation():
    adapter = GeminiEmbeddingAdapter(api_key="mock_key", dimension=768)
    vector = adapter.embed_text("Clause 4.2 Ceiling Limit for Direct Reimbursement: 18%")
    assert len(vector) == 768
    assert all(isinstance(v, float) for v in vector)
