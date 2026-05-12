from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import models
from app.schemas import projeto
from typing import List
from app.api.deps import get_current_user

# Prefixo Hierárquico: agora todos os projetos são acessados via /username/projetos
router = APIRouter(prefix="/{username}/projetos", tags=["Projetos"])

def get_user_by_name(username: str, db: Session):
    user = db.query(models.Usuario).filter(models.Usuario.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user

from typing import List, Optional

@router.get("/", response_model=List[projeto.ProjetoOut])
def listar_projetos_do_usuario(
    username: str,
    status: Optional[str] = None, 
    papel: Optional[str] = None, # Filtro por papel (adm ou member)
    db: Session = Depends(get_db),
    current_user: Optional[models.Usuario] = Depends(get_current_user)
):
    target_user = get_user_by_name(username, db)
    
    # 1. Busca os projetos que o target_user tem acesso
    # Mas o 'papel' retornado deve ser do usuário LOGADO (current_user)
    query = db.query(models.Projeto).join(
        models.VinculoProjeto, models.VinculoProjeto.projeto_id == models.Projeto.id
    ).filter(
        models.VinculoProjeto.usuario_id == target_user.id,
        models.Projeto.display == True
    )
    
    if status:
        query = query.filter(models.Projeto.status == status)
        
    projetos_list = query.all()
    
    # 2. Para cada projeto, descobre qual o papel do usuário logado (requester)
    # Se não houver usuário logado (rota pública), o papel é o do target_user
    requester_id = current_user.id if current_user else target_user.id
    
    projetos_com_papel = []
    for proj in projetos_list:
        vinculo = db.query(models.VinculoProjeto).filter(
            models.VinculoProjeto.projeto_id == proj.id,
            models.VinculoProjeto.usuario_id == requester_id
        ).first()
        
        # Atribui o papel dinamicamente
        proj.papel = vinculo.papel if vinculo else "membro"
        
        # Filtro de papel (se solicitado)
        if papel and proj.papel != papel:
            continue
            
        projetos_com_papel.append(proj)
        
    return projetos_com_papel

@router.get("/{slug_projeto}", response_model=projeto.ProjetoOut)
def buscar_projeto_especifico(
    username: str, slug_projeto: str, 
    db: Session = Depends(get_db),
    current_user: Optional[models.Usuario] = Depends(get_current_user)
):
    target_user = get_user_by_name(username, db)
    projeto_obj = db.query(models.Projeto).filter(
        models.Projeto.slug == slug_projeto,
        models.Projeto.criador_id == target_user.id,
        models.Projeto.display == True
    ).first()
    
    if not projeto_obj:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
        
    # Identifica o papel do requester
    requester_id = current_user.id if current_user else target_user.id
    vinculo = db.query(models.VinculoProjeto).filter(
        models.VinculoProjeto.projeto_id == projeto_obj.id,
        models.VinculoProjeto.usuario_id == requester_id
    ).first()
    
    projeto_obj.papel = vinculo.papel if vinculo else "membro"
    return projeto_obj
    if not projeto_obj:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    return projeto_obj

@router.post("/", response_model=projeto.ProjetoOut)
def criar_novo_projeto(
    username: str,
    obj_in: projeto.ProjetoCreate,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    if current_user.username != username:
        raise HTTPException(status_code=403, detail="Você só pode criar projetos para o seu próprio usuário")
        
    db_obj = models.Projeto(**obj_in.dict(), criador_id=current_user.id)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    
    vinculo = models.VinculoProjeto(usuario_id=current_user.id, projeto_id=db_obj.id, papel="adm")
    db.add(vinculo)
    db.commit()
    
    return db_obj

@router.put("/{slug_projeto}", response_model=projeto.ProjetoOut)
def atualizar_projeto(
    username: str, slug_projeto: str,
    obj_in: projeto.ProjetoUpdate,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    user = get_user_by_name(username, db)
    projeto_obj = db.query(models.Projeto).filter(
        models.Projeto.slug == slug_projeto,
        models.Projeto.criador_id == user.id
    ).first()
    
    if not projeto_obj:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
        
    if projeto_obj.criador_id != current_user.id:
        raise HTTPException(status_code=403, detail="Permissão negada")

    update_data = obj_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(projeto_obj, key, value)
        
    db.add(projeto_obj)
    db.commit()
    db.refresh(projeto_obj)
    return projeto_obj

@router.delete("/{slug_projeto}")
def deletar_projeto(
    username: str, slug_projeto: str,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    user = get_user_by_name(username, db)
    projeto_obj = db.query(models.Projeto).filter(
        models.Projeto.slug == slug_projeto,
        models.Projeto.criador_id == user.id
    ).first()
    
    if not projeto_obj:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
        
    if projeto_obj.criador_id != current_user.id:
        raise HTTPException(status_code=403, detail="Permissão negada")

    # SOFT DELETE: Apenas marcamos como invisível
    projeto_obj.display = False
    db.add(projeto_obj)
    db.commit()
    
    return {"message": "Projeto movido para a lixeira (invisível)"}

