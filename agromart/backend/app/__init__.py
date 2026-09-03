# Apply bcrypt monkeypatch for passlib compatibility on Python 3.12+ / bcrypt 4.x
try:
    import bcrypt
    original_hashpw = bcrypt.hashpw
    def patched_hashpw(password, salt):
        if isinstance(password, str):
            password = password.encode('utf-8')
        if len(password) > 72:
            password = password[:72]
        return original_hashpw(password, salt)
    bcrypt.hashpw = patched_hashpw

    original_checkpw = bcrypt.checkpw
    def patched_checkpw(password, hashed_password):
        if isinstance(password, str):
            password = password.encode('utf-8')
        if len(password) > 72:
            password = password[:72]
        return original_checkpw(password, hashed_password)
    bcrypt.checkpw = patched_checkpw
except ImportError:
    pass
