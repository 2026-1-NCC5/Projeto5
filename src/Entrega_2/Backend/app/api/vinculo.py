from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.vinculo import VinculoCreate, VinculoOut
from app.services.vinculo_service import VinculoService
from app.models import models
from app.api import deps

router = APIRouter(prefix="/vinculos", tags=["Gestão de Vínculos (Permissões)"])

@router.post("/", response_model=VinculoOut, status_code=201)
def criar_vinculo(
    dados: VinculoCreate, 
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(deps.get_current_user)
):
    """Associa um usuário a um projeto com um papel específico (PROFESSOR, ALUNO, ADM)"""
    return VinculoService.criar_vinculo(db, dados)

@router.get("/projeto/{projeto_id}", response_model=List[VinculoOut])
def listar_vinculos_do_projeto(
    projeto_id: int, 
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(deps.get_current_user)
):
    """Lista todos os usuários vinculados a um projeto"""
    return VinculoService.listar_vinculos_por_projeto(db, projeto_id)

@router.get("/me", response_model=List[VinculoOut])
def listar_meus_vinculos(
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(deps.get_current_user)
):
    """Lista os projetos aos quais o usuário logado possui acesso"""
    return VinculoService.listar_vinculos_do_usuario(db, current_user.id)
