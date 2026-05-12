from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import models
from app.schemas import usuario
from app.api.deps import get_current_user

router = APIRouter(prefix="/usuarios", tags=["Usuários"])

@router.get("/me", response_model=usuario.UsuarioOut)
def read_user_me(current_user: models.Usuario = Depends(get_current_user)):
    return current_user

@router.post("/", response_model=usuario.UsuarioOut)
def create_user(obj_in: usuario.UsuarioCreate, db: Session = Depends(get_db)):
    from app.core.security import get_password_hash
    
    # 1. Verifica se o e-mail já existe
    if db.query(models.Usuario).filter(models.Usuario.email == obj_in.email).first():
        raise HTTPException(status_code=400, detail="Este e-mail já está em uso por outra conta")
        
    # 2. Verifica se o username já existe
    if db.query(models.Usuario).filter(models.Usuario.username == obj_in.username).first():
        raise HTTPException(status_code=400, detail="Este nome de usuário (username) já está sendo utilizado")
    
    db_obj = models.Usuario(
        nome=obj_in.nome,
        sobrenome=obj_in.sobrenome,
        email=obj_in.email,
        username=obj_in.username,
        celular=obj_in.celular,
        senha=get_password_hash(obj_in.senha),
        ativo=True
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.put("/me", response_model=usuario.UsuarioOut)
def update_user_me(
    obj_in: usuario.UsuarioUpdate,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    # Validações de unicidade caso o usuário esteja mudando dados sensíveis
    if obj_in.email and obj_in.email != current_user.email:
        if db.query(models.Usuario).filter(models.Usuario.email == obj_in.email).first():
            raise HTTPException(status_code=400, detail="Novo e-mail já está em uso")
            
    if obj_in.username and obj_in.username != current_user.username:
        if db.query(models.Usuario).filter(models.Usuario.username == obj_in.username).first():
            raise HTTPException(status_code=400, detail="Novo nome de usuário já está em uso")

    update_data = obj_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/me")
def delete_user_me(
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    # Opcional: Aqui poderíamos fazer um "Soft Delete" mudando ativo=False
    # Mas como solicitado, faremos o delete real
    db.delete(current_user)
    db.commit()
    return {"message": "Sua conta foi removida com sucesso"}
