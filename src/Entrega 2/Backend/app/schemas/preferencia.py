from pydantic import BaseModel
from typing import Optional

class PreferenciaBase(BaseModel):
    tema: Optional[str] = "light"
    notificacoes_ativas: Optional[bool] = True

class PreferenciaUpdate(BaseModel):
    tema: Optional[str] = None
    notificacoes_ativas: Optional[bool] = None

class PreferenciaOut(PreferenciaBase):
    id: int
    usuario_id: int

    class Config:
        from_attributes = True
