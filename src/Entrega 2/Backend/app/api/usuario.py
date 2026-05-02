from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.usuario import UsuarioCreate, UsuarioOut, UsuarioUpdate
from app.services.usuario_service import UsuarioService
from app.models import models
from app.api import deps

router = APIRouter(prefix="/usuarios", tags=["Gestão de Usuários"])

@router.post("/", response_model=UsuarioOut, status_code=201)
def registrar_usuario(dados: UsuarioCreate, db: Session = Depends(get_db)):
    """Cria uma nova conta de usuário"""
    return UsuarioService.criar_usuario(db, dados)

@router.get("/me", response_model=UsuarioOut)
def obter_perfil(current_user: models.Usuario = Depends(deps.get_current_user)):
    """Retorna o perfil do usuário logado"""
    return current_user

@router.patch("/me", response_model=UsuarioOut)
def atualizar_perfil(
    dados: UsuarioUpdate, 
    db: Session = Depends(get_db), 
    current_user: models.Usuario = Depends(deps.get_current_user)
):
    """Atualiza dados do usuário logado"""
    return UsuarioService.atualizar_usuario(db, current_user.id, dados)
