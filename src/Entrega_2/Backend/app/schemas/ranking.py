from pydantic import BaseModel
from typing import List, Optional

class IntegranteRanking(BaseModel):
    id: int
    nome: str

class GrupoRankingOut(BaseModel):
    posicao: int
    grupo_id: int
    nome_grupo: str
    turma_id: int
    nome_turma: str
    total_kg: float
    total_dinheiro: float
    integrantes: List[IntegranteRanking]

class RankingGruposResponse(BaseModel):
    ranking: List[GrupoRankingOut]
    sua_posicao: Optional[int] = None

class TurmaRankingOut(BaseModel):
    posicao: int
    turma_id: int
    nome_turma: str
    total_kg: float
    total_dinheiro: float

class RankingTurmasResponse(BaseModel):
    ranking: List[TurmaRankingOut]
