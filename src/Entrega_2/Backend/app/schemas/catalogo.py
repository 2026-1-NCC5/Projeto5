from pydantic import BaseModel
from typing import Optional

class CatalogoBase(BaseModel):
    nome: str
    label: Optional[str] = None
    preco: float
    peso: float
    largura: Optional[float] = None
    comprimento: Optional[float] = None

class CatalogoCreate(CatalogoBase):
    pass

class CatalogoUpdate(BaseModel):
    nome: Optional[str] = None
    label: Optional[str] = None
    preco: Optional[float] = None
    peso: Optional[float] = None
    largura: Optional[float] = None
    comprimento: Optional[float] = None

class CatalogoOut(CatalogoBase):
    id: int
    edicao_id: int

    class Config:
        from_attributes = True
