from pydantic import BaseModel
from typing import Optional

class TurmaBase(BaseModel):
    nome: str
    slug: Optional[str] = None

class TurmaCreate(TurmaBase):
    pass

class TurmaOut(TurmaBase):
    id: int
    edicao_id: int
    slug: str

    class Config:
        from_attributes = True
