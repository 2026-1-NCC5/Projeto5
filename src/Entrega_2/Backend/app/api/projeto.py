from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models import models
from app.schemas.projeto import ProjetoCreate, ProjetoOut
from app.api import deps # Onde está seu get_current_user

router = APIRouter(prefix="/projetos", tags=["Projetos (Tenants)"])

@router.get("/", response_model=List[ProjetoOut])
def listar_projetos(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(deps.get_current_user)
):
    """Lista todos os projetos cadastrados (Requer Login)"""
    return db.query(models.Projeto).offset(skip).limit(limit).all()

@router.post("/", response_model=ProjetoOut)
def criar_projeto(
    projeto: ProjetoCreate,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(deps.get_current_user)
):
    """Cria um novo Projeto/Tenant (Requer Login)"""
    novo_projeto = models.Projeto(
        nome=projeto.nome,
        descricao=projeto.descricao
    )
    db.add(novo_projeto)
    db.commit()
    db.refresh(novo_projeto)
    return novo_projeto