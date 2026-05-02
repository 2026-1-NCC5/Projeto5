from pydantic import BaseModel, EmailStr
from typing import Optional
from app.schemas.preferencia import PreferenciaOut

class UsuarioBase(BaseModel):
    nome: str
    email: EmailStr

class UsuarioCreate(UsuarioBase):
    senha: str

class UsuarioUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[EmailStr] = None

class UsuarioOut(UsuarioBase):
    id: int
    preferencia: Optional[PreferenciaOut] = None

    class Config:
        from_attributes = True
