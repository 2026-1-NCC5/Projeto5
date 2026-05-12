from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.core.database import get_db
from app.models import models
from app.schemas import ranking
from typing import List, Optional
from app.api.deps import get_edicao_context, get_current_user

from datetime import datetime

router = APIRouter(prefix="/{username}/{slug_projeto}/{slug_edicao}/ranking", tags=["Ranking"])

@router.get("/grupos", response_model=ranking.RankingGruposResponse)
def ranking_grupos(
    username: str, slug_projeto: str, slug_edicao: str,
    ordenar_por: str = Query("kg", enum=["kg", "dinheiro"]),
    data_inicio: Optional[datetime] = None,
    data_fim: Optional[datetime] = None,
    limit: int = 10,
    db: Session = Depends(get_db),
    edicao_ctx: models.Edicao = Depends(get_edicao_context),
    current_user: models.Usuario = Depends(get_current_user)
):
    # 1. Subqueries para Totais por Grupo (Filtradas por Tempo)
    # Peso total (kg)
    peso_query = db.query(
        models.Registro.grupo_id,
        func.sum(models.RegistroItem.peso).label("total_kg")
    ).join(models.RegistroItem).filter(models.Registro.edicao_id == edicao_ctx.id)

    # Dinheiro total
    money_query = db.query(
        models.Registro.grupo_id,
        func.sum(models.RegistroDinheiro.valor).label("total_money")
    ).join(models.RegistroDinheiro).filter(models.Registro.edicao_id == edicao_ctx.id)

    # Aplicação dos filtros de data
    if data_inicio:
        peso_query = peso_query.filter(models.Registro.data_hora >= data_inicio)
        money_query = money_query.filter(models.Registro.data_hora >= data_inicio)
    if data_fim:
        peso_query = peso_query.filter(models.Registro.data_hora <= data_fim)
        money_query = money_query.filter(models.Registro.data_hora <= data_fim)

    peso_sub = peso_query.group_by(models.Registro.grupo_id).subquery()
    money_sub = money_query.group_by(models.Registro.grupo_id).subquery()

    # 2. Query Principal: Grupos + Turma + Totais
    query = db.query(
        models.Grupo,
        models.Turma.nome.label("nome_turma"),
        func.coalesce(peso_sub.c.total_kg, 0).label("kg"),
        func.coalesce(money_sub.c.total_money, 0).label("dinheiro")
    ).join(models.Turma).outerjoin(
        peso_sub, models.Grupo.id == peso_sub.c.grupo_id
    ).outerjoin(
        money_sub, models.Grupo.id == money_sub.c.grupo_id
    ).filter(models.Turma.edicao_id == edicao_ctx.id)

    # Ordenação
    if ordenar_por == "kg":
        query = query.order_by(desc("kg"))
    else:
        query = query.order_by(desc("dinheiro"))

    todos_grupos = query.all()
    
    # 3. Montar Ranking e achar "Sua Posição"
    ranking_list = []
    sua_posicao = None
    
    aluno_vinculado = db.query(models.Aluno).filter(models.Aluno.usuario_id == current_user.id).first()
    meu_grupo_id = aluno_vinculado.grupo_id if aluno_vinculado else None

    for i, (grupo, nome_turma, kg, dinheiro) in enumerate(todos_grupos):
        pos = i + 1
        if meu_grupo_id and grupo.id == meu_grupo_id:
            sua_posicao = pos
            
        if len(ranking_list) < limit:
            ranking_list.append({
                "posicao": pos,
                "grupo_id": grupo.id,
                "nome_grupo": grupo.nome,
                "turma_id": grupo.turma_id,
                "nome_turma": nome_turma,
                "total_kg": kg,
                "total_dinheiro": dinheiro,
                "integrantes": [{"id": a.id, "nome": a.nome} for a in grupo.alunos]
            })

    return {"ranking": ranking_list, "sua_posicao": sua_posicao}

@router.get("/turmas", response_model=ranking.RankingTurmasResponse)
def ranking_turmas(
    username: str, slug_projeto: str, slug_edicao: str,
    data_inicio: Optional[datetime] = None,
    data_fim: Optional[datetime] = None,
    db: Session = Depends(get_db),
    edicao_ctx: models.Edicao = Depends(get_edicao_context)
):
    # Agregação por Turma com filtro temporal
    query = db.query(
        models.Turma.id,
        models.Turma.nome,
        func.sum(func.coalesce(models.RegistroItem.peso, 0)).label("total_kg"),
        func.sum(func.coalesce(models.RegistroDinheiro.valor, 0)).label("total_dinheiro")
    ).join(models.Grupo, models.Grupo.turma_id == models.Turma.id)\
     .outerjoin(models.Registro, models.Registro.grupo_id == models.Grupo.id)\
     .outerjoin(models.RegistroItem, models.RegistroItem.registro_id == models.Registro.id)\
     .outerjoin(models.RegistroDinheiro, models.RegistroDinheiro.registro_id == models.Registro.id)\
     .filter(models.Turma.edicao_id == edicao_ctx.id)

    if data_inicio:
        query = query.filter(models.Registro.data_hora >= data_inicio)
    if data_fim:
        query = query.filter(models.Registro.data_hora <= data_fim)

    query = query.group_by(models.Turma.id, models.Turma.nome).order_by(desc("total_kg"))

    resultados = query.all()
    
    ranking_turmas = []
    for i, res in enumerate(resultados):
        ranking_turmas.append({
            "posicao": i + 1,
            "turma_id": res[0],
            "nome_turma": res[1],
            "total_kg": res[2],
            "total_dinheiro": res[3]
        })

    return {"ranking": ranking_turmas}
