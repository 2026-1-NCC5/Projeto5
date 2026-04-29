from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models import models
from app.schemas.turma import TurmaCreate, TurmaOut
from app.api import deps

router = APIRouter(prefix="/turmas", tags=["Gestão de Turmas"])

@router.post("/", response_model=TurmaOut)
def criar_turma(
    dados: TurmaCreate, 
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(deps.get_current_user)
):
    # Verifica se o desafio existe
    desafio = db.query(models.Desafio).filter(models.Desafio.id == dados.desafio_id).first()
    if not desafio:
        raise HTTPException(status_code=404, detail="Desafio não encontrado")

    nova_turma = models.Turma(nome=dados.nome, desafio_id=dados.desafio_id)
    db.add(nova_turma)
    db.commit()
    db.refresh(nova_turma)
    return nova_turma

@router.get("/desafio/{desafio_id}", response_model=List[TurmaOut])
def listar_turmas_por_desafio(
    desafio_id: int, 
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(deps.get_current_user)
):
    return db.query(models.Turma).filter(models.Turma.desafio_id == desafio_id).all()

@router.get("/lista-filtros/{desafio_id}", response_model=list[dict])
def listar_turmas_para_filtro(
    desafio_id: int, 
    db: Session = Depends(get_db)
):
    """
    Retorna apenas ID e Nome das turmas para preencher o SelectBox do Front-end.
    """
    turmas = db.query(models.Turma).filter(models.Turma.desafio_id == desafio_id).all()
    
    # Retornamos um formato que o React Native Picker adora
    return [{"label": t.nome, "value": t.id} for t in turmas]