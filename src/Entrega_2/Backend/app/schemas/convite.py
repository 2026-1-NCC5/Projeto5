from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ConviteBase(BaseModel):
    criador_id: int
    convidado_id: int
    grupo_id: int

class ConviteCreate(ConviteBase):
    pass

class ConviteUpdate(BaseModel):
    novo_status: str # 'aceito' ou 'negado'

class ConviteOut(ConviteBase):
    id: int
    status: str
    data_criacao: datetime
    
    # Campos extras para facilitar o frontend
    nome_criador: Optional[str] = None
    nome_convidado: Optional[str] = None
    nome_grupo: Optional[str] = None

    class Config:
        from_attributes = True
