"""
K-FIN INTELLIGENCE - API Gateway Integration Test Suite
Tests local POC authentication, ADMIN & USER role authorization, 401/403 security boundaries,
dynamic metrics, and chat responses.
"""

import sys
import os
import importlib.util
import pytest
from fastapi.testclient import TestClient

sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))

# Import API Gateway main module cleanly
gateway_path = os.path.join(os.path.dirname(__file__), "..", "..", "apps", "api-gateway", "main.py")
spec = importlib.util.spec_from_file_location("api_gateway_main", gateway_path)
api_gateway_main = importlib.util.module_from_spec(spec)
spec.loader.exec_module(api_gateway_main)

app = api_gateway_main.app
client = TestClient(app)

ADMIN_AUTH_HEADER = {"Authorization": "Bearer admin_poc_token_123"}
USER_AUTH_HEADER = {"Authorization": "Bearer user_poc_token_456"}

def test_unauthenticated_request_rejected():
    """Verify that unauthenticated requests return 401 Unauthorized (Fail Closed)."""
    res = client.get("/api/v1/analytics/dashboard")
    assert res.status_code == 401
    data = res.json()
    assert "Authentication required" in data["detail"]

def test_poc_admin_login_success():
    """Verify ADMIN login with valid POC credentials (admin/admin)."""
    res = client.post(
        "/api/v1/auth/login",
        json={"role": "ADMIN", "username": "admin", "password": "admin"}
    )
    assert res.status_code == 200
    data = res.json()
    assert data["authenticated"] is True
    assert data["user"]["role"] == "ADMIN"

def test_poc_user_login_success():
    """Verify USER login with valid POC credentials (user/user)."""
    res = client.post(
        "/api/v1/auth/login",
        json={"role": "USER", "username": "user", "password": "user"}
    )
    assert res.status_code == 200
    data = res.json()
    assert data["authenticated"] is True
    assert data["user"]["role"] == "USER"

def test_invalid_credentials_rejected():
    """Verify invalid password returns 401 Unauthorized."""
    res = client.post(
        "/api/v1/auth/login",
        json={"role": "ADMIN", "username": "admin", "password": "wrong_password"}
    )
    assert res.status_code == 401
    assert "Invalid username or password" in res.json()["detail"]

def test_user_admin_endpoint_forbidden():
    """Verify USER role receives 403 Forbidden on administrative endpoints."""
    res = client.get("/api/v1/audit", headers=USER_AUTH_HEADER)
    assert res.status_code == 403
    assert "Access Denied" in res.json()["detail"]

def test_admin_audit_logs_access():
    """Verify ADMIN role has full access to administrative audit endpoints."""
    res = client.get("/api/v1/audit", headers=ADMIN_AUTH_HEADER)
    assert res.status_code == 200
    logs = res.json()
    assert isinstance(logs, list)

def test_api_health():
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "HEALTHY"
    assert data["services"]["api_gateway"] == "ONLINE"

def test_dynamic_dashboard_analytics():
    res = client.get("/api/v1/analytics/dashboard", headers=USER_AUTH_HEADER)
    assert res.status_code == 200
    data = res.json()
    assert "total_documents" in data
    assert "active_percentage" in data

def test_list_documents():
    res = client.get("/api/v1/documents", headers=USER_AUTH_HEADER)
    assert res.status_code == 200
    docs = res.json()
    assert isinstance(docs, list)

def test_chat_grounded_response():
    res = client.post(
        "/api/v1/chat",
        json={"conversation_id": "test-conv-1", "question": "What is the latest GST reimbursement order?"},
        headers=USER_AUTH_HEADER
    )
    assert res.status_code == 200
    data = res.json()
    assert "answer" in data

def test_policy_note_list_and_generate():
    res = client.get("/api/v1/policy-notes", headers=USER_AUTH_HEADER)
    assert res.status_code == 200
    notes = res.json()
    assert isinstance(notes, list)

def test_ai_config_isolation():
    res = client.get("/api/v1/ai-config", headers=ADMIN_AUTH_HEADER)
    assert res.status_code == 200
    config = res.json()
    assert config["translation_service"]["provider"] == "groq"
    assert config["translation_service"]["model"] == "llama-3.1-8b-instant"

def test_update_ai_config_env():
    """Verify ADMIN can update Web-App LLM configuration and persist to .env file."""
    res = client.post(
        "/api/v1/ai-config/web-app-llm",
        json={"provider": "groq", "model": "llama-3.1-8b-instant", "api_key": "test_groq_key_123"},
        headers=ADMIN_AUTH_HEADER
    )
    assert res.status_code == 200
    data = res.json()
    assert data["web_app_llm"]["provider"] == "groq"
    assert data["web_app_llm"]["model"] == "llama-3.1-8b-instant"
