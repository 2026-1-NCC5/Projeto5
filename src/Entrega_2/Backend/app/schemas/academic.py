from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class AlunoBase(BaseModel):
    nome: str
    email: Optional[EmailStr] = None
    ra: str

class AlunoCreate(AlunoBase):
    turma_id: int

class AlunoUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[EmailStr] = None
    ra: Optional[str] = None
    turma_id: Optional[int] = None
    grupo_id: Optional[int] = None

class AlunoOut(AlunoBase):
    id: int
    turma_id: int
    grupo_id: Optional[int] = None
    usuario_id: Optional[int] = None

    class Config:
        from_attributes = True

class GrupoBase(BaseModel):
    nome: str

class GrupoCreate(GrupoBase):
    turma_id: int

class GrupoOut(GrupoBase):
    id: int
    turma_id: int
    alunos: List[AlunoOut] = []

    class Config:
        from_attributes = True

class GrupoMestreOut(BaseModel):
    min_alunos_por_grupo: int
    max_alunos_por_grupo: int
    quantidade_exibida: int
    quantidade_total: int
    grupos: List[GrupoOut]

class ConviteGrupoBase(BaseModel):
    convidado_id: int
    grupo_id: int

class ConviteGrupoCreate(ConviteGrupoBase):
    pass

class ConviteGrupoOut(ConviteGrupoBase):
    id: int
    criador_id: int
    data_criacao: datetime
    status: str

    class Config:
        from_attributes = True

class TurmaBase(BaseModel):
    nome: str
    slug: str

class TurmaCreate(TurmaBase):
    pass

class TurmaUpdate(BaseModel):
    nome: Optional[str] = None
    slug: Optional[str] = None

class TurmaOut(TurmaBase):
    id: int
    edicao_id: int

    class Config:
        from_attributes = True
