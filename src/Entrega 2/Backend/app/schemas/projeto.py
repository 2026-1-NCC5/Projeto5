from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# O que o usuário envia para criar um projeto
class ProjetoCreate(BaseModel):
    nome: str
    descricao: Optional[str] = None

# O que a API devolve para o usuário (View)
class ProjetoOut(BaseModel):
    id: int
    nome: str
    descricao: Optional[str]
    data_criacao: datetime
    ativo: bool

    class Config:
        from_attributes = True # Permite converter o Model do SQL para JSON