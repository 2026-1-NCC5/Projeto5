from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import models

class RankingService:
    @staticmethod
    def obter_ranking_turmas(db: Session, desafio_id: int, limit: int = 10):
        """
        Calcula o ranking das turmas baseado na quantidade total de itens doados.
        """
        ranking = db.query(
            models.Turma.nome.label("turma"),
            func.sum(models.ItemDoado.quantidade * models.CatalogoProduto.peso_volume).label("total_arrecadado_kg_l")
        ).join(models.Aluno, models.Aluno.turma_id == models.Turma.id)\
         .join(models.Doacao, models.Doacao.aluno_id == models.Aluno.id)\
         .join(models.ItemDoado, models.ItemDoado.doacao_id == models.Doacao.id)\
         .join(models.CatalogoProduto, models.CatalogoProduto.codigo_barras == models.ItemDoado.codigo_barras)\
         .filter(models.Turma.desafio_id == desafio_id)\
         .group_by(models.Turma.id)\
         .order_by(func.sum(models.ItemDoado.quantidade * models.CatalogoProduto.peso_volume).desc())\
         .limit(limit)\
         .all()
        
        return ranking

    @staticmethod
    def obter_ranking_grupos_por_turma(db: Session, turma_id: int, limit: int = 10):
        """
        Calcula o ranking dos grupos dentro de uma turma específica.
        """
        ranking = db.query(
            models.Grupo.nome_projeto.label("grupo"),
            func.sum(models.ItemDoado.quantidade * models.CatalogoProduto.peso_volume).label("total_arrecadado_kg_l")
        ).join(models.Aluno, models.Aluno.grupo_id == models.Grupo.id)\
         .join(models.Doacao, models.Doacao.aluno_id == models.Aluno.id)\
         .join(models.ItemDoado, models.ItemDoado.doacao_id == models.Doacao.id)\
         .join(models.CatalogoProduto, models.CatalogoProduto.codigo_barras == models.ItemDoado.codigo_barras)\
         .filter(models.Grupo.turma_id == turma_id)\
         .group_by(models.Grupo.id)\
         .order_by(func.sum(models.ItemDoado.quantidade * models.CatalogoProduto.peso_volume).desc())\
         .limit(limit)\
         .all()
        
        return ranking

    @staticmethod
    def obter_ranking_geral_grupos(db: Session, desafio_id: int, limit: int = 10):
        """
        Calcula o ranking geral de grupos de todo o desafio independente da turma.
        """
        ranking = db.query(
            models.Grupo.nome_projeto.label("grupo"),
            func.sum(models.ItemDoado.quantidade * models.CatalogoProduto.peso_volume).label("total_arrecadado_kg_l")
        ).join(models.Aluno, models.Aluno.grupo_id == models.Grupo.id)\
         .join(models.Doacao, models.Doacao.aluno_id == models.Aluno.id)\
         .join(models.ItemDoado, models.ItemDoado.doacao_id == models.Doacao.id)\
         .join(models.CatalogoProduto, models.CatalogoProduto.codigo_barras == models.ItemDoado.codigo_barras)\
         .join(models.Turma, models.Turma.id == models.Grupo.turma_id)\
         .filter(models.Turma.desafio_id == desafio_id)\
         .group_by(models.Grupo.id)\
         .order_by(func.sum(models.ItemDoado.quantidade * models.CatalogoProduto.peso_volume).desc())\
         .limit(limit)\
         .all()
        
        return ranking

    @staticmethod
    def obter_ranking_financeiro_combinado(db: Session, desafio_id: int, limit: int = 10):
        """
        Retorna a soma dos valores em dinheiro arrecadados, separados por turma e por grupo.
        """
        ranking_turmas = db.query(
            models.Turma.nome.label("turma"),
            func.sum(models.ArrecadacaoDinheiro.valor).label("total_arrecadado")
        ).join(models.Aluno, models.Aluno.turma_id == models.Turma.id)\
         .join(models.ArrecadacaoDinheiro, models.ArrecadacaoDinheiro.aluno_id == models.Aluno.id)\
         .filter(models.Turma.desafio_id == desafio_id)\
         .group_by(models.Turma.id)\
         .order_by(func.sum(models.ArrecadacaoDinheiro.valor).desc())\
         .limit(limit)\
         .all()
         
        ranking_grupos = db.query(
            models.Grupo.nome_projeto.label("grupo"),
            func.sum(models.ArrecadacaoDinheiro.valor).label("total_arrecadado")
        ).join(models.Aluno, models.Aluno.grupo_id == models.Grupo.id)\
         .join(models.ArrecadacaoDinheiro, models.ArrecadacaoDinheiro.aluno_id == models.Aluno.id)\
         .join(models.Turma, models.Turma.id == models.Grupo.turma_id)\
         .filter(models.Turma.desafio_id == desafio_id)\
         .group_by(models.Grupo.id)\
         .order_by(func.sum(models.ArrecadacaoDinheiro.valor).desc())\
         .limit(limit)\
         .all()

        return {
            "ranking_turmas": [{"turma": r.turma, "total_arrecadado": r.total_arrecadado} for r in ranking_turmas],
            "ranking_grupos": [{"grupo": r.grupo, "total_arrecadado": r.total_arrecadado} for r in ranking_grupos]
        }