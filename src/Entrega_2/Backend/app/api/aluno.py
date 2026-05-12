from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import models
from app.schemas import academic
from typing import List, Optional

from app.api.deps import get_edicao_context

# Padronização Hierárquica
router = APIRouter(prefix="/{username}/{slug_projeto}/{slug_edicao}", tags=["Alunos"])

# Lista todos os alunos pertencentes a uma edição específica
@router.get("/alunos", response_model=List[academic.AlunoOut])
def listar_todos_alunos_edicao(
    username: str, slug_projeto: str, slug_edicao: str,
    db: Session = Depends(get_db),
    edicao_ctx: models.Edicao = Depends(get_edicao_context)
):
    return db.query(models.Aluno).join(models.Turma).filter(models.Turma.edicao_id == edicao_ctx.id).all()

# Lista apenas os alunos vinculados a uma turma específica dentro do desafio
@router.get("/{slug_turma}/alunos", response_model=List[academic.AlunoOut])
def listar_alunos_por_turma(
    username: str, slugProjeto: str, slugEdicao: str,
    slug_turma: str, 
    db: Session = Depends(get_db),
    edicao_ctx: models.Edicao = Depends(get_edicao_context)
):
    return db.query(models.Aluno).join(models.Turma).filter(
        models.Turma.edicao_id == edicao_ctx.id,
        models.Turma.slug == slug_turma
    ).all()

# Cria um novo registro de aluno vinculado a uma turma
@router.post("/alunos", response_model=academic.AlunoOut)
def criar_aluno(
    username: str, slug_projeto: str, slug_edicao: str,
    obj_in: academic.AlunoCreate, 
    db: Session = Depends(get_db)
):
    db_obj = models.Aluno(**obj_in.dict())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

# Busca os dados detalhados de um aluno específico pelo seu ID
@router.get("/alunos/{id:int}", response_model=academic.AlunoOut)
def buscar_aluno(
    username: str, slug_projeto: str, slug_edicao: str,
    id: int, 
    db: Session = Depends(get_db)
):
    db_obj = db.query(models.Aluno).filter(models.Aluno.id == id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    return db_obj

# Atualiza as informações de um aluno (nome, email, RA, turma ou grupo)
@router.put("/alunos/{id:int}", response_model=academic.AlunoOut)
def atualizar_aluno(
    username: str, slug_projeto: str, slug_edicao: str,
    id: int,
    obj_in: academic.AlunoUpdate,
    db: Session = Depends(get_db)
):
    db_obj = db.query(models.Aluno).filter(models.Aluno.id == id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    
    # Atualiza apenas os campos enviados (parciais)
    update_data = obj_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_obj, key, value)
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

# Vincula um Usuário ao Aluno e automaticamente ao Projeto como 'member'
@router.post("/alunos/{aluno_id:int}/vincular-usuario/{usuario_id:int}")
def vincular_usuario_aluno(
    username: str, slug_projeto: str, slug_edicao: str,
    aluno_id: int, usuario_id: int,
    db: Session = Depends(get_db),
    edicao_ctx: models.Edicao = Depends(get_edicao_context)
):
    aluno = db.query(models.Aluno).filter(models.Aluno.id == aluno_id).first()
    if not aluno:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    
    # 1. Atualiza o usuario_id no registro do aluno
    aluno.usuario_id = usuario_id
    db.add(aluno)
    
    # 2. Cria o vínculo do usuário com o projeto como 'member' (acesso de visualização/participação)
    # Verificamos se já não existe um vínculo para evitar duplicidade
    vinculo_existente = db.query(models.VinculoProjeto).filter(
        models.VinculoProjeto.usuario_id == usuario_id,
        models.VinculoProjeto.projeto_id == edicao_ctx.projeto_id
    ).first()
    
    if not vinculo_existente:
        novo_vinculo = models.VinculoProjeto(
            usuario_id=usuario_id,
            projeto_id=edicao_ctx.projeto_id,
            papel="member"
        )
        db.add(novo_vinculo)
    
    db.commit()
    return {"message": "Usuário vinculado ao aluno e ao projeto como membro"}

# Remove um aluno do banco de dados permanentemente
@router.delete("/alunos/{id:int}")
def deletar_aluno(
    username: str, slug_projeto: str, slug_edicao: str,
    id: int,
    db: Session = Depends(get_db)
):
    db_obj = db.query(models.Aluno).filter(models.Aluno.id == id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    
    db.delete(db_obj)
    db.commit()
    return {"message": "Aluno deletado com sucesso"}
