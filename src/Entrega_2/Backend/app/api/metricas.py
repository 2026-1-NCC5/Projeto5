from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date
from app.core.database import get_db
from app.models import models
from app.schemas import metricas
from typing import List, Optional
from app.api.deps import get_edicao_context
from datetime import datetime

router = APIRouter(prefix="/{username}/{slug_projeto}/{slug_edicao}/metricas", tags=["Métricas"])

@router.get("/", response_model=metricas.MetricasDashboardOut)
def buscar_metricas_dashboard(
    username: str, slug_projeto: str, slug_edicao: str,
    turma_ids: Optional[List[int]] = Query(None), # Lista de IDs de turmas para filtrar
    data_inicio: Optional[datetime] = None,
    data_fim: Optional[datetime] = None,
    db: Session = Depends(get_db),
    edicao_ctx: models.Edicao = Depends(get_edicao_context)
):
    # --- 0. PREPARAÇÃO DE FILTROS ---
    # Função auxiliar para aplicar filtros de Turma e Data em qualquer query baseada em Registro
    def aplicar_filtros(query):
        # Filtro de Turma (via JOIN com Grupo)
        if turma_ids:
            query = query.join(models.Grupo).filter(models.Grupo.turma_id.in_(turma_ids))
        
        # Filtro de Período
        if data_inicio:
            query = query.filter(models.Registro.data_hora >= data_inicio)
        if data_fim:
            query = query.filter(models.Registro.data_hora <= data_fim)
        return query

    # --- 1. RESUMO GERAL (KPIs) ---
    kg_query = db.query(func.sum(models.Catalogo.peso)).join(models.RegistroItem).join(models.Registro).filter(models.Registro.edicao_id == edicao_ctx.id)
    total_kg = aplicar_filtros(kg_query).scalar() or 0
        
    money_query = db.query(func.sum(models.RegistroDinheiro.valor)).join(models.Registro).filter(models.Registro.edicao_id == edicao_ctx.id)
    total_money = aplicar_filtros(money_query).scalar() or 0
        
    # Contagens Base (Considerando apenas as turmas filtradas se houver)
    turmas_query = db.query(models.Turma).filter(models.Turma.edicao_id == edicao_ctx.id)
    if turma_ids:
        turmas_query = turmas_query.filter(models.Turma.id.in_(turma_ids))
    
    total_turmas = turmas_query.count()
    
    # Grupos das turmas selecionadas
    turmas_selecionadas = turmas_query.all()
    grupos_ids = [g.id for g in db.query(models.Grupo.id).filter(models.Grupo.turma_id.in_(
        [t.id for t in turmas_selecionadas]
    )).all()]
    total_grupos = len(grupos_ids)
    
    # Alunos das turmas selecionadas
    total_alunos = db.query(models.Aluno).filter(models.Aluno.turma_id.in_(
        [t.id for t in turmas_selecionadas]
    )).count()

    # Cálculo de Médias (Proteção contra divisão por zero)
    resumo = {
        "total_kg": total_kg,
        "total_dinheiro": total_money,
        "total_alunos": total_alunos,
        "total_grupos": total_grupos,
        "total_turmas": total_turmas,
        "media_kg_aluno": round(total_kg / total_alunos, 2) if total_alunos > 0 else 0,
        "media_dinheiro_aluno": round(total_money / total_alunos, 2) if total_alunos > 0 else 0,
        "media_kg_grupo": round(total_kg / total_grupos, 2) if total_grupos > 0 else 0,
        "media_dinheiro_grupo": round(total_money / total_grupos, 2) if total_grupos > 0 else 0,
        "media_kg_turma": round(total_kg / total_turmas, 2) if total_turmas > 0 else 0,
        "media_dinheiro_turma": round(total_money / total_turmas, 2) if total_turmas > 0 else 0,
    }

    # --- 2. DISTRIBUIÇÃO POR ITEM (Gráfico de Pizza) ---
    dist_query = db.query(
        models.Catalogo.nome,
        func.sum(models.Catalogo.peso).label("peso_total")
    ).join(models.RegistroItem, models.RegistroItem.item_id == models.Catalogo.id)\
     .join(models.Registro, models.Registro.id == models.RegistroItem.registro_id)\
     .filter(models.Registro.edicao_id == edicao_ctx.id)
    
    dist_query = aplicar_filtros(dist_query).group_by(models.Catalogo.nome).all()

    distribuicao = []
    for nome, peso in dist_query:
        porcentagem = (peso / total_kg * 100) if total_kg > 0 else 0
        distribuicao.append({
            "item_nome": nome,
            "quantidade_kg": peso,
            "porcentagem": round(porcentagem, 2)
        })

    # --- 3. EVOLUÇÃO DIÁRIA (Gráfico de Linha) ---
    evol_peso_q = db.query(
        func.date(models.Registro.data_hora).label("dia"), 
        func.sum(models.Catalogo.peso)
    ).join(models.RegistroItem, models.RegistroItem.registro_id == models.Registro.id)\
     .join(models.Catalogo, models.Catalogo.id == models.RegistroItem.item_id)\
     .filter(models.Registro.edicao_id == edicao_ctx.id)
    evol_peso = aplicar_filtros(evol_peso_q).group_by("dia").all()

    evol_money_q = db.query(
        func.date(models.Registro.data_hora).label("dia"), 
        func.sum(models.RegistroDinheiro.valor)
    ).join(models.RegistroDinheiro, models.RegistroDinheiro.registro_id == models.Registro.id)\
     .filter(models.Registro.edicao_id == edicao_ctx.id)
    evol_money = aplicar_filtros(evol_money_q).group_by("dia").all()

    dados_diarios = {}
    for dia, kg in evol_peso: dados_diarios[str(dia)] = {"kg": kg, "dinheiro": 0}
    for dia, money in evol_money:
        if str(dia) in dados_diarios: dados_diarios[str(dia)]["dinheiro"] = money
        else: dados_diarios[str(dia)] = {"kg": 0, "dinheiro": money}

    evolucao = [{"data": d, "kg": v["kg"], "dinheiro": v["dinheiro"]} for d, v in sorted(dados_diarios.items())]

    # --- 4. RANKINGS DE GRUPOS E TURMAS ---
    # Ranking de Grupos
    ranking_grupos_query = db.query(
        models.Grupo.nome,
        func.sum(models.Catalogo.peso).label("kg"),
        func.sum(models.Catalogo.preco).label("valor")
    ).join(models.Registro, models.Registro.grupo_id == models.Grupo.id)\
     .join(models.RegistroItem, models.RegistroItem.registro_id == models.Registro.id)\
     .join(models.Catalogo, models.Catalogo.id == models.RegistroItem.item_id)\
     .filter(models.Grupo.turma_id.in_([t.id for t in turmas_selecionadas]))\
     .group_by(models.Grupo.id)\
     .order_by(func.sum(models.Catalogo.peso).desc())\
     .limit(10).all()

    ranking_grupos = [
        {"posicao": i+1, "nome": r.nome, "kg": float(r.kg or 0), "valor": float(r.valor or 0)}
        for i, r in enumerate(ranking_grupos_query)
    ]

    # Ranking de Turmas
    ranking_turmas_query = db.query(
        models.Turma.nome,
        func.sum(models.Catalogo.peso).label("kg"),
        func.sum(models.Catalogo.preco).label("valor")
    ).join(models.Grupo, models.Grupo.turma_id == models.Turma.id)\
     .join(models.Registro, models.Registro.grupo_id == models.Grupo.id)\
     .join(models.RegistroItem, models.RegistroItem.registro_id == models.Registro.id)\
     .join(models.Catalogo, models.Catalogo.id == models.RegistroItem.item_id)\
     .filter(models.Turma.id.in_([t.id for t in turmas_selecionadas]))\
     .group_by(models.Turma.id)\
     .order_by(func.sum(models.Catalogo.peso).desc())\
     .limit(10).all()

    ranking_turmas = [
        {"posicao": i+1, "nome": r.nome, "kg": float(r.kg or 0), "valor": float(r.valor or 0)}
        for i, r in enumerate(ranking_turmas_query)
    ]

    # --- 5. LISTA DE TURMAS DISPONÍVEIS ---
    turmas_disponiveis = [{"id": t.id, "nome": t.nome} for t in db.query(models.Turma).filter(models.Turma.edicao_id == edicao_ctx.id).all()]

    return {
        "resumo": resumo,
        "distribuicao": distribuicao,
        "evolucao": evolucao,
        "ranking_grupos": ranking_grupos,
        "ranking_turmas": ranking_turmas,
        "turmas_disponiveis": turmas_disponiveis
    }
