from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import models
from app.schemas import checkout, registro
from app.api.deps import get_edicao_context
from typing import List

# Rota hierárquica para alinhar com o frontend
router = APIRouter(prefix="/{username}/{slug_projeto}/{slug_edicao}/checkout", tags=["Checkout"])

@router.get("/", response_model=List[checkout.CheckoutDetalhado])
def listar_checkouts_detalhados(
    username: str, slug_projeto: str, slug_edicao: str,
    db: Session = Depends(get_db),
    edicao_ctx: models.Edicao = Depends(get_edicao_context)
):
    # Busca todos os checkouts do ADM para esta edição
    checkouts_db = db.query(models.Checkout).filter(models.Checkout.edicao_id == edicao_ctx.id).all()
    
    resposta = []
    for co in checkouts_db:
        resumo_map = {} # id_item -> dados agrupados
        t_itens = 0
        t_valor = 0.0
        t_peso = 0.0
        
        for item_link in co.itens:
            it = item_link.catalogo
            if it.id not in resumo_map:
                resumo_map[it.id] = {
                    "item": it,
                    "quantidade": 0,
                    "valor_subtotal": 0.0,
                    "peso_subtotal": 0.0
                }
            
            resumo_map[it.id]["quantidade"] += 1
            resumo_map[it.id]["valor_subtotal"] += it.preco
            resumo_map[it.id]["peso_subtotal"] += it.peso
            
            t_itens += 1
            t_valor += it.preco
            t_peso += it.peso
            
        resposta.append({
            "id": co.id,
            "data_criacao": co.data_criacao,
            "adm_id": co.adm_id,
            "edicao_id": co.edicao_id,
            "itens_resumo": list(resumo_map.values()),
            "total_itens": t_itens,
            "total_valor": round(t_valor, 2),
            "total_peso": round(t_peso, 2)
        })
        
    return resposta

@router.post("/", response_model=checkout.CheckoutDetalhado)
def processar_checkout(
    username: str, slug_projeto: str, slug_edicao: str,
    obj_in: checkout.CheckoutRequest, 
    db: Session = Depends(get_db),
    edicao_ctx: models.Edicao = Depends(get_edicao_context)
):
    # 1. Cria o registro de Checkout do ADM vinculado ao desafio
    novo_checkout = models.Checkout(
        edicao_id=edicao_ctx.id,
        adm_id=obj_in.adm_id
    )
    db.add(novo_checkout)
    db.flush()
    
    # 2. Adiciona itens filtrando pelo catálogo da edição atual
    resumo_map = {}
    t_itens = 0
    t_valor = 0.0
    t_peso = 0.0

    print(f"[DEBUG] Processando {len(obj_in.itens_ids)} itens para o checkout...")
    for item_id in obj_in.itens_ids:
        # Só permite itens que pertencem a este desafio específico
        item_catalogo = db.query(models.Catalogo).filter(
            models.Catalogo.id == item_id,
            models.Catalogo.edicao_id == edicao_ctx.id
        ).first()
        
        if not item_catalogo:
            print(f"[WARN] Item ID {item_id} não encontrado para a edição {edicao_ctx.id}")
            continue
            
        # Cria o vínculo do item no checkout do ADM
        item_checkout = models.CheckoutItem(
            checkout_id=novo_checkout.id,
            item_id=item_id
        )
        db.add(item_checkout)

        # Prepara dados para o retorno detalhado
        if item_id not in resumo_map:
            resumo_map[item_id] = {
                "item": item_catalogo,
                "quantidade": 0,
                "valor_subtotal": 0.0,
                "peso_subtotal": 0.0
            }
        resumo_map[item_id]["quantidade"] += 1
        resumo_map[item_id]["valor_subtotal"] += item_catalogo.preco
        resumo_map[item_id]["peso_subtotal"] += item_catalogo.peso
        
        t_itens += 1
        t_valor += item_catalogo.preco
        t_peso += item_catalogo.peso
    
    print(f"[OK] Checkout finalizado com {t_itens} itens vinculados.")
    
    db.commit()
    db.refresh(novo_checkout)

    # Retorna o checkout já com os cálculos feitos (formato CheckoutDetalhado)
    return {
        "id": novo_checkout.id,
        "data_criacao": novo_checkout.data_criacao,
        "adm_id": novo_checkout.adm_id,
        "edicao_id": novo_checkout.edicao_id,
        "itens_resumo": list(resumo_map.values()),
        "total_itens": t_itens,
        "total_valor": round(t_valor, 2),
        "total_peso": round(t_peso, 2)
    }

# Deletar um registro de checkout
@router.delete("/{checkout_id}")
def deletar_checkout(
    username: str, slug_projeto: str, slug_edicao: str,
    checkout_id: int,
    db: Session = Depends(get_db),
    edicao_ctx: models.Edicao = Depends(get_edicao_context)
):
    checkout_obj = db.query(models.Checkout).filter(
        models.Checkout.id == checkout_id,
        models.Checkout.edicao_id == edicao_ctx.id
    ).first()
    
    if not checkout_obj:
        raise HTTPException(status_code=404, detail="Registro de checkout não encontrado")
    
    # Remove os itens vinculados primeiro (limpeza manual preventiva)
    db.query(models.CheckoutItem).filter(models.CheckoutItem.checkout_id == checkout_id).delete()
    
    db.delete(checkout_obj)
    db.commit()
    
    return {"message": "Registro de checkout removido com sucesso"}
