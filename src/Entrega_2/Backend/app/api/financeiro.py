from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.financeiro import ArrecadarIn, ArrecadacaoOut, ResgatarIn
from app.services.financeiro_service import FinanceiroService
from app.api import deps
from pydantic import BaseModel

router = APIRouter(prefix="/financeiro", tags=["Financeiro e Arrecadação"])

class SaldoOut(BaseModel):
    saldo_total: float

@router.post("/arrecadar", status_code=201, response_model=ArrecadacaoOut)
def arrecadar_dinheiro(
    dados: ArrecadarIn,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """
    Registra um valor financeiro captado por um aluno, vinculado ao seu grupo automaticamente.
    """
    return FinanceiroService.arrecadar_valor(db, current_user.id, dados)

@router.get("/saldo-grupo", response_model=SaldoOut)
def obter_saldo_grupo(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """
    Retorna a somatória total de valores angariados por todos os alunos pertencentes ao grupo do requerente.
    """
    saldo = FinanceiroService.obter_saldo_grupo(db, current_user.id)
    return {"saldo_total": saldo}

@router.post("/resgatar-para-compra", status_code=201)
def resgatar_para_compra(
    dados: ResgatarIn,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """
    Desconta saldo financeiro do grupo para resgate de fundos destinados a compras reais.
    Retorna o ID da transação financeira para auditoria.
    """
    resgate = FinanceiroService.resgatar_compra(db, current_user.id, dados)
    return {
        "message": "Resgate financeiro aprovado. Valores deduzidos do saldo do grupo.",
        "resgate_id": resgate.id
    }
