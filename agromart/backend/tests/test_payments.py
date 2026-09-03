import pytest
from app.integrations.razorpay_client import razorpay_client

def test_razorpay_client_signature():
    order_id = "order_mock_AGM-123456"
    payment_id = "pay_mock_987654"
    signature = "dummy_signature"
    is_valid = razorpay_client.verify_payment_signature(order_id, payment_id, signature)
    assert is_valid is True

def test_razorpay_mock_order_creation():
    order = razorpay_client.create_order(amount_in_paisa=50000, receipt="AGM-999999")
    assert "id" in order
    assert order["amount"] == 50000
