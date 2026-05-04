from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import models
from app.schemas.desafio import DesafioCreate, DesafioOut
from app.api import deps

router = APIRouter(prefix="/desafios", tags=["Gestão de Desafios"])

@router.post("/", response_model=DesafioOut)
def criar_desafio(
    dados: DesafioCreate, 
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(deps.get_current_user)
):
    # Verificação de segurança: o projeto existe?
    projeto = db.query(models.Projeto).filter(models.Projeto.id == dados.projeto_id).first()
    if not projeto:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")

    novo_desafio = models.Desafio(
        projeto_id=dados.projeto_id,
        semestre=dados.semestre,
        data_inicio=dados.data_inicio,
        data_fim=dados.data_fim,
        prazo_auto_grupo=dados.prazo_auto_grupo,
        min_alunos_por_grupo=dados.min_alunos_por_grupo,
        max_alunos_por_grupo=dados.max_alunos_por_grupo
    )
    db.add(novo_desafio)
    db.commit()
    db.refresh(novo_desafio)
    return novo_desafio

@router.get("/projeto/{projeto_id}", response_model=List[DesafioOut])
def listar_desafios_por_projeto(
    projeto_id: int, 
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(deps.get_current_user)
):
    """
    Retorna todos os desafios vinculados a um projeto específico.
    """
    desafios = db.query(models.Desafio).filter(models.Desafio.projeto_id == projeto_id).all()
    
    if not desafios:
        # Retornamos uma lista vazia ou um erro 404, 
        # mas geralmente lista vazia é melhor para o Front-end não quebrar.
        return []
        
    return desafios