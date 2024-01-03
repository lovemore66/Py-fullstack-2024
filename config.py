import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DEBUG = True
    SECRET_KEY = os.getenv('SECRET_KEY')
    # MySQL Configuration
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

# Export SECRET_KEY to .env file
if __name__ == "__main__":
    with open(".env", "a") as f:
        f.write(f"SECRET_KEY={Config.SECRET_KEY}\n")

