from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models import models
from app.core import security
from app.core.logger import logger

def seed_db():
    db = SessionLocal()
    try:
        logger.info("[INICIO] Iniciando o semeio da estrutura base...")

        # 1. Criar Usuário (O executor/administrador)
        user_email = "professor@fecap.br"
        user = db.query(models.Usuario).filter(models.Usuario.email == user_email).first()
        if not user:
            user = models.Usuario(
                nome="Duda Administradora",
                email=user_email,
                senha=security.get_password_hash("fecap123"[:72])
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            logger.info(f"[OK] Usuário {user_email} criado.")

        # 2. Criar Projeto (O Tenant/Organização)
        projeto_nome = "ScanCount Social"
        projeto = db.query(models.Projeto).filter(models.Projeto.nome == projeto_nome).first()
        if not projeto:
            projeto = models.Projeto(
                nome=projeto_nome,
                descricao="Tenant principal para gestão de doações e impacto social.",
                ativo=True
            )
            db.add(projeto)
            db.commit()
            db.refresh(projeto)
            logger.info(f"[OK] Tenant '{projeto_nome}' criado.")

        # 3. Vincular Usuário ao Projeto como ADM
        # Isso valida a sua lógica de Multi-tenancy (um usuário tem um papel em um projeto)
        vinculo = db.query(models.VinculoProjeto).filter_by(
            usuario_id=user.id, 
            projeto_id=projeto.id
        ).first()
        if not vinculo:
            vinculo = models.VinculoProjeto(
                usuario_id=user.id,
                projeto_id=projeto.id,
                papel="ADM"
            )
            db.add(vinculo)
            logger.info(f"[OK] Vínculo de ADM estabelecido entre Usuário e Tenant.")

        # 4. Criar Desafio (O evento/semestre dentro do Tenant)
        desafio_semestre = "2026.1"
        desafio = db.query(models.Desafio).filter(
            models.Desafio.projeto_id == projeto.id,
            models.Desafio.semestre == desafio_semestre
        ).first()
        if not desafio:
            desafio = models.Desafio(
                projeto_id=projeto.id,
                semestre=desafio_semestre,
                min_alunos_por_grupo=2,
                max_alunos_por_grupo=6
            )
            db.add(desafio)
            logger.info(f"[OK] Desafio {desafio_semestre} criado dentro do Tenant '{projeto_nome}'.")

        db.commit()
        logger.info("[FIM] Estrutura base finalizada com sucesso!")

    except Exception as e:
        logger.error(f"[ERRO] Erro ao semear banco: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()