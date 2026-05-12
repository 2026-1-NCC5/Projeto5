from pydantic import BaseModel
from typing import Optional

class CatalogoBase(BaseModel):
    nome: str
    label: str
    preco: float
    peso: float
    largura: Optional[float] = None
    comprimento: Optional[float] = None

class CatalogoCreate(CatalogoBase):
    edicao_id: int

class CatalogoOut(CatalogoBase):
    id: int
    edicao_id: int

    class Config:
        from_attributes = True
