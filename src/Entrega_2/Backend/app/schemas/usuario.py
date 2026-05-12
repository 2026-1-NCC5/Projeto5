from pydantic import BaseModel, EmailStr
from typing import Optional

class UsuarioBase(BaseModel):
    nome: str
    sobrenome: str
    email: EmailStr
    username: str
    celular: Optional[str] = None

class UsuarioCreate(UsuarioBase):
    senha: str

class UsuarioUpdate(BaseModel):
    nome: Optional[str] = None
    sobrenome: Optional[str] = None
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    celular: Optional[str] = None
    avatar: Optional[str] = None

class UsuarioOut(UsuarioBase):
    id: int
    avatar: Optional[str] = None
    ativo: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
