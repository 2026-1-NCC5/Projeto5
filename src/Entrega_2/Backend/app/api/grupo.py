from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import models
from app.schemas import academic
from typing import List
from app.api.deps import get_edicao_context

# Padronização Hierárquica
router = APIRouter(prefix="/{username}/{slug_projeto}/{slug_edicao}", tags=["Grupos"])

# Endpoint Mestre de Grupos: Lista grupos de uma turma e as regras da edição
@router.get("/{slug_turma}/grupos", response_model=academic.GrupoMestreOut)
def listar_grupos(
    username: str, slug_projeto: str, slug_edicao: str,
    slug_turma: str,
    apenas_incompletos: bool = False, # < min_alunos
    apenas_disponiveis: bool = False, # < max_alunos
    db: Session = Depends(get_db),
    edicao_ctx: models.Edicao = Depends(get_edicao_context)
):
    # 1. Base Query: Todos os grupos desta turma/edição
    query_base = db.query(models.Grupo).join(models.Turma).filter(
        models.Turma.edicao_id == edicao_ctx.id,
        models.Turma.slug == slug_turma
    )
    
    todos_grupos = query_base.all()
    qtd_total = len(todos_grupos)
    
    # 2. Aplicar Filtros de Lógica de Negócio (se solicitado)
    grupos_filtrados = todos_grupos
    
    if apenas_incompletos:
        grupos_filtrados = [g for g in grupos_filtrados if len(g.alunos) < edicao_ctx.min_alunos_por_grupo]
        
    if apenas_disponiveis:
        grupos_filtrados = [g for g in grupos_filtrados if len(g.alunos) < edicao_ctx.max_alunos_por_grupo]

    return {
        "min_alunos_por_grupo": edicao_ctx.min_alunos_por_grupo,
        "max_alunos_por_grupo": edicao_ctx.max_alunos_por_grupo,
        "quantidade_exibida": len(grupos_filtrados),
        "quantidade_total": qtd_total,
        "grupos": grupos_filtrados
    }

# Lista alunos da turma que ainda não possuem um grupo vinculado
@router.get("/{slug_turma}/alunos-sem-grupo", response_model=List[academic.AlunoOut])
def listar_alunos_sem_grupo(
    username: str, slugProjeto: str, slugEdicao: str,
    slug_turma: str,
    db: Session = Depends(get_db),
    edicao_ctx: models.Edicao = Depends(get_edicao_context)
):
    return db.query(models.Aluno).join(models.Turma).filter(
        models.Turma.edicao_id == edicao_ctx.id,
        models.Turma.slug == slug_turma,
        models.Aluno.grupo_id == None
    ).all()

@router.post("/grupos", response_model=academic.GrupoOut)
def criar_grupo(
    username: str, slugProjeto: str, slugEdicao: str,
    obj_in: academic.GrupoCreate, 
    db: Session = Depends(get_db)
):
    db_obj = models.Grupo(**obj_in.dict())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

# Deletar um grupo e liberar todos os seus membros
@router.delete("/grupos/{grupo_id}")
def deletar_grupo(
    username: str, slugProjeto: str, slugEdicao: str,
    grupo_id: int,
    db: Session = Depends(get_db)
):
    grupo = db.query(models.Grupo).filter(models.Grupo.id == grupo_id).first()
    if not grupo:
        raise HTTPException(status_code=404, detail="Grupo não encontrado")
    
    # 1. Limpeza de Atividades (Registros)
    # Buscamos os IDs de todos os registros do grupo para apagar os filhos primeiro
    registro_ids = db.query(models.Registro.id).filter(models.Registro.grupo_id == grupo_id).all()
    registro_ids = [r[0] for r in registro_ids] # Transforma em lista simples

    if registro_ids:
        # Apaga os filhos (itens físicos e entradas/saídas de dinheiro)
        db.query(models.RegistroItem).filter(models.RegistroItem.registro_id.in_(registro_ids)).delete(synchronize_session=False)
        db.query(models.RegistroDinheiro).filter(models.RegistroDinheiro.registro_id.in_(registro_ids)).delete(synchronize_session=False)
        db.query(models.ResgateDinheiro).filter(models.ResgateDinheiro.registro_id.in_(registro_ids)).delete(synchronize_session=False)
        
        # Apaga os registros pai
        db.query(models.Registro).filter(models.Registro.id.in_(registro_ids)).delete(synchronize_session=False)

    # 2. Deleta todos os convites vinculados a este grupo
    db.query(models.ConviteGrupo).filter(models.ConviteGrupo.grupo_id == grupo_id).delete()

    # 3. "Libera" os alunos setando grupo_id como NULL
    db.query(models.Aluno).filter(models.Aluno.grupo_id == grupo_id).update({models.Aluno.grupo_id: None})
    
    # 4. Deleta o grupo
    db.delete(grupo)
    db.commit()
    return {"message": "Grupo, registros e convites deletados, membros liberados"}

# Remover um aluno específico de um grupo
@router.post("/grupos/{grupo_id}/remover/{aluno_id}")
def remover_aluno_do_grupo(
    username: str, slugProjeto: str, slugEdicao: str,
    grupo_id: int,
    aluno_id: int,
    db: Session = Depends(get_db)
):
    aluno = db.query(models.Aluno).filter(
        models.Aluno.id == aluno_id,
        models.Aluno.grupo_id == grupo_id
    ).first()
    
    if not aluno:
        raise HTTPException(status_code=404, detail="Aluno não encontrado neste grupo")
    
    aluno.grupo_id = None
    db.add(aluno)
    db.commit()
    return {"message": "Aluno removido do grupo com sucesso"}

# Lista todos os alunos da edição que ainda estão sem grupo (Disponíveis para convite)
@router.get("/alunos-sem-grupo", response_model=List[academic.AlunoOut])
def listar_alunos_sem_grupo(
    username: str, slugProjeto: str, slugEdicao: str,
    db: Session = Depends(get_db),
    edicao_ctx: models.Edicao = Depends(get_edicao_context)
):
    return db.query(models.Aluno).join(models.Turma).filter(
        models.Turma.edicao_id == edicao_ctx.id,
        models.Aluno.grupo_id == None
    ).all()
