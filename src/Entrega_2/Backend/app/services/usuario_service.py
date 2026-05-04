from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models import models
from app.schemas.usuario import UsuarioCreate, UsuarioUpdate
from app.core import security

class UsuarioService:
    @staticmethod
    def criar_usuario(db: Session, dados: UsuarioCreate):
        # Verifica se email já existe
        user_existente = db.query(models.Usuario).filter(models.Usuario.email == dados.email).first()
        if user_existente:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="E-mail já está em uso"
            )

        # Hash da senha
        hashed_password = security.get_password_hash(dados.senha)

        # Cria usuário
        novo_usuario = models.Usuario(
            nome=dados.nome,
            email=dados.email,
            senha=hashed_password
        )
        db.add(novo_usuario)
        db.commit()
        db.refresh(novo_usuario)

        # Cria preferência padrão
        nova_pref = models.Preferencia(
            usuario_id=novo_usuario.id,
            tema="light",
            notificacoes_ativas=True
        )
        db.add(nova_pref)
        db.commit()
        db.refresh(novo_usuario)

        return novo_usuario

    @staticmethod
    def obter_usuario(db: Session, usuario_id: int):
        user = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        return user

    @staticmethod
    def atualizar_usuario(db: Session, usuario_id: int, dados: UsuarioUpdate):
        user = UsuarioService.obter_usuario(db, usuario_id)
        
        if dados.nome is not None:
            user.nome = dados.nome
        if dados.email is not None:
            user_existente = db.query(models.Usuario).filter(models.Usuario.email == dados.email).first()
            if user_existente and user_existente.id != usuario_id:
                 raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="E-mail já está em uso por outro usuário"
                )
            user.email = dados.email
            
        db.commit()
        db.refresh(user)
        return user
