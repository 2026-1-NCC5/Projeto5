from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import models
from app.schemas.doacao import RegistrarContagemIn

class DoacaoService:
    @staticmethod
    def registrar_contagem(db: Session, dados: RegistrarContagemIn):
        aluno = db.query(models.Aluno).filter(models.Aluno.id == dados.aluno_id).first()
        if not aluno:
            raise HTTPException(status_code=404, detail="Aluno não encontrado")
            
        if not aluno.grupo_id:
            raise HTTPException(status_code=400, detail="O aluno deve pertencer a um grupo para registrar contagens.")
            
        # Cria o registro mestre de Doação
        nova_doacao = models.Doacao(
            aluno_id=dados.aluno_id,
            tipo_origem=dados.tipo_origem
        )
        db.add(nova_doacao)
        db.flush() # obtem nova_doacao.id
        
        # Cria cada item vinculado a Doação
        for item in dados.itens:
            # Em um cenário completo, você pode verificar `models.CatalogoProduto` aqui
            # para validar a existência do código de barras
            novo_item = models.ItemDoado(
                doacao_id=nova_doacao.id,
                codigo_barras=item.codigo_barras,
                quantidade=item.quantidade
            )
            db.add(novo_item)
            
        db.commit()
        db.refresh(nova_doacao)
        
        return nova_doacao
