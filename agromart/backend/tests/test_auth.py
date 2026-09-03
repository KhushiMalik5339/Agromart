import pytest
from app.core.security import get_password_hash, verify_password, create_access_token
from jose import jwt
from app.core.config import settings

def test_password_hashing():
    pwd = "secretpassword123"
    hashed = get_password_hash(pwd)
    assert verify_password(pwd, hashed) is True
    assert verify_password("wrongpassword", hashed) is False

def test_jwt_token_generation():
    user_id = "65d1234567890abcdef12345"
    role = "customer"
    token = create_access_token(subject=user_id, role=role)
    payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
    assert payload["sub"] == user_id
    assert payload["role"] == role
    assert payload["type"] == "access"
