import sys
import os
sys.path.append(os.getcwd())
from app.core.database import SessionLocal
from app.models import models

db = SessionLocal()
edicoes = db.query(models.Edicao).all()
for ed in edicoes:
    print(f"Nome: {ed.nome} | Slug: {ed.slug} | ID: {ed.id}")
db.close()
