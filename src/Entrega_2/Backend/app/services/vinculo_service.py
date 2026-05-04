from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models import models
from app.schemas.vinculo import VinculoCreate

class VinculoService:
    @staticmethod
    def criar_vinculo(db: Session, dados: VinculoCreate):
        # Verifica se o projeto existe
        projeto = db.query(models.Projeto).filter(models.Projeto.id == dados.projeto_id).first()
        if not projeto:
            raise HTTPException(status_code=404, detail="Projeto não encontrado")
            
        # Verifica se o usuário existe
        usuario = db.query(models.Usuario).filter(models.Usuario.id == dados.usuario_id).first()
        if not usuario:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")

        # Verifica se o vínculo já existe
        vinculo_existente = db.query(models.VinculoProjeto).filter(
            models.VinculoProjeto.usuario_id == dados.usuario_id,
            models.VinculoProjeto.projeto_id == dados.projeto_id
        ).first()

        if vinculo_existente:
            raise HTTPException(status_code=400, detail="Usuário já possui vínculo com este projeto")

        novo_vinculo = models.VinculoProjeto(
            usuario_id=dados.usuario_id,
            projeto_id=dados.projeto_id,
            papel=dados.papel.upper()
        )
        db.add(novo_vinculo)
        db.commit()
        db.refresh(novo_vinculo)
        return novo_vinculo

    @staticmethod
    def listar_vinculos_por_projeto(db: Session, projeto_id: int):
        return db.query(models.VinculoProjeto).filter(models.VinculoProjeto.projeto_id == projeto_id).all()

    @staticmethod
    def listar_vinculos_do_usuario(db: Session, usuario_id: int):
        return db.query(models.VinculoProjeto).filter(models.VinculoProjeto.usuario_id == usuario_id).all()
