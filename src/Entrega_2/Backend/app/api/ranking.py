from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.services.ranking_service import RankingService
from app.api import deps

router = APIRouter(prefix="/ranking", tags=["Rankings"])

@router.get("/ranking-turmas/{desafio_id}")
def ranking_geral_turmas(desafio_id: int, db: Session = Depends(get_db)):
    """Visão Geral: Ranking comparativo entre todas as turmas do desafio."""
    return RankingService.obter_ranking_turmas(db, desafio_id)

@router.get("/ranking-grupos/{desafio_id}")
def ranking_todos_grupos(desafio_id: int, db: Session = Depends(get_db)):
    """Visão Elite: Ranking de todos os grupos do desafio, independente da turma."""
    return RankingService.obter_ranking_geral_grupos(db, desafio_id)

@router.get("/ranking-interno-turma/{turma_id}")
def ranking_interno_turma(turma_id: int, db: Session = Depends(get_db)):
    """Visão Turma: Ranking dos grupos dentro de uma turma específica."""
    return RankingService.obter_ranking_grupos_por_turma(db, turma_id)

@router.get("/ranking-financeiro/{desafio_id}")
def ranking_financeiro_combinado(desafio_id: int, db: Session = Depends(get_db)):
    """Visão Financeira: Retorna o ranking consolidado de fundos arrecadados por turmas e por grupos."""
    return RankingService.obter_ranking_financeiro_combinado(db, desafio_id)