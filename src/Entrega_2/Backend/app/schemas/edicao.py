from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EdicaoBase(BaseModel):
    nome: str
    slug: str
    semestre: Optional[str] = None
    min_alunos_por_grupo: int = 3
    max_alunos_por_grupo: int = 4

class EdicaoCreate(EdicaoBase):
    pass

class EdicaoUpdate(BaseModel):
    nome: Optional[str] = None
    slug: Optional[str] = None
    semestre: Optional[str] = None
    min_alunos_por_grupo: Optional[int] = None
    max_alunos_por_grupo: Optional[int] = None
    ativo: Optional[bool] = None

class EdicaoOut(EdicaoBase):
    id: int
    projeto_id: int
    ativo: bool
    data_inicio: Optional[datetime] = None
    data_fim: Optional[datetime] = None

    class Config:
        from_attributes = True
