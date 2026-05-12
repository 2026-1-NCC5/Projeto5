from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import models
from app.schemas import catalogo
from typing import List, Optional

from app.api.edicao import get_edicao_context

# Padronização Hierárquica
router = APIRouter(prefix="/{username}/{slug_projeto}/{slug_edicao}/catalogo", tags=["Catálogo"])

@router.get("/", response_model=List[catalogo.CatalogoOut])
def listar_itens(
    username: str, slug_projeto: str, slug_edicao: str,
    item_id: Optional[int] = None, 
    db: Session = Depends(get_db),
    edicao_ctx: models.Edicao = Depends(get_edicao_context)
):
    # Filtra automaticamente pela edição do contexto da URL
    query = db.query(models.Catalogo).filter(models.Catalogo.edicao_id == edicao_ctx.id)
    if item_id:
        query = query.filter(models.Catalogo.id == item_id)
    return query.all()

@router.get("/item/{item_id}", response_model=catalogo.CatalogoOut)
def buscar_item_especifico(
    username: str, slug_projeto: str, slug_edicao: str,
    item_id: int, 
    db: Session = Depends(get_db)
):
    db_obj = db.query(models.Catalogo).filter(models.Catalogo.id == item_id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Item não encontrado no catálogo")
    return db_obj

@router.post("/", response_model=catalogo.CatalogoOut)
def adicionar_item_ao_catalogo(
    username: str, slug_projeto: str, slug_edicao: str,
    obj_in: catalogo.CatalogoCreate, 
    db: Session = Depends(get_db),
    edicao_ctx: models.Edicao = Depends(get_edicao_context)
):
    # Vincula automaticamente ao ID da edição do contexto
    db_obj = models.Catalogo(**obj_in.dict(), edicao_id=edicao_ctx.id)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
