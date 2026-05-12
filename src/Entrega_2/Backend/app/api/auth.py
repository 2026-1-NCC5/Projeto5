from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core import security
from app.models import models
from app.schemas import usuario
from sqlalchemy import or_
from . import deps

router = APIRouter(prefix="/auth", tags=["Autenticação"])

@router.post("/login", response_model=usuario.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    import traceback
    try:
        # Busca o usuário
        user = db.query(models.Usuario).filter(
            or_(
                models.Usuario.username == form_data.username,
                models.Usuario.email == form_data.username
            )
        ).first()
        
        if not user or not security.verify_password(form_data.password, user.senha):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciais incorretas (E-mail/Username ou senha)",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Criamos o token
        access_token = security.create_access_token(subject=user.username)
        return {"access_token": access_token, "token_type": "bearer"}
        
    except HTTPException as he:
        raise he
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"ERRO NO SERVIDOR: {str(e)}"
        )

@router.get("/me", response_model=usuario.UsuarioOut)
def read_users_me(current_user: models.Usuario = Depends(deps.get_current_user)):
    return current_user
