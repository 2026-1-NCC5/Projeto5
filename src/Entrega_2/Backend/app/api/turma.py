from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import models
from app.schemas import academic
from typing import List
from app.api.deps import get_edicao_context

# Padronização Hierárquica
router = APIRouter(prefix="/{username}/{slug_projeto}/{slug_edicao}/turmas", tags=["Turmas"])

@router.get("/", response_model=List[academic.TurmaOut])
def listar_turmas(
    username: str, slug_projeto: str, slug_edicao: str,
    db: Session = Depends(get_db),
    edicao_ctx: models.Edicao = Depends(get_edicao_context)
):
    return db.query(models.Turma).filter(models.Turma.edicao_id == edicao_ctx.id).all()

@router.get("/{slug_turma}", response_model=academic.TurmaOut)
def buscar_turma(
    username: str, slug_projeto: str, slug_edicao: str,
    slug_turma: str,
    db: Session = Depends(get_db),
    edicao_ctx: models.Edicao = Depends(get_edicao_context)
):
    db_obj = db.query(models.Turma).filter(
        models.Turma.edicao_id == edicao_ctx.id,
        models.Turma.slug == slug_turma
    ).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Turma não encontrada nesta edição")
    return db_obj

@router.post("/", response_model=academic.TurmaOut)
def criar_turma(
    username: str, slugProjeto: str, slugEdicao: str,
    obj_in: academic.TurmaCreate, 
    db: Session = Depends(get_db),
    edicao_ctx: models.Edicao = Depends(get_edicao_context)
):
    db_obj = models.Turma(**obj_in.dict(), edicao_id=edicao_ctx.id)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.put("/{slug_turma}", response_model=academic.TurmaOut)
def atualizar_turma(
    username: str, slugProjeto: str, slugEdicao: str,
    slug_turma: str,
    obj_in: academic.TurmaUpdate,
    db: Session = Depends(get_db),
    edicao_ctx: models.Edicao = Depends(get_edicao_context)
):
    db_obj = db.query(models.Turma).filter(
        models.Turma.edicao_id == edicao_ctx.id,
        models.Turma.slug == slug_turma
    ).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Turma não encontrada")
    
    update_data = obj_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_obj, key, value)
        
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.delete("/{slug_turma}")
def deletar_turma(
    username: str, slugProjeto: str, slugEdicao: str,
    slug_turma: str,
    db: Session = Depends(get_db),
    edicao_ctx: models.Edicao = Depends(get_edicao_context)
):
    db_obj = db.query(models.Turma).filter(
        models.Turma.edicao_id == edicao_ctx.id,
        models.Turma.slug == slug_turma
    ).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Turma não encontrada")
    
    db.delete(db_obj)
    db.commit()
    return {"message": "Turma deletada com sucesso"}
