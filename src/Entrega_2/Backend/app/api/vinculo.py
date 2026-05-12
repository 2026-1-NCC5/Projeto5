from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import models
from typing import List

from app.api.deps import get_current_user, get_projeto_context

# Padronização Hierárquica: Gerenciamento de Membros dentro do Projeto
router = APIRouter(prefix="/{username}/{slug_projeto}/vinculo", tags=["Vínculos"])

# Lista todos os usuários vinculados ao projeto com seus detalhes (Nome, Email, Papel)
@router.get("/")
def listar_membros_projeto(
    username: str, slug_projeto: str, 
    db: Session = Depends(get_db),
    projeto_ctx: models.Projeto = Depends(get_projeto_context)
):
    # Join com a tabela de Usuário para trazer os dados legíveis
    membros = db.query(
        models.Usuario.id,
        models.Usuario.nome,
        models.Usuario.email,
        models.VinculoProjeto.papel
    ).join(
        models.VinculoProjeto, models.VinculoProjeto.usuario_id == models.Usuario.id
    ).filter(
        models.VinculoProjeto.projeto_id == projeto_ctx.id
    ).all()

    return [{"id": m.id, "nome": m.nome, "email": m.email, "papel": m.papel} for m in membros]

# Adicionar novo membro
@router.post("/")
def adicionar_membro_ao_projeto(
    username: str, slug_projeto: str,
    usuario_id: int, papel: str, 
    db: Session = Depends(get_db),
    projeto_ctx: models.Projeto = Depends(get_projeto_context)
):
    existente = db.query(models.VinculoProjeto).filter(
        models.VinculoProjeto.usuario_id == usuario_id,
        models.VinculoProjeto.projeto_id == projeto_ctx.id
    ).first()
    
    if existente:
        raise HTTPException(status_code=400, detail="Usuário já vinculado")

    db_obj = models.VinculoProjeto(usuario_id=usuario_id, projeto_id=projeto_ctx.id, papel=papel)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

# Editar papel do membro (Promover/Rebaixar)
@router.put("/{usuario_id:int}")
def editar_papel_membro(
    username: str, slug_projeto: str, usuario_id: int,
    novo_papel: str,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user),
    projeto_ctx: models.Projeto = Depends(get_projeto_context)
):
    # Apenas o criador pode mudar papéis
    if projeto_ctx.criador_id != current_user.id:
        raise HTTPException(status_code=403, detail="Apenas o criador pode gerenciar membros")

    vinculo = db.query(models.VinculoProjeto).filter(
        models.VinculoProjeto.projeto_id == projeto_ctx.id,
        models.VinculoProjeto.usuario_id == usuario_id
    ).first()
    
    if not vinculo:
        raise HTTPException(status_code=404, detail="Vínculo não encontrado")
    
    vinculo.papel = novo_papel
    db.add(vinculo)
    db.commit()
    return {"message": f"Papel atualizado para {novo_papel}"}

# Remover membro do projeto
@router.delete("/{usuario_id:int}")
def remover_membro_projeto(
    username: str, slug_projeto: str, usuario_id: int,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user),
    projeto_ctx: models.Projeto = Depends(get_projeto_context)
):
    if projeto_ctx.criador_id == usuario_id:
        raise HTTPException(status_code=400, detail="O criador não pode ser removido")

    if projeto_ctx.criador_id != current_user.id and current_user.id != usuario_id:
        raise HTTPException(status_code=403, detail="Permissão negada")

    vinculo = db.query(models.VinculoProjeto).filter(
        models.VinculoProjeto.projeto_id == projeto_ctx.id,
        models.VinculoProjeto.usuario_id == usuario_id
    ).first()
    
    if not vinculo:
        raise HTTPException(status_code=404, detail="Vínculo não encontrado")
        
    db.delete(vinculo)
    db.commit()
    return {"message": "Membro removido com sucesso"}
