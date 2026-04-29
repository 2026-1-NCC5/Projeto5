from sqlalchemy.orm import Session
from app.models import models
from fastapi import HTTPException

class GrupoService:
    @staticmethod
    def enviar_convite(db: Session, grupo_id: int, aluno_id: int):
        # Verifica se o aluno já está no grupo
        aluno = db.query(models.Aluno).filter(models.Aluno.id == aluno_id).first()
        if aluno.grupo_id:
            raise HTTPException(status_code=400, detail="Aluno já pertence a um grupo.")

        # Cria o convite
        novo_convite = models.ConviteGrupo(
            grupo_id=grupo_id,
            aluno_id=aluno_id,
            status="pendente"
        )
        db.add(novo_convite)
        db.commit()
        return novo_convite

    @staticmethod
    def aceitar_convite(db: Session, convite_id: int, aluno_id: int):
        # 1. Busca o convite específico
        convite = db.query(models.ConviteGrupo).filter(
            models.ConviteGrupo.id == convite_id,
            models.ConviteGrupo.aluno_id == aluno_id
        ).first()

        if not convite:
            raise HTTPException(status_code=404, detail="Convite não encontrado.")

        # 2. Vincula o aluno ao grupo
        aluno = db.query(models.Aluno).filter(models.Aluno.id == aluno_id).first()
        aluno.grupo_id = convite.grupo_id
        
        # 3. LIMPEZA: Deleta ou Invalida todos os convites desse aluno
        # Aqui realizamos o seu desejo de "fazer sumir" os outros convites
        db.query(models.ConviteGrupo).filter(
            models.ConviteGrupo.aluno_id == aluno_id
        ).delete()

        db.commit()
        return {"message": "Vínculo realizado e outros convites removidos."}