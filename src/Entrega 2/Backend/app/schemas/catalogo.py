from pydantic import BaseModel
from typing import Optional

class ItemPermitidoOut(BaseModel):
    id: int
    nome: str
    unidade_medida: str
    desafio_id: int

    class Config:
        from_attributes = True

class ItemPermitidoCreate(BaseModel):
    nome: str
    unidade_medida: str
    desafio_id: int

class ClonarItensIn(BaseModel):
    desafio_origem_id: int
    desafio_destino_id: int

class CatalogoProdutoCreate(BaseModel):
    codigo_barras: str
    marca: str
    peso_volume: float
    item_id: int

class CatalogoProdutoOut(CatalogoProdutoCreate):
    cadastrado_por_aluno_id: int
    item_permitido: Optional[ItemPermitidoOut] = None

    class Config:
        from_attributes = True

class ValidarCadastrarIn(BaseModel):
    codigo_barras: str
    marca: Optional[str] = None
    peso_volume: Optional[float] = None
    item_id: Optional[int] = None
