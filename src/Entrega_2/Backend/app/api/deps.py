from fastapi import Depends, HTTPException, status, Header
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import SECRET_KEY, ALGORITHM
from app.models import models

# Verifica se o Token é válido e retorna o Usuário
def get_current_user(token: str = Depends(models.oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token inválido")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")
        
    user = db.query(models.Usuario).filter(models.Usuario.id == int(user_id)).first()
    return user

# Verifica se o usuário é ADMIN em um Tenant (Projeto) específico
def verify_admin(project_id: int, current_user: models.Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    vinculo = db.query(models.VinculoProjeto).filter_by(
        usuario_id=current_user.id, 
        projeto_id=project_id, 
        papel="ADM"
    ).first()
    
    if not vinculo:
        raise HTTPException(status_code=403, detail="Acesso restrito a administradores deste projeto")
    return True