from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import models
from app.schemas import registro
from app.api.deps import get_edicao_context
from datetime import datetime
from typing import List, Optional

# Padronização Hierárquica
router = APIRouter(prefix="/{username}/{slug_projeto}/{slug_edicao}/registros", tags=["Registros"])

# Endpoint Mestre: Lista registros com filtros e já devolve a somatória total (Unificado)
@router.get("/", response_model=registro.RegistroRespostaUnificada)
def listar_e_totalizar_registros(
    username: str, slug_projeto: str, slug_edicao: str,
    tipo: Optional[str] = None,
    grupo_id: Optional[int] = None,
    aluno_id: Optional[int] = None,
    data_inicio: Optional[datetime] = None,
    data_fim: Optional[datetime] = None,
    db: Session = Depends(get_db),
    edicao_ctx: models.Edicao = Depends(get_edicao_context)
):
    # 1. Inicia Query com Joins para obter os nomes
    query = db.query(models.Registro).join(models.Aluno).join(models.Grupo).filter(
        models.Registro.edicao_id == edicao_ctx.id
    )
    
    # 2. Aplica Filtros Dinâmicos
    if tipo:
        query = query.filter(models.Registro.tipo == tipo)
    if grupo_id:
        query = query.filter(models.Registro.grupo_id == grupo_id)
    if aluno_id:
        query = query.filter(models.Registro.aluno_id == aluno_id)
    if data_inicio:
        query = query.filter(models.Registro.data_hora >= data_inicio)
    if data_fim:
        query = query.filter(models.Registro.data_hora <= data_fim)
        
    registros_db = query.order_by(models.Registro.data_hora.desc()).all()

    # 3. Contabilidade Dinâmica (Baseada nos resultados filtrados)
    resumo_itens_map = {}
    t_itens_qtd = 0
    t_valor_itens = 0.0
    t_peso = 0.0
    t_dinheiro_in = 0.0
    t_dinheiro_out = 0.0

    registros_formatados = []
    
    for r in registros_db:
        # Adiciona nomes ao objeto para o Schema AlunoOut
        r.nome_aluno = r.aluno.nome
        r.nome_grupo = r.grupo.nome
        registros_formatados.append(r)

        # Soma Dinheiro
        if r.tipo == "dinheiro" and r.entrada_dinheiro:
            t_dinheiro_in += r.entrada_dinheiro.valor
        
        if r.tipo == "resgate" and r.resgate_dinheiro:
            t_dinheiro_out += r.resgate_dinheiro.valor

        # Soma Itens
        if r.tipo == "item":
            for ri in r.itens:
                item = ri.catalogo
                if item.id not in resumo_itens_map:
                    resumo_itens_map[item.id] = {
                        "item_id": item.id,
                        "nome": item.nome,
                        "quantidade": 0,
                        "subtotal_valor": 0.0,
                        "subtotal_peso": 0.0
                    }
                resumo_itens_map[item.id]["quantidade"] += 1
                resumo_itens_map[item.id]["subtotal_valor"] += item.preco
                resumo_itens_map[item.id]["subtotal_peso"] += item.peso
                
                t_itens_qtd += 1
                t_valor_itens += item.preco
                t_peso += item.peso

    return {
        "total_itens": t_itens_qtd,
        "total_valor_itens": round(t_valor_itens, 2),
        "total_peso": round(t_peso, 2),
        "total_dinheiro_entrada": round(t_dinheiro_in, 2),
        "total_dinheiro_resgate": round(t_dinheiro_out, 2),
        "saldo_financeiro_total": round(t_dinheiro_in + t_valor_itens - t_dinheiro_out, 2),
        "registros": registros_formatados,
        "resumo_por_item": list(resumo_itens_map.values())
    }

@router.post("/", response_model=registro.RegistroOut)
def criar_registro(
    username: str, slugProjeto: str, slugEdicao: str,
    obj_in: registro.RegistroCreate, 
    db: Session = Depends(get_db),
    edicao_ctx: models.Edicao = Depends(get_edicao_context)
):
    db_obj = models.Registro(**obj_in.dict(), edicao_id=edicao_ctx.id)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.post("/{registro_id}/itens", response_model=registro.RegistroItemOut)
def adicionar_item_registro(
    username: str, slugProjeto: str, slugEdicao: str,
    registro_id: int, item_id: int, 
    db: Session = Depends(get_db)
):
    db_obj = models.RegistroItem(registro_id=registro_id, item_id=item_id)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.post("/{registro_id}/dinheiro", response_model=registro.RegistroDinheiroOut)
def adicionar_dinheiro_registro(
    username: str, slugProjeto: str, slugEdicao: str,
    registro_id: int, valor: float, 
    db: Session = Depends(get_db)
):
    db_obj = models.RegistroDinheiro(registro_id=registro_id, valor=valor)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

# Deleta um registro inteiro e tudo que estiver vinculado a ele (Itens, Dinheiro, etc)
@router.delete("/{id:int}")
def deletar_registro(
    username: str, slugProjeto: str, slugEdicao: str,
    id: int, 
    db: Session = Depends(get_db)
):
    db_obj = db.query(models.Registro).filter(models.Registro.id == id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Registro não encontrado")
    
    # O banco de dados cuidará do delete em cascata (se configurado) 
    # ou podemos deletar manualmente os filhos aqui
    db.delete(db_obj)
    db.commit()
    return {"message": "Registro deletado com sucesso"}

# Deleta apenas um item específico de dentro de um registro
@router.delete("/itens/{item_registro_id:int}")
def deletar_item_registro(
    username: str, slugProjeto: str, slugEdicao: str,
    item_registro_id: int, 
    db: Session = Depends(get_db)
):
    db_obj = db.query(models.RegistroItem).filter(models.RegistroItem.id == item_registro_id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Item do registro não encontrado")
    
    db.delete(db_obj)
    db.commit()
    return {"message": "Item removido do registro"}

# Edita qual item do catálogo aquele registro se refere
@router.put("/itens/{item_registro_id:int}", response_model=registro.RegistroItemOut)
def editar_item_registro(
    username: str, slugProjeto: str, slugEdicao: str,
    item_registro_id: int, 
    novo_item_id: int,
    db: Session = Depends(get_db)
):
    db_obj = db.query(models.RegistroItem).filter(models.RegistroItem.id == item_registro_id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Item do registro não encontrado")
    
    db_obj.item_id = novo_item_id
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
