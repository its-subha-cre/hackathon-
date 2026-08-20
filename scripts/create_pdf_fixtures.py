"""
K-FIN INTELLIGENCE - PDF Test Fixtures Generator
Generates machine-readable and scanned image-based PDF test fixtures for ingestion testing.
"""

import os
import fitz  # PyMuPDF

FIXTURES_DIR = os.path.join(os.path.dirname(__file__), "..", "tests", "fixtures")

def generate_pdf_fixtures():
    os.makedirs(FIXTURES_DIR, exist_ok=True)

    # 1. Machine-Readable PDF Fixture: sample_go_2025.pdf
    doc1 = fitz.open()
    page1 = doc1.new_page(width=595, height=842)
    
    lines = [
        "GOVERNMENT OF KERALA",
        "Finance (Rules-A) Department",
        "GO(P) No.245/2025/Fin Dated 12th March 2025",
        "ABSTRACT: Integrated GST Reimbursement Framework for Government Contracts",
        "Section 4: GST Reimbursement Ceiling and Verification Procedure",
        "Clause 4.2 Ceiling Limit for Direct Reimbursement:",
        "Departments are authorized to process GST reimbursement claims up to 18% directly against verified e-way bills and GSTR-1 filings.",
        "Annual budget threshold per district treasury INR 25,50,00,000.",
        "This provision supersedes Clause 3.1 of GO(P) No.155/2024/Fin."
    ]
    
    y = 50
    for line in lines:
        page1.insert_text((50, y), line, fontsize=11, fontname="helv")
        y += 25
    
    go_path = os.path.join(FIXTURES_DIR, "sample_go_2025.pdf")
    doc1.save(go_path)
    doc1.close()
    print(f"[SUCCESS] Created machine-readable PDF fixture at {go_path}")

    # 2. Scanned / Image-Based PDF Fixture: scanned_malayalam_order.pdf
    doc2 = fitz.open()
    page2_temp = doc2.new_page(width=595, height=842)
    mal_text = (
        "GOVERNMENT OF KERALA - FINANCE DEPARTMENT\n"
        "GO(P) No.301/2025/Fin Dated 15th March 2025\n\n"
        "dhana kaaryam - GST Reimbursement Rules 2025\n"
        "Section 4.2: 18% GST reimbursement authorized.\n"
        "Amount: INR 25,50,00,000 ceiling limit."
    )
    page2_temp.insert_text((50, 100), mal_text, fontsize=11, fontname="helv")
    pix = page2_temp.get_pixmap(dpi=150)
    
    doc2_scanned = fitz.open()
    scanned_page = doc2_scanned.new_page(width=595, height=842)
    scanned_page.insert_image(scanned_page.rect, stream=pix.tobytes())
    
    scanned_path = os.path.join(FIXTURES_DIR, "scanned_malayalam_order.pdf")
    doc2_scanned.save(scanned_path)
    doc2_scanned.close()
    doc2.close()
    print(f"[SUCCESS] Created scanned image-based PDF fixture at {scanned_path}")

if __name__ == "__main__":
    generate_pdf_fixtures()
