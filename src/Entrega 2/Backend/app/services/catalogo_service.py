from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import models
from app.schemas.catalogo import ValidarCadastrarIn, ItemPermitidoCreate, ClonarItensIn

class CatalogoService:
    @staticmethod
    def listar_itens_permitidos(db: Session, desafio_id: int):
        return db.query(models.ItemPermitido).filter(models.ItemPermitido.desafio_id == desafio_id).all()

    @staticmethod
    def criar_item_permitido(db: Session, dados: ItemPermitidoCreate):
        novo_item = models.ItemPermitido(
            nome=dados.nome,
            unidade_medida=dados.unidade_medida,
            desafio_id=dados.desafio_id
        )
        db.add(novo_item)
        db.commit()
        db.refresh(novo_item)
        return novo_item

    @staticmethod
    def clonar_itens_permitidos(db: Session, dados: ClonarItensIn):
        itens_origem = db.query(models.ItemPermitido).filter(models.ItemPermitido.desafio_id == dados.desafio_origem_id).all()
        
        if not itens_origem:
            raise HTTPException(status_code=404, detail="Nenhum item encontrado no desafio origem para clonar.")
            
        novos_itens = []
        for item in itens_origem:
            novo_item = models.ItemPermitido(
                nome=item.nome,
                unidade_medida=item.unidade_medida,
                desafio_id=dados.desafio_destino_id
            )
            db.add(novo_item)
            novos_itens.append(novo_item)
            
        db.commit()
        return novos_itens

    @staticmethod
    def excluir_item_permitido(db: Session, item_id: int):
        item = db.query(models.ItemPermitido).filter(models.ItemPermitido.id == item_id).first()
        if not item:
            raise HTTPException(status_code=404, detail="Item permitido não encontrado.")
            
        em_uso = db.query(models.CatalogoProduto).filter(models.CatalogoProduto.item_id == item_id).first()
        if em_uso:
            raise HTTPException(status_code=400, detail="Não é possível excluir este item oficial pois já existem produtos do catálogo vinculados a ele.")
            
        db.delete(item)
        db.commit()
        return True

    @staticmethod
    def validar_ou_cadastrar(db: Session, dados: ValidarCadastrarIn, usuario_id: int):
        produto_existente = db.query(models.CatalogoProduto).filter(models.CatalogoProduto.codigo_barras == dados.codigo_barras).first()
        
        if produto_existente:
            return produto_existente

        if not dados.peso_volume or not dados.item_id:
            return None
            
        item_permitido = db.query(models.ItemPermitido).filter(models.ItemPermitido.id == dados.item_id).first()
        if not item_permitido:
            raise HTTPException(status_code=404, detail="Categoria (Item Permitido) não encontrada.")
            
        # Pega o aluno_id através do usuario_id
        aluno = db.query(models.Aluno).filter(models.Aluno.usuario_id == usuario_id).first()
        if not aluno:
            raise HTTPException(status_code=400, detail="Usuário não é um aluno, impossível realizar cadastro")

        novo_produto = models.CatalogoProduto(
            codigo_barras=dados.codigo_barras,
            marca=dados.marca,
            peso_volume=dados.peso_volume,
            item_id=dados.item_id,
            cadastrado_por_aluno_id=aluno.id
        )
        
        db.add(novo_produto)
        db.commit()
        db.refresh(novo_produto)
        
        return novo_produto
