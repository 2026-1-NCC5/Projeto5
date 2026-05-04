from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DesafioCreate(BaseModel):
    semestre: str
    projeto_id: int
    data_inicio: Optional[datetime] = None
    data_fim: Optional[datetime] = None
    prazo_auto_grupo: Optional[datetime] = None
    min_alunos_por_grupo: Optional[int] = 1
    max_alunos_por_grupo: Optional[int] = 10

class DesafioOut(BaseModel):
    id: int
    projeto_id: int
    semestre: str
    data_inicio: Optional[datetime]
    data_fim: Optional[datetime]
    prazo_auto_grupo: Optional[datetime]
    min_alunos_por_grupo: int
    max_alunos_por_grupo: int

    class Config:
        from_attributes = True