from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class RegistroItemBase(BaseModel):
    item_id: int
    quantidade: int = 1
    peso: Optional[float] = None
    valor: Optional[float] = None

class RegistroItemOut(RegistroItemBase):
    id: int
    registro_id: int

    class Config:
        from_attributes = True

class RegistroDinheiroBase(BaseModel):
    valor: float

class RegistroDinheiroOut(RegistroDinheiroBase):
    id: int
    registro_id: int

    class Config:
        from_attributes = True

class ResgateDinheiroBase(BaseModel):
    valor: float

class ResgateDinheiroOut(ResgateDinheiroBase):
    id: int
    registro_id: int

    class Config:
        from_attributes = True

class RegistroBase(BaseModel):
    tipo: str # 'item', 'dinheiro', 'resgate'
    grupo_id: int
    aluno_id: int

class RegistroCreate(RegistroBase):
    pass

class RegistroOut(RegistroBase):
    id: int
    data_hora: datetime
    nome_aluno: Optional[str] = None
    nome_grupo: Optional[str] = None
    itens: List[RegistroItemOut] = []
    entrada_dinheiro: Optional[RegistroDinheiroOut] = None
    resgate_dinheiro: Optional[ResgateDinheiroOut] = None

    class Config:
        from_attributes = True

# Schemas para o JSON consolidado (Listagem + Resumo)
class RegistroResumoItem(BaseModel):
    item_id: int
    nome: str
    quantidade: int
    subtotal_valor: float
    subtotal_peso: float

class RegistroRespostaUnificada(BaseModel):
    total_itens: int
    total_valor_itens: float
    total_peso: float
    total_dinheiro_entrada: float
    total_dinheiro_resgate: float
    saldo_financeiro_total: float
    registros: List[RegistroOut]
    resumo_por_item: List[RegistroResumoItem]

class RegistroConsolidado(BaseModel):
    grupo_id: int
    total_itens: int
    total_valor_itens: float
    total_peso: float
    total_dinheiro_entrada: float
    total_dinheiro_resgate: float
    saldo_financeiro_total: float
    itens: List[RegistroResumoItem]
