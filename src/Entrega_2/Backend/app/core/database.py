from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

# O engine é quem realmente conversa com o banco
if settings.DATABASE_URL.startswith("sqlite"):
    engine = create_engine(settings.DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(settings.DATABASE_URL)

# Cada requisição ao banco usará uma Session local
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Classe base para nossos modelos (tabelas)
Base = declarative_base()

# Dependência que será usada nos endpoints do FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()