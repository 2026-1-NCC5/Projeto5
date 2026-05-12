from fastapi import Depends, HTTPException, status
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core import security
from app.models import models
from app.schemas import usuario

def get_current_user(db: Session = Depends(get_db), token: str = Depends(models.oauth2_scheme)) -> models.Usuario:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = usuario.TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = db.query(models.Usuario).filter(models.Usuario.username == token_data.username).first()
    if user is None:
        raise credentials_exception
    return user

def get_projeto_context(username: str, slug_projeto: str, db: Session = Depends(get_db)):
    # Primeiro verifica se o usuário existe pelo username da URL
    user = db.query(models.Usuario).filter(models.Usuario.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário dono não encontrado")
    
    # Busca o projeto filtrando pelo slug E pelo criador (namespace)
    projeto_obj = db.query(models.Projeto).filter(
        models.Projeto.slug == slug_projeto,
        models.Projeto.criador_id == user.id
    ).first()
    
    if not projeto_obj:
        raise HTTPException(status_code=404, detail="Projeto não encontrado para este usuário")
    
    return projeto_obj

def get_edicao_context(
    username: str, slug_projeto: str, slug_edicao: str, 
    db: Session = Depends(get_db),
    projeto_ctx: models.Projeto = Depends(get_projeto_context)
):
    # Localiza a edição dentro do projeto validado
    edicao_obj = db.query(models.Edicao).filter(
        models.Edicao.projeto_id == projeto_ctx.id,
        models.Edicao.slug == slug_edicao
    ).first()
    
    if not edicao_obj:
        raise HTTPException(status_code=404, detail="Edição não encontrada")
    
    return edicao_obj
