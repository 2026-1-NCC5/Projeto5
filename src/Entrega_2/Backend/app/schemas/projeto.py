from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ProjetoBase(BaseModel):
    nome: str
    slug: str
    descricao: Optional[str] = None
    imagem: Optional[str] = None
    status: Optional[str] = "ativo" # Novo campo de status (string)

class ProjetoCreate(ProjetoBase):
    pass

class ProjetoUpdate(BaseModel):
    nome: Optional[str] = None
    slug: Optional[str] = None
    descricao: Optional[str] = None
    imagem: Optional[str] = None
    status: Optional[str] = None
    display: Optional[bool] = None

class ProjetoOut(ProjetoBase):
    id: int
    display: bool
    data_criacao: datetime
    papel: Optional[str] = None # 'adm' ou 'member'

    class Config:
        from_attributes = True
