from pydantic import BaseModel
from typing import Optional

class VinculoBase(BaseModel):
    usuario_id: int
    projeto_id: int
    papel: str # PROFESSOR | ALUNO | ADM

class VinculoCreate(VinculoBase):
    pass

class VinculoOut(VinculoBase):
    class Config:
        from_attributes = True
