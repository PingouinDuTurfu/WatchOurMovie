SECRET_KEY = "4b8e08f2c3a4d5e6f7101234567890abcdef1234567890abcdef1234567890ab"

AUTH_PORT = os.getenv('AUTH_PORT', '')
DB_PORT = os.getenv('DB_MANAGER_PORT', '')
LOG_PORT = os.getenv('LOG_PORT', '')
API_PORT = os.getenv('API_PORT', '')

SECRET_KEY = os.getenv('JWT_SECRET', '')
AUTH_URL = "http://auth_provider:" + AUTH_PORT
DB_URL = "http://db_manager:" + DB_PORT
LOG_URL = "http://log:" + LOG_PORT
