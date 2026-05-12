from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ResumoGeral(BaseModel):
    total_kg: float
    total_dinheiro: float
    total_alunos: int
    total_grupos: int
    total_turmas: int
    # Médias
    media_kg_aluno: float
    media_dinheiro_aluno: float
    media_kg_grupo: float
    media_dinheiro_grupo: float
    media_kg_turma: float
    media_dinheiro_turma: float

class DistribuicaoItem(BaseModel):
    item_nome: str
    quantidade_kg: float
    porcentagem: float

class EvolucaoDiaria(BaseModel):
    data: str
    kg: float
    dinheiro: float

class RankingItem(BaseModel):
    posicao: int
    nome: str
    kg: float
    valor: float

class MetricasDashboardOut(BaseModel):
    resumo: ResumoGeral
    distribuicao: List[DistribuicaoItem]
    evolucao: List[EvolucaoDiaria]
    ranking_grupos: List[RankingItem]
    ranking_turmas: List[RankingItem]
    turmas_disponiveis: List[Dict[str, Any]]
