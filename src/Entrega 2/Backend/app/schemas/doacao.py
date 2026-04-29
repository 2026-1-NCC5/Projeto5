from pydantic import BaseModel
from typing import List

class ItemContado(BaseModel):
    codigo_barras: str
    quantidade: int

class RegistrarContagemIn(BaseModel):
    aluno_id: int
    itens: List[ItemContado]
    tipo_origem: str = "DIRETA"
