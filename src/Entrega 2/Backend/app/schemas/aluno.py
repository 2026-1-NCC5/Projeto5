from pydantic import BaseModel, EmailStr
from typing import Optional

class AlunoPreCadastro(BaseModel):
    nome: str
    email_pre_cadastro: EmailStr
    ra: Optional[str]
    turma_id: int

class AlunoOut(BaseModel):
    id: int
    nome: Optional[str]
    email_pre_cadastro: Optional[EmailStr]
    token_convite: Optional[str]
    ra: Optional[str]
    usuario_id: Optional[int]
    turma_id: int
    
    class Config:
        from_attributes = True

class AlunoStatusOut(BaseModel) :
    id: int
    nome: str
    email_pre_cadastro: Optional[str]
    ra: Optional[str]
    turma_id: int
    nome_turma: str
    vinculado: bool

    class Config:
        from_attributes = True