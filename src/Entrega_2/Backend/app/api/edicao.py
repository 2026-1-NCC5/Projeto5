from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import models
from app.schemas import edicao
from typing import List

from app.api.deps import get_projeto_context, get_edicao_context

router = APIRouter(prefix="/{username}/{slug_projeto}/edicoes", tags=["Edições"])

@router.get("/", response_model=List[edicao.EdicaoOut])
def listar_edicoes(
    username: str, 
    slug_projeto: str, 
    db: Session = Depends(get_db),
    projeto_ctx: models.Projeto = Depends(get_projeto_context)
):
    return db.query(models.Edicao).filter(models.Edicao.projeto_id == projeto_ctx.id).all()

@router.get("/{slug_edicao}", response_model=edicao.EdicaoOut)
def buscar_edicao_especifica(
    username: str, slug_projeto: str, slug_edicao: str,
    edicao_ctx: models.Edicao = Depends(get_edicao_context)
):
    # O edicao_ctx já faz todo o trabalho de validação e busca
    return edicao_ctx

@router.post("/", response_model=edicao.EdicaoOut)
def criar_edicao(
    username: str,
    slugProjeto: str,
    obj_in: edicao.EdicaoCreate,
    db: Session = Depends(get_db),
    projeto_ctx: models.Projeto = Depends(get_projeto_context)
):
    db_obj = models.Edicao(**obj_in.dict(), projeto_id=projeto_ctx.id)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.put("/{slugEdicao}", response_model=edicao.EdicaoOut)
def atualizar_edicao(
    username: str, slugProjeto: str, slugEdicao: str,
    obj_in: edicao.EdicaoUpdate,
    db: Session = Depends(get_db),
    edicao_ctx: models.Edicao = Depends(get_edicao_context)
):
    update_data = obj_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(edicao_ctx, key, value)
    
    db.add(edicao_ctx)
    db.commit()
    db.refresh(edicao_ctx)
    return edicao_ctx

@router.delete("/{slugEdicao}")
def deletar_edicao(
    username: str, slugProjeto: str, slugEdicao: str,
    db: Session = Depends(get_db),
    edicao_ctx: models.Edicao = Depends(get_edicao_context)
):
    db.delete(edicao_ctx)
    db.commit()
    return {"message": "Edição deletada com sucesso"}
