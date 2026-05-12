from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.schemas.catalogo import CatalogoOut

class CheckoutRequest(BaseModel):
    adm_id: int
    itens_ids: List[int]

class CheckoutItemResumo(BaseModel):
    item: CatalogoOut
    quantidade: int
    valor_subtotal: float
    peso_subtotal: float

class CheckoutDetalhado(BaseModel):
    id: int
    data_criacao: datetime
    adm_id: int
    edicao_id: int
    
    # Resumos calculados
    itens_resumo: List[CheckoutItemResumo]
    total_itens: int
    total_valor: float
    total_peso: float

    class Config:
        from_attributes = True
