from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import models
from app.schemas import convite as schemas
from typing import List, Optional
from app.api.deps import get_edicao_context

router = APIRouter(prefix="/{username}/{slug_projeto}/{slug_edicao}", tags=["Convites"])

# Criar um novo convite
@router.post("/convites", response_model=schemas.ConviteOut)
def enviar_convite(
    username: str, slug_projeto: str, slug_edicao: str,
    obj_in: schemas.ConviteCreate,
    db: Session = Depends(get_db)
):
    # Verifica se já existe um convite pendente para evitar spam
    existente = db.query(models.ConviteGrupo).filter(
        models.ConviteGrupo.convidado_id == obj_in.convidado_id,
        models.ConviteGrupo.grupo_id == obj_in.grupo_id,
        models.ConviteGrupo.status == "pendente"
    ).first()
    
    if existente:
        raise HTTPException(status_code=400, detail="Já existe um convite pendente para este aluno")

    db_obj = models.ConviteGrupo(**obj_in.dict(), status="pendente")
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

# Listar convites recebidos por um aluno
@router.get("/meus-convites/{aluno_id}", response_model=List[schemas.ConviteOut])
def listar_meus_convites(
    username: str, slug_projeto: str, slug_edicao: str,
    aluno_id: int,
    status: Optional[str] = "pendente",
    db: Session = Depends(get_db)
):
    query = db.query(models.ConviteGrupo).filter(models.ConviteGrupo.convidado_id == aluno_id)
    if status:
        query = query.filter(models.ConviteGrupo.status == status)
    
    convites = query.all()
    
    # Hidratando nomes para o frontend
    for c in convites:
        c.nome_criador = db.query(models.Aluno.nome).filter(models.Aluno.id == c.criador_id).scalar()
        c.nome_convidado = db.query(models.Aluno.nome).filter(models.Aluno.id == c.convidado_id).scalar()
        c.nome_grupo = db.query(models.Grupo.nome).filter(models.Grupo.id == c.grupo_id).scalar()
        
    return convites

# Responder a um convite (Aceitar ou Negar)
@router.put("/convites/{convite_id}", response_model=schemas.ConviteOut)
def responder_convite(
    username: str, slug_projeto: str, slug_edicao: str,
    convite_id: int, 
    novo_status: str, # 'aceito' ou 'negado'
    db: Session = Depends(get_db)
):
    db_convite = db.query(models.ConviteGrupo).filter(models.ConviteGrupo.id == convite_id).first()
    if not db_convite:
        raise HTTPException(status_code=404, detail="Convite não encontrado")
    
    db_convite.status = novo_status
    
    # Lógica de Ouro: Se aceito, vincula o aluno ao grupo automaticamente
    if novo_status == "aceito":
        aluno = db.query(models.Aluno).filter(models.Aluno.id == db_convite.convidado_id).first()
        if aluno:
            aluno.grupo_id = db_convite.grupo_id
            db.add(aluno)
    
    db.add(db_convite)
    db.commit()
    db.refresh(db_convite)
    return db_convite

# Deletar/Cancelar um convite
@router.delete("/convites/{convite_id}")
def cancelar_convite(
    username: str, slug_projeto: str, slug_edicao: str,
    convite_id: int,
    db: Session = Depends(get_db)
):
    db_convite = db.query(models.ConviteGrupo).filter(models.ConviteGrupo.id == convite_id).first()
    if not db_convite:
        raise HTTPException(status_code=404, detail="Convite não encontrado")
    
    db.delete(db_convite)
    db.commit()
    return {"message": "Convite removido"}
