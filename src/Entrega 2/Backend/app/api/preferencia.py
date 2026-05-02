from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.preferencia import PreferenciaOut, PreferenciaUpdate
from app.services.preferencia_service import PreferenciaService
from app.models import models
from app.api import deps

router = APIRouter(prefix="/preferencias", tags=["Gestão de Preferências"])

@router.get("/", response_model=PreferenciaOut)
def obter_minhas_preferencias(current_user: models.Usuario = Depends(deps.get_current_user)):
    """Retorna as preferências do usuário logado"""
    if not current_user.preferencia:
        raise HTTPException(status_code=404, detail="Preferência não encontrada")
    return current_user.preferencia

@router.patch("/", response_model=PreferenciaOut)
def atualizar_minhas_preferencias(
    dados: PreferenciaUpdate, 
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(deps.get_current_user)
):
    """Atualiza o tema ou notificações do usuário logado"""
    return PreferenciaService.atualizar_preferencia(db, current_user.id, dados)
