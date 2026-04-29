from pydantic import BaseModel
from typing import List, Optional

class GrupoCreate(BaseModel):
    nome_projeto: str  # Ex: "Os Inovadores"

class GrupoOut(BaseModel):
    id: int
    nome_projeto: str
    codigo_convite: str
    lider_id: int
    turma_id: int

    class Config:
        from_attributes = True