from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from app.models import models
from app.schemas.financeiro import ArrecadarIn, ResgatarIn

class FinanceiroService:
    @staticmethod
    def arrecadar_valor(db: Session, user_id: int, dados: ArrecadarIn):
        aluno = db.query(models.Aluno).filter(models.Aluno.usuario_id == user_id).first()
        if not aluno:
            raise HTTPException(status_code=400, detail="Usuário não é um aluno cadatrado.")
            
        if not aluno.grupo_id:
            raise HTTPException(status_code=400, detail="Aluno não percente a nenhum grupo. Não é possível arrecadar fundos.")
            
        nova_arrecadacao = models.ArrecadacaoDinheiro(
            aluno_id=aluno.id,
            valor=dados.valor,
            origem=dados.origem
        )
        db.add(nova_arrecadacao)
        db.commit()
        db.refresh(nova_arrecadacao)
        return nova_arrecadacao

    @staticmethod
    def obter_saldo_grupo(db: Session, user_id: int):
        aluno = db.query(models.Aluno).filter(models.Aluno.usuario_id == user_id).first()
        if not aluno or not aluno.grupo_id:
            raise HTTPException(status_code=400, detail="Aluno não percente a nenhum grupo válido para cálculo.")
            
        saldo = db.query(func.sum(models.ArrecadacaoDinheiro.valor)).join(
            models.Aluno, models.ArrecadacaoDinheiro.aluno_id == models.Aluno.id
        ).filter(models.Aluno.grupo_id == aluno.grupo_id).scalar()
        
        return saldo or 0.0

    @staticmethod
    def resgatar_compra(db: Session, user_id: int, dados: ResgatarIn):
        aluno = db.query(models.Aluno).filter(models.Aluno.usuario_id == user_id).first()
        if not aluno or not aluno.grupo_id:
            raise HTTPException(status_code=400, detail="Aluno não percente a nenhum grupo válido.")

        saldo_atual = FinanceiroService.obter_saldo_grupo(db, user_id)
        if saldo_atual < dados.valor:
            raise HTTPException(status_code=400, detail=f"Saldo insuficiente. Saldo atual: R$ {saldo_atual:.2f}")

        # Insere a saída de caixa
        novo_resgate = models.ArrecadacaoDinheiro(
            aluno_id=aluno.id,
            valor=-dados.valor,
            origem=f"Resgate para Compras: {dados.descricao}"
        )
        db.add(novo_resgate)
        db.commit()
        db.refresh(novo_resgate)
        return novo_resgate
