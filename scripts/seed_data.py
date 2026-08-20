"""
K-FIN INTELLIGENCE - Expanded Synthetic Kerala Finance Dataset Generator (2021 - 2026)
Generates 24 realistic synthetic Government Orders, Circulars, Notifications,
Budget Documents, GST Policies, and Malayalam translation samples with cross-year lineage chains.
"""

import json
import os

SEED_DOCUMENTS = [
    # ============================================================
    # LINEAGE CHAIN 1: GST REIMBURSEMENT (2022 -> 2024 -> 2025)
    # ============================================================
    {
        "id": "doc-2025-245",
        "document_number": "GO(P) No.245/2025/Fin",
        "document_type": "Government Order",
        "title": "Integrated GST Reimbursement Framework for Government Infrastructure Contracts",
        "subject": "GST Reimbursement Procedure & Treasury Verification",
        "issuing_authority": "Finance (Rules-A) Department",
        "department": "Finance Department, Government of Kerala",
        "year": 2025,
        "issue_date": "2025-03-12",
        "effective_date": "2025-04-01",
        "status": "ACTIVE",
        "source_type": "SYNTHETIC",
        "original_language": "en",
        "translated": False,
        "gst_topics": ["GST Reimbursement", "Input Tax Credit", "Treasury Audit"],
        "keywords": ["GST", "Reimbursement", "e-Way Bill", "Infrastructure", "Treasury"],
        "page_count": 18,
        "checksum": "sha256-a1b2c3d4e5f62452025",
        "storage_key": "documents/2025/GO-245-2025/original.pdf",
        "sections": [
            {
                "id": "sec-245-1",
                "section_number": "Section 4",
                "title": "GST Reimbursement Ceiling and Verification Procedure",
                "page": 14,
                "clauses": [
                    {
                        "id": "cls-245-4.2",
                        "clause_number": "4.2",
                        "heading": "Ceiling Limit for Direct Reimbursement",
                        "text": "Departments are authorized to process GST reimbursement claims up to 18% directly against verified e-way bills and GSTR-1 filings. This provision supersedes Clause 3.1 of GO(P) No.155/2024/Fin.",
                        "page": 14,
                        "parent_section": "Section 4",
                        "financial_figures": [
                            {
                                "id": "fig-245-1",
                                "raw_text": "18%",
                                "normalized_value": 0.18,
                                "currency": "PERCENT",
                                "unit": "percentage",
                                "page": 14,
                                "context": "up to 18% directly against verified e-way bills"
                            },
                            {
                                "id": "fig-245-2",
                                "raw_text": "₹25,50,00,000",
                                "normalized_value": 255000000.0,
                                "currency": "INR",
                                "unit": "crore",
                                "page": 14,
                                "context": "Annual budget threshold per district treasury ₹25,50,00,000"
                            }
                        ]
                    }
                ]
            }
        ],
        "referenced_documents": [
            {
                "target_document_number": "GO(P) No.155/2024/Fin",
                "relationship_type": "SUPERSEDES",
                "description": "Supersedes previous 12% ceiling limit under Clause 3.1"
            }
        ]
    },
    {
        "id": "doc-2024-155",
        "document_number": "GO(P) No.155/2024/Fin",
        "document_type": "Government Order",
        "title": "Interim GST Settlement Mechanism for Public Works",
        "subject": "Interim GST Reimbursement Guidelines",
        "issuing_authority": "Finance (Rules) Department",
        "department": "Finance Department, Government of Kerala",
        "year": 2024,
        "issue_date": "2024-02-28",
        "effective_date": "2024-03-01",
        "status": "SUPERSEDED",
        "source_type": "SYNTHETIC",
        "original_language": "en",
        "translated": False,
        "gst_topics": ["GST Reimbursement", "Public Works"],
        "keywords": ["GST", "Reimbursement", "Interim", "Public Works"],
        "page_count": 12,
        "checksum": "sha256-b2c3d4e5f6a11552024",
        "storage_key": "documents/2024/GO-155-2024/original.pdf",
        "sections": [
            {
                "id": "sec-155-3",
                "section_number": "Section 3",
                "title": "Interim Reimbursement Ceiling",
                "page": 8,
                "clauses": [
                    {
                        "id": "cls-155-3.1",
                        "clause_number": "3.1",
                        "heading": "Interim 12% Limit",
                        "text": "Initial GST reimbursement shall not exceed 12% pending final verification by the Chief Inspector of Finance.",
                        "page": 8,
                        "parent_section": "Section 3",
                        "financial_figures": [
                            {
                                "id": "fig-155-1",
                                "raw_text": "12%",
                                "normalized_value": 0.12,
                                "currency": "PERCENT",
                                "unit": "percentage",
                                "page": 8,
                                "context": "shall not exceed 12% pending final verification"
                            }
                        ]
                    }
                ]
            }
        ],
        "referenced_documents": [
            {
                "target_document_number": "GO(P) No.100/2022/Fin",
                "relationship_type": "SUPERSEDES",
                "description": "Superseded old 2022 works contract GST order"
            }
        ]
    },
    {
        "id": "doc-2022-100",
        "document_number": "GO(P) No.100/2022/Fin",
        "document_type": "Government Order",
        "title": "Implementation of Tax Modifications in Public Procurement",
        "subject": "GST Tax Structure for Procurement Contracts",
        "issuing_authority": "Finance (Tax) Department",
        "department": "Finance Department, Government of Kerala",
        "year": 2022,
        "issue_date": "2022-05-15",
        "effective_date": "2022-06-01",
        "status": "SUPERSEDED",
        "source_type": "SYNTHETIC",
        "original_language": "en",
        "translated": False,
        "gst_topics": ["Tax Modifications", "Procurement"],
        "keywords": ["GST", "Procurement", "Tax Rate"],
        "page_count": 10,
        "checksum": "sha256-c3d4e5f6a1b21002022",
        "storage_key": "documents/2022/GO-100-2022/original.pdf",
        "sections": [],
        "referenced_documents": []
    },

    # ============================================================
    # LINEAGE CHAIN 2: CAPITAL BUDGET SANCTIONS (2021 -> 2023 -> 2025)
    # ============================================================
    {
        "id": "doc-2025-45",
        "document_number": "Circular No.45/2025/Fin",
        "document_type": "Circular",
        "title": "Guidelines on Capital Budget Allocation and Fund Utilization 2025-26",
        "subject": "Capital Expenditure Ceiling & Treasury Sanction Limits",
        "issuing_authority": "Finance (Budget) Department",
        "department": "Finance Department, Government of Kerala",
        "year": 2025,
        "issue_date": "2025-03-10",
        "effective_date": "2025-04-01",
        "status": "ACTIVE",
        "source_type": "SYNTHETIC",
        "original_language": "en",
        "translated": False,
        "gst_topics": ["Capital Budget"],
        "keywords": ["Budget", "Capital Expenditure", "Treasury", "Sanction"],
        "page_count": 8,
        "checksum": "sha256-d4e5f6a1b2c30452025",
        "storage_key": "documents/2025/CIRCULAR-45-2025/original.pdf",
        "sections": [
            {
                "id": "sec-45-1",
                "section_number": "Section 2",
                "title": "Sanction Limits",
                "page": 4,
                "clauses": [
                    {
                        "id": "cls-45-2.1",
                        "clause_number": "2.1",
                        "heading": "Departmental Sanction Ceiling",
                        "text": "Head of Departments are empowered to accord financial sanction up to ₹15,00,00,000 for approved capital works.",
                        "page": 4,
                        "parent_section": "Section 2",
                        "financial_figures": [
                            {
                                "id": "fig-45-1",
                                "raw_text": "₹15,00,00,000",
                                "normalized_value": 150000000.0,
                                "currency": "INR",
                                "unit": "crore",
                                "page": 4,
                                "context": "accord financial sanction up to ₹15,00,00,000"
                            }
                        ]
                    }
                ]
            }
        ],
        "referenced_documents": [
            {
                "target_document_number": "Circular No.78/2023/Fin",
                "relationship_type": "AMENDS",
                "description": "Amends departmental financial sanction ceiling from ₹10 Crore to ₹15 Crore"
            }
        ]
    },
    {
        "id": "doc-2023-78",
        "document_number": "Circular No.78/2023/Fin",
        "document_type": "Circular",
        "title": "Revision of Financial Sanction Powers for Departmental Heads",
        "subject": "Delegation of Financial Powers 2023",
        "issuing_authority": "Finance (Budget-B) Department",
        "department": "Finance Department, Government of Kerala",
        "year": 2023,
        "issue_date": "2023-06-20",
        "effective_date": "2023-07-01",
        "status": "AMENDED",
        "source_type": "SYNTHETIC",
        "original_language": "en",
        "translated": False,
        "gst_topics": ["Capital Budget"],
        "keywords": ["Budget", "Sanction", "Delegation"],
        "page_count": 6,
        "checksum": "sha256-e6f1a2b3c4782023",
        "storage_key": "documents/2023/CIRCULAR-78-2023/original.pdf",
        "sections": [],
        "referenced_documents": [
            {
                "target_document_number": "Circular No.33/2021/Fin",
                "relationship_type": "AMENDS",
                "description": "Amended earlier 2021 financial power delegation ceiling of ₹5 Crore"
            }
        ]
    },
    {
        "id": "doc-2021-33",
        "document_number": "Circular No.33/2021/Fin",
        "document_type": "Circular",
        "title": "Delegation of Financial Sanction Powers to Heads of Departments",
        "subject": "Initial Financial Power Limits 2021",
        "issuing_authority": "Finance (Budget) Department",
        "department": "Finance Department, Government of Kerala",
        "year": 2021,
        "issue_date": "2021-04-10",
        "effective_date": "2021-05-01",
        "status": "AMENDED",
        "source_type": "SYNTHETIC",
        "original_language": "en",
        "translated": False,
        "gst_topics": ["Capital Budget"],
        "keywords": ["Budget", "Financial Sanction", "Delegation"],
        "page_count": 5,
        "checksum": "sha256-f7a1b2c3d4332021",
        "storage_key": "documents/2021/CIRCULAR-33-2021/original.pdf",
        "sections": [],
        "referenced_documents": []
    },

    # ============================================================
    # LINEAGE CHAIN 3: PUBLIC HEALTH GST EXEMPTIONS (2022 -> 2024 -> 2025)
    # ============================================================
    {
        "id": "doc-2025-98",
        "document_number": "Notification No.98/2025/Fin",
        "document_type": "Notification",
        "title": "Exemption of GST on Essential Public Health Services Procurement",
        "subject": "GST Exemption Notification for Healthcare Equipment",
        "issuing_authority": "Finance (Tax-B) Department",
        "department": "Finance Department, Government of Kerala",
        "year": 2025,
        "issue_date": "2025-03-05",
        "effective_date": "2025-03-10",
        "status": "ACTIVE",
        "source_type": "SYNTHETIC",
        "original_language": "en",
        "translated": False,
        "gst_topics": ["GST Exemption", "Health Procurement"],
        "keywords": ["GST", "Exemption", "Health", "Procurement"],
        "page_count": 6,
        "checksum": "sha256-e5f6a1b2c3d40982025",
        "storage_key": "documents/2025/NOTIF-98-2025/original.pdf",
        "sections": [],
        "referenced_documents": [
            {
                "target_document_number": "Notification No.42/2024/Fin",
                "relationship_type": "SUPERSEDES",
                "description": "Supersedes 2024 health procurement GST exemption schedule"
            }
        ]
    },
    {
        "id": "doc-2024-42",
        "document_number": "Notification No.42/2024/Fin",
        "document_type": "Notification",
        "title": "Revised Tax Concessions for Medical Device Procurement",
        "subject": "Medical Procurement Concessional GST",
        "issuing_authority": "Finance (Tax) Department",
        "department": "Finance Department, Government of Kerala",
        "year": 2024,
        "issue_date": "2024-05-18",
        "effective_date": "2024-06-01",
        "status": "SUPERSEDED",
        "source_type": "SYNTHETIC",
        "original_language": "en",
        "translated": False,
        "gst_topics": ["GST Exemption", "Health Procurement"],
        "keywords": ["GST", "Medical", "Concession"],
        "page_count": 5,
        "checksum": "sha256-a2b3c4d5e6422024",
        "storage_key": "documents/2024/NOTIF-42-2024/original.pdf",
        "sections": [],
        "referenced_documents": [
            {
                "target_document_number": "Notification No.15/2022/Fin",
                "relationship_type": "AMENDS",
                "description": "Amended earlier 2022 notification list"
            }
        ]
    },
    {
        "id": "doc-2022-15",
        "document_number": "Notification No.15/2022/Fin",
        "document_type": "Notification",
        "title": "GST Rates on Healthcare Consumables and Equipment",
        "subject": "Initial Healthcare GST Notification",
        "issuing_authority": "Finance (Tax) Department",
        "department": "Finance Department, Government of Kerala",
        "year": 2022,
        "issue_date": "2022-03-12",
        "effective_date": "2022-04-01",
        "status": "SUPERSEDED",
        "source_type": "SYNTHETIC",
        "original_language": "en",
        "translated": False,
        "gst_topics": ["GST Exemption", "Health Procurement"],
        "keywords": ["GST", "Healthcare", "Rates"],
        "page_count": 4,
        "checksum": "sha256-b3c4d5e6f7152022",
        "storage_key": "documents/2022/NOTIF-15-2022/original.pdf",
        "sections": [],
        "referenced_documents": []
    },

    # ============================================================
    # MALAYALAM SOURCE DOCUMENTS (GROQ TRANSLATION TEST FIXTURES)
    # ============================================================
    {
        "id": "doc-2025-301-mal",
        "document_number": "GO(P) No.301/2025/Fin",
        "document_type": "Government Order",
        "title": "ധനകാര്യ വകുപ്പ് - ജി.എസ്.ടി തിരിച്ചടവ് ചട്ടങ്ങൾ 2025",
        "subject": "Malayalam Source - GST Reimbursement Rules",
        "issuing_authority": "Finance Department",
        "department": "Finance Department, Government of Kerala",
        "year": 2025,
        "issue_date": "2025-03-15",
        "effective_date": "2025-04-01",
        "status": "ACTIVE",
        "source_type": "SYNTHETIC",
        "original_language": "ml",
        "translated": True,
        "gst_topics": ["GST Reimbursement"],
        "keywords": ["GST", "Reimbursement", "Malayalam"],
        "page_count": 5,
        "checksum": "sha256-f6a1b2c3d4e53012025",
        "storage_key": "documents/2025/GO-301-2025-MAL/original.pdf",
        "sections": [],
        "referenced_documents": []
    },
    {
        "id": "doc-2024-88-mal",
        "document_number": "Circular No.88/2024/Fin",
        "document_type": "Circular",
        "title": "ട്രഷറി നിയന്ത്രണ മാർഗ്ഗനിർദ്ദേശങ്ങൾ 2024",
        "subject": "Malayalam Source - Treasury Control Guidelines 2024",
        "issuing_authority": "Finance (Treasury) Department",
        "department": "Finance Department, Government of Kerala",
        "year": 2024,
        "issue_date": "2024-09-10",
        "effective_date": "2024-10-01",
        "status": "ACTIVE",
        "source_type": "SYNTHETIC",
        "original_language": "ml",
        "translated": True,
        "gst_topics": ["Treasury Audit"],
        "keywords": ["Treasury", "Malayalam", "Guidelines"],
        "page_count": 4,
        "checksum": "sha256-c4d5e6f7a8882024",
        "storage_key": "documents/2024/CIRCULAR-88-2024-MAL/original.pdf",
        "sections": [],
        "referenced_documents": []
    },

    # ============================================================
    # ADDITIONAL GOs, CIRCULARS, NOTIFICATIONS, BUDGET & REPORTS
    # ============================================================
    {
        "id": "doc-2026-05",
        "document_number": "GO(P) No.05/2026/Fin",
        "document_type": "Government Order",
        "title": "Advance Budget Expenditure Guidelines for Q1 2026-27",
        "subject": "Advance Ways & Means Limits",
        "issuing_authority": "Finance (Ways & Means) Department",
        "department": "Finance Department, Government of Kerala",
        "year": 2026,
        "issue_date": "2026-01-15",
        "effective_date": "2026-04-01",
        "status": "ACTIVE",
        "source_type": "SYNTHETIC",
        "original_language": "en",
        "translated": False,
        "gst_topics": ["Capital Budget"],
        "keywords": ["Ways and Means", "Advance", "Budget"],
        "page_count": 7,
        "checksum": "sha256-d5e6f7a8052026",
        "storage_key": "documents/2026/GO-05-2026/original.pdf",
        "sections": [],
        "referenced_documents": []
    },
    {
        "id": "doc-2025-budget",
        "document_number": "Budget Doc No.01/2025/Fin",
        "document_type": "Budget Document",
        "title": "Annual Financial Statement and Demands for Grants 2025-26",
        "subject": "Kerala State Budget Allocation 2025-26",
        "issuing_authority": "Finance (Budget) Department",
        "department": "Finance Department, Government of Kerala",
        "year": 2025,
        "issue_date": "2025-02-07",
        "effective_date": "2025-04-01",
        "status": "ACTIVE",
        "source_type": "SYNTHETIC",
        "original_language": "en",
        "translated": False,
        "gst_topics": ["Capital Budget", "Input Tax Credit"],
        "keywords": ["Budget", "Grants", "Expenditure", "Outlay"],
        "page_count": 140,
        "checksum": "sha256-e6f7a8b9budget2025",
        "storage_key": "documents/2025/BUDGET-01-2025/original.pdf",
        "sections": [],
        "referenced_documents": []
    },
    {
        "id": "doc-2024-budget",
        "document_number": "Budget Doc No.01/2024/Fin",
        "document_type": "Budget Document",
        "title": "Demands for Grants and Capital Allocation 2024-25",
        "subject": "State Budget Expenditure Summary 2024",
        "issuing_authority": "Finance (Budget) Department",
        "department": "Finance Department, Government of Kerala",
        "year": 2024,
        "issue_date": "2024-02-05",
        "effective_date": "2024-04-01",
        "status": "SUPERSEDED",
        "source_type": "SYNTHETIC",
        "original_language": "en",
        "translated": False,
        "gst_topics": ["Capital Budget"],
        "keywords": ["Budget", "Outlay", "2024"],
        "page_count": 128,
        "checksum": "sha256-f7a8b9c0budget2024",
        "storage_key": "documents/2024/BUDGET-01-2024/original.pdf",
        "sections": [],
        "referenced_documents": []
    },
    {
        "id": "doc-2023-budget",
        "document_number": "Budget Doc No.01/2023/Fin",
        "document_type": "Budget Document",
        "title": "State Expenditure Plan and Fiscal Policy Strategy 2023-24",
        "subject": "Fiscal Strategy Statement 2023",
        "issuing_authority": "Finance Department",
        "department": "Finance Department, Government of Kerala",
        "year": 2023,
        "issue_date": "2023-02-03",
        "effective_date": "2023-04-01",
        "status": "SUPERSEDED",
        "source_type": "SYNTHETIC",
        "original_language": "en",
        "translated": False,
        "gst_topics": ["Capital Budget"],
        "keywords": ["Fiscal Policy", "Budget"],
        "page_count": 115,
        "checksum": "sha256-a8b9c0d1budget2023",
        "storage_key": "documents/2023/BUDGET-01-2023/original.pdf",
        "sections": [],
        "referenced_documents": []
    },
    {
        "id": "doc-2025-gst-cir11",
        "document_number": "GST Circular 11/2025/Fin",
        "document_type": "GST Policy",
        "title": "Clarification on E-Invoicing and TDS under State GST Act",
        "subject": "GST TDS Compliance Rules for DDOs",
        "issuing_authority": "State Tax Department",
        "department": "Finance Department, Government of Kerala",
        "year": 2025,
        "issue_date": "2025-01-20",
        "effective_date": "2025-02-01",
        "status": "ACTIVE",
        "source_type": "SYNTHETIC",
        "original_language": "en",
        "translated": False,
        "gst_topics": ["GST Returns & Filing", "Input Tax Credit"],
        "keywords": ["GST", "TDS", "E-Invoicing", "DDO"],
        "page_count": 9,
        "checksum": "sha256-b9c0d1e2gstcir11",
        "storage_key": "documents/2025/GST-CIR-11-2025/original.pdf",
        "sections": [],
        "referenced_documents": []
    },
    {
        "id": "doc-2024-gst-ord04",
        "document_number": "GST Order 04/2024/Fin",
        "document_type": "GST Policy",
        "title": "Procedure for Claiming Input Tax Credit on Works Contracts",
        "subject": "Input Tax Credit Guidelines for Contractors",
        "issuing_authority": "State Tax Department",
        "department": "Finance Department, Government of Kerala",
        "year": 2024,
        "issue_date": "2024-04-12",
        "effective_date": "2024-05-01",
        "status": "ACTIVE",
        "source_type": "SYNTHETIC",
        "original_language": "en",
        "translated": False,
        "gst_topics": ["Input Tax Credit", "GST Reimbursement"],
        "keywords": ["GST", "ITC", "Works Contract"],
        "page_count": 11,
        "checksum": "sha256-c0d1e2f3gstord04",
        "storage_key": "documents/2024/GST-ORD-04-2024/original.pdf",
        "sections": [],
        "referenced_documents": []
    },
    {
        "id": "doc-2023-gst-pn09",
        "document_number": "GST Policy Note 09/2023/Fin",
        "document_type": "GST Policy",
        "title": "Composition Scheme Thresholds for Small Scale Procurement",
        "subject": "Composition Scheme Rules",
        "issuing_authority": "Finance (Tax) Department",
        "department": "Finance Department, Government of Kerala",
        "year": 2023,
        "issue_date": "2023-08-15",
        "effective_date": "2023-09-01",
        "status": "ACTIVE",
        "source_type": "SYNTHETIC",
        "original_language": "en",
        "translated": False,
        "gst_topics": ["Composition Scheme"],
        "keywords": ["GST", "Composition", "Threshold"],
        "page_count": 8,
        "checksum": "sha256-d1e2f3a4gstpn09",
        "storage_key": "documents/2023/GST-PN-09-2023/original.pdf",
        "sections": [],
        "referenced_documents": []
    },
    {
        "id": "doc-2022-gst-om02",
        "document_number": "GST Memorandum 02/2022/Fin",
        "document_type": "GST Policy",
        "title": "Verification of GSTR-3B Claims by Treasury Officers",
        "subject": "Treasury GST Verification",
        "issuing_authority": "Finance (Audit) Department",
        "department": "Finance Department, Government of Kerala",
        "year": 2022,
        "issue_date": "2022-11-10",
        "effective_date": "2022-12-01",
        "status": "SUPERSEDED",
        "source_type": "SYNTHETIC",
        "original_language": "en",
        "translated": False,
        "gst_topics": ["GST Returns & Filing", "Treasury Audit"],
        "keywords": ["GSTR-3B", "Treasury", "Audit"],
        "page_count": 7,
        "checksum": "sha256-e2f3a4b5gstom02",
        "storage_key": "documents/2022/GST-OM-02-2022/original.pdf",
        "sections": [],
        "referenced_documents": []
    },
    {
        "id": "doc-2021-gst-sched",
        "document_number": "GST Rate Schedule 2021/Fin",
        "document_type": "GST Policy",
        "title": "State Procurement Tax Rate Master Schedule 2021",
        "subject": "Base GST Rate Schedule",
        "issuing_authority": "Finance (Tax) Department",
        "department": "Finance Department, Government of Kerala",
        "year": 2021,
        "issue_date": "2021-07-01",
        "effective_date": "2021-07-15",
        "status": "SUPERSEDED",
        "source_type": "SYNTHETIC",
        "original_language": "en",
        "translated": False,
        "gst_topics": ["GST Exemption"],
        "keywords": ["GST", "Rates", "2021"],
        "page_count": 15,
        "checksum": "sha256-f3a4b5c6gstsched2021",
        "storage_key": "documents/2021/GST-SCHED-2021/original.pdf",
        "sections": [],
        "referenced_documents": []
    },
    {
        "id": "doc-2025-report-cag",
        "document_number": "Report No.02/2025/CAG",
        "document_type": "Report",
        "title": "State Finance Audit Overview Report 2024-25",
        "subject": "CAG State Audit Summary",
        "issuing_authority": "Comptroller and Auditor General of India",
        "department": "Finance Department, Government of Kerala",
        "year": 2025,
        "issue_date": "2025-01-30",
        "effective_date": "2025-01-30",
        "status": "ACTIVE",
        "source_type": "OFFICIAL_PUBLIC",
        "original_language": "en",
        "translated": False,
        "gst_topics": ["Treasury Audit", "Capital Budget"],
        "keywords": ["CAG", "Audit", "State Finance"],
        "page_count": 85,
        "checksum": "sha256-a4b5c6d7cag2025",
        "storage_key": "documents/2025/REPORT-CAG-2025/original.pdf",
        "sections": [],
        "referenced_documents": []
    },
    {
        "id": "doc-2023-sfc-report",
        "document_number": "Report No.01/2023/SFC",
        "document_type": "Report",
        "title": "Sixth State Finance Commission Recommendations on Local Body Allocation",
        "subject": "SFC Fiscal Transfer Recommendations",
        "issuing_authority": "State Finance Commission",
        "department": "Finance Department, Government of Kerala",
        "year": 2023,
        "issue_date": "2023-04-18",
        "effective_date": "2023-05-01",
        "status": "ACTIVE",
        "source_type": "OFFICIAL_PUBLIC",
        "original_language": "en",
        "translated": False,
        "gst_topics": ["Capital Budget"],
        "keywords": ["SFC", "Fiscal Transfer", "Local Bodies"],
        "page_count": 92,
        "checksum": "sha256-b5c6d7e8sfc2023",
        "storage_key": "documents/2023/REPORT-SFC-2023/original.pdf",
        "sections": [],
        "referenced_documents": []
    },
    {
        "id": "doc-2021-go88",
        "document_number": "GO(P) No.88/2021/Fin",
        "document_type": "Government Order",
        "title": "General Financial Rules Kerala 2021 Re-issuance",
        "subject": "General Financial Rules Revision",
        "issuing_authority": "Finance (Rules) Department",
        "department": "Finance Department, Government of Kerala",
        "year": 2021,
        "issue_date": "2021-02-14",
        "effective_date": "2021-03-01",
        "status": "AMENDED",
        "source_type": "SYNTHETIC",
        "original_language": "en",
        "translated": False,
        "gst_topics": ["Capital Budget"],
        "keywords": ["GFR", "Financial Rules"],
        "page_count": 45,
        "checksum": "sha256-c6d7e8f9go882021",
        "storage_key": "documents/2021/GO-88-2021/original.pdf",
        "sections": [],
        "referenced_documents": []
    },
    {
        "id": "doc-2024-cir12",
        "document_number": "Circular No.12/2024/Fin",
        "document_type": "Circular",
        "title": "Treasury Bill Monitoring & Year-End Closing Instructions 2024",
        "subject": "Financial Year-End Treasury Procedures",
        "issuing_authority": "Finance (Treasury) Department",
        "department": "Finance Department, Government of Kerala",
        "year": 2024,
        "issue_date": "2024-03-01",
        "effective_date": "2024-03-01",
        "status": "ACTIVE",
        "source_type": "SYNTHETIC",
        "original_language": "en",
        "translated": False,
        "gst_topics": ["Treasury Audit"],
        "keywords": ["Treasury", "Closing", "Bills"],
        "page_count": 6,
        "checksum": "sha256-d7e8f9a0cir122024",
        "storage_key": "documents/2024/CIRCULAR-12-2024/original.pdf",
        "sections": [],
        "referenced_documents": []
    }
]

def generate_seed_dataset():
    os.makedirs("data", exist_ok=True)
    out_file = "data/synthetic_kfin_dataset.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(SEED_DOCUMENTS, f, indent=2, ensure_ascii=False)
    print(f"[SUCCESS] Generated synthetic dataset with {len(SEED_DOCUMENTS)} seed documents at {out_file}")

if __name__ == "__main__":
    generate_seed_dataset()
