from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.doacao import RegistrarContagemIn
from app.services.doacao_service import DoacaoService

router = APIRouter(prefix="/doacao", tags=["Doações e Contagem"])

@router.post("/registrar-contagem", status_code=201)
def registrar_contagem(
    dados: RegistrarContagemIn,
    db: Session = Depends(get_db)
):
    """
    Recebe um payload de itens identificados pelo módulo de visão computacional 
    e atribui à conta/grupo do aluno correspondente.
    """
    doacao = DoacaoService.registrar_contagem(db, dados)
    return {
        "message": "Contagem registrada com sucesso!",
        "doacao_id": doacao.id
    }
