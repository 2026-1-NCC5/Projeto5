import uuid
from sqlalchemy.orm import Session
from app.models import models
from .email_service import EmailService

class AlunoService:
    @staticmethod
    def criar_pre_cadastro(db: Session, nome: str, email: str, turma_id: int, ra: str = None):
        token = str(uuid.uuid4())
        
        novo_aluno = models.Aluno(
            nome=nome,
            email_pre_cadastro=email,
            turma_id=turma_id,
            token_convite=token,
            ra=ra,
            usuario_id=None
        )
        db.add(novo_aluno)
        db.commit()
        db.refresh(novo_aluno)
        
        EmailService.enviar_link_convite(email, nome, token)
        
        return novo_aluno

    @staticmethod
    def confirmar_vinculo(db: Session, token: str, usuario_id: int):
        aluno = db.query(models.Aluno).filter(models.Aluno.token_convite == token).first()
        if not aluno:
             return {"success": False, "detail": "Convite inválido ou não encontrado."}
        if aluno.usuario_id:
             return {"success": False, "detail": "Este convite já foi utilizado."}
             
        # Verifica se o usuário logado já é aluno
        verificar_existencia = db.query(models.Aluno).filter(models.Aluno.usuario_id == usuario_id).first()
        if verificar_existencia:
             return {"success": False, "detail": "Você já possui um aluno vinculado a essa ou outra turma."}
             
        aluno.usuario_id = usuario_id
        db.commit()
        return {"success": True, "detail": "Vínculo realizado com sucesso!"}