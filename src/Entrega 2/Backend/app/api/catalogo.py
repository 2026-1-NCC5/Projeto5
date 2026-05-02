from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.catalogo import ItemPermitidoOut, ValidarCadastrarIn, CatalogoProdutoOut, ItemPermitidoCreate, ClonarItensIn
from app.services.catalogo_service import CatalogoService
from app.api import deps
from app.models import models

router = APIRouter(prefix="/catalogo", tags=["Catálogo e Itens"])

# Helper para checar se o usuário é Administrador/Professor daquele Desafio
def verify_teacher_for_desafio(desafio_id: int, current_user: models.Usuario, db: Session):
    desafio = db.query(models.Desafio).filter(models.Desafio.id == desafio_id).first()
    if not desafio:
        raise HTTPException(status_code=404, detail="Desafio não encontrado para validação de acesso.")
    # Irá estourar um erro 403 HTTP se o usuário não tiver vínculo ADM com o projeto do desafio
    deps.verify_admin(desafio.projeto_id, current_user, db)


@router.post("/item-permitido", status_code=201, response_model=ItemPermitidoOut)
def criar_item_permitido(
    dados: ItemPermitidoCreate, 
    db: Session = Depends(get_db), 
    current_user = Depends(deps.get_current_user)
):
    """
    Cria uma categoria oficial (Item Permitido) para um desafio. Acesso: Professor/ADM.
    """
    verify_teacher_for_desafio(dados.desafio_id, current_user, db)
    return CatalogoService.criar_item_permitido(db, dados)


@router.get("/itens-permitidos/{desafio_id}", response_model=List[ItemPermitidoOut])
def listar_itens_permitidos(
    desafio_id: int, 
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """
    Retorna a lista de categorias (Arroz, Feijão, etc.) disponíveis num desafio para o App usar no formulário.
    """
    return db.query(models.ItemPermitido).filter(models.ItemPermitido.desafio_id == desafio_id).offset(skip).limit(limit).all()


@router.post("/clonar-itens", status_code=201, response_model=List[ItemPermitidoOut])
def clonar_itens_permitidos(
    dados: ClonarItensIn, 
    db: Session = Depends(get_db), 
    current_user = Depends(deps.get_current_user)
):
    """
    Clona a lista de itens oficiais de um desafio anterior (origem) para o novo desafio.
    Acesso: Professor/ADM.
    """
    verify_teacher_for_desafio(dados.desafio_destino_id, current_user, db)
    return CatalogoService.clonar_itens_permitidos(db, dados)


@router.delete("/item-permitido/{item_id}", status_code=204)
def excluir_item_permitido(
    item_id: int, 
    db: Session = Depends(get_db), 
    current_user = Depends(deps.get_current_user)
):
    """
    Exclui um item permitido apenas se NÃO existirem produtos vinculados a ele na tabela `catalogo_produto`.
    """
    item = db.query(models.ItemPermitido).filter(models.ItemPermitido.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item permitido não encontrado.")
        
    verify_teacher_for_desafio(item.desafio_id, current_user, db)
    CatalogoService.excluir_item_permitido(db, item_id)
    return


@router.post("/validar-e-cadastrar")
def validar_e_cadastrar(
    dados: ValidarCadastrarIn,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """
    Verifica se o código de barras já existe. 
    Se não existe e o payload está completo, cadastra como produto colaborativo usando o item de categoria lincado.
    """
    produto = CatalogoService.validar_ou_cadastrar(db, dados, current_user.id)
    if not produto:
         return {
             "exists": False, 
             "message": "Produto não encontrado. Forneça marca, peso_volume e item_id para cadastrá-lo."
         }
         
    return {
        "exists": True, 
        "message": "Produto validado/cadastrado com sucesso!", 
        "produto": CatalogoProdutoOut.from_orm(produto)
    }
