from pydantic import BaseModel, Field
from datetime import datetime

class ArrecadarIn(BaseModel):
    valor: float = Field(..., gt=0, description="O valor arrecadado deve ser maior que zero.")
    origem: str

class ArrecadacaoOut(BaseModel):
    id: int
    aluno_id: int
    valor: float
    origem: str
    data: datetime

    class Config:
        from_attributes = True

class ResgatarIn(BaseModel):
    valor: float = Field(..., gt=0, description="O valor de resgate deve ser maior que zero.")
    descricao: str

