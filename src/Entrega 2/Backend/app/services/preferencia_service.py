from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import models
from app.schemas.preferencia import PreferenciaUpdate

class PreferenciaService:
    @staticmethod
    def atualizar_preferencia(db: Session, usuario_id: int, dados: PreferenciaUpdate):
        pref = db.query(models.Preferencia).filter(models.Preferencia.usuario_id == usuario_id).first()
        if not pref:
            raise HTTPException(status_code=404, detail="Preferências não encontradas")
            
        if dados.tema is not None:
            pref.tema = dados.tema
        if dados.notificacoes_ativas is not None:
            pref.notificacoes_ativas = dados.notificacoes_ativas
            
        db.commit()
        db.refresh(pref)
        return pref
