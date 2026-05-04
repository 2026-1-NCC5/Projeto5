from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid # Para gerar o código único
from typing import List
from app.api import deps
from app.models import models
from app.schemas import grupo as schemas # Supondo que você criou os schemas de grupo
from app.core.database import get_db

router = APIRouter(prefix="/grupos", tags=["Grupos e Convites"])

@router.post("/criar", status_code=201)
def criar_grupo(
    grupo_in: schemas.GrupoCreate, 
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    # 1. Busca o registro de Aluno do usuário logado
    aluno_criador = db.query(models.Aluno).filter(models.Aluno.usuario_id == current_user.id).first()
    
    if not aluno_criador:
        raise HTTPException(status_code=404, detail="Perfil de aluno não encontrado para este usuário.")

    if aluno_criador.grupo_id is not None:
        raise HTTPException(status_code=400, detail="Você já pertence a um grupo e não pode criar outro.")

    # 2. Gera um código de convite único (Ex: 6 primeiros caracteres de um UUID)
    codigo_gerado = str(uuid.uuid4()).upper()[:6]

    # 3. Cria o novo grupo vinculado à mesma turma do aluno
    novo_grupo = models.Grupo(
        nome_projeto=grupo_in.nome_projeto,
        codigo_convite=codigo_gerado,
        turma_id=aluno_criador.turma_id,
        lider_id=aluno_criador.id
    )
    
    db.add(novo_grupo)
    db.flush() # Para pegar o ID do grupo antes do commit final

    # 4. Vincula o criador ao grupo imediatamente
    aluno_criador.grupo_id = novo_grupo.id

    db.commit()
    db.refresh(novo_grupo)

    return {
        "message": "Grupo criado com sucesso!",
        "grupo": {
            "id": novo_grupo.id,
            "nome_projeto": novo_grupo.nome_projeto,
            "codigo_convite": novo_grupo.codigo_convite,
            "turma_id": novo_grupo.turma_id,
            "lider_id": novo_grupo.lider_id
        }
    }

# 1. Enviar Convite (O que faltava para o Líder!)
@router.post("/convidar", status_code=201)
def enviar_convite(
    aluno_id: int, 
    grupo_id: int, 
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    # Opcional: Validar se quem está convidando é o líder do grupo
    # ...
    
    # Verifica se o aluno já tem grupo
    aluno = db.query(models.Aluno).filter(models.Aluno.id == aluno_id).first()
    if aluno.grupo_id:
        raise HTTPException(status_code=400, detail="Este aluno já pertence a um grupo.")

    novo_convite = models.ConviteGrupo(grupo_id=grupo_id, aluno_id=aluno_id)
    db.add(novo_convite)
    db.commit()
    return {"message": "Convite enviado com sucesso!"}

# 2. Alunos Disponíveis (Sua rota com ajuste de Schema)
@router.get("/alunos-disponiveis/{turma_id}")
def listar_disponiveis(
    turma_id: int, 
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    return db.query(models.Aluno).filter(
        models.Aluno.turma_id == turma_id,
        models.Aluno.grupo_id == None
    ).offset(skip).limit(limit).all()

# 3. Meus Convites (Ajustado com Join para o Front ver o nome do Grupo)
@router.get("/meus-convites")
def ver_convites(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db), 
    current_user = Depends(deps.get_current_user)
):
    aluno = db.query(models.Aluno).filter(models.Aluno.usuario_id == current_user.id).first()
    if not aluno:
        raise HTTPException(status_code=404, detail="Perfil de aluno não encontrado.")
    
    # Usamos o join para garantir que o objeto Grupo venha junto e o Front saiba QUEM convidou
    return db.query(models.ConviteGrupo).filter(
        models.ConviteGrupo.aluno_id == aluno.id
    ).offset(skip).limit(limit).all()

# 4. Aceitar Convite (A lógica de limpeza que conversamos)
@router.post("/aceitar-convite/{convite_id}")
def aceitar_convite(
    convite_id: int, 
    db: Session = Depends(get_db), 
    current_user = Depends(deps.get_current_user)
):
    aluno = db.query(models.Aluno).filter(models.Aluno.usuario_id == current_user.id).first()
    convite = db.query(models.ConviteGrupo).filter(models.ConviteGrupo.id == convite_id).first()

    if not convite or convite.aluno_id != aluno.id:
        raise HTTPException(status_code=404, detail="Convite não encontrado.")

    # Vincula o aluno ao grupo
    aluno.grupo_id = convite.grupo_id

    # LIMPEZA: Remove todos os convites pendentes desse aluno
    db.query(models.ConviteGrupo).filter(models.ConviteGrupo.aluno_id == aluno.id).delete()
    
    db.commit()
    return {"message": "Você entrou no grupo com sucesso!"}

# 5. Alocação Manual (Professor)
@router.put("/professor/alocar-manual")
def alocar_aluno(aluno_id: int, grupo_id: int, db: Session = Depends(get_db)):
    aluno = db.query(models.Aluno).filter(models.Aluno.id == aluno_id).first()
    if not aluno:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    
    aluno.grupo_id = grupo_id
    db.query(models.ConviteGrupo).filter(models.ConviteGrupo.aluno_id == aluno_id).delete()
    
    db.commit()
    return {"message": "Aluno alocado com sucesso pelo professor."}

@router.post("/entrar-por-codigo")
def entrar_por_codigo(
    codigo: str, 
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    grupo = db.query(models.Grupo).filter(models.Grupo.codigo_convite == codigo.upper()).first()
    if not grupo:
        raise HTTPException(status_code=404, detail="Código de grupo inválido.")
    
    aluno = db.query(models.Aluno).filter(models.Aluno.usuario_id == current_user.id).first()
    
    # Valida se é da mesma turma
    if aluno.turma_id != grupo.turma_id:
        raise HTTPException(status_code=400, detail="Você só pode entrar em grupos da sua própria turma.")

    aluno.grupo_id = grupo.id
    db.commit()
    return {"message": f"Você entrou no grupo {grupo.nome_projeto}!"}