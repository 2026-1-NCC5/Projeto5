from pydantic import BaseModel
from typing import Optional

class TurmaCreate(BaseModel):
    nome: str  # Ex: "CC3A"
    desafio_id: int

class TurmaOut(BaseModel):
    id: int
    nome: str
    desafio_id: int

    class Config:
        from_attributes = True