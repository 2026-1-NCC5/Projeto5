from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.aluno import AlunoPreCadastro, AlunoOut, AlunoStatusOut
from app.models import models
from app.api import deps
from app.services.aluno_service import AlunoService
from app.services.import_service import ImportService

router = APIRouter(prefix="/alunos", tags=["Gestão de Alunos"])

# Rota para o Professor gerar o convite
@router.post("/pre-cadastro", response_model=AlunoOut)
def pre_cadastro(dados: AlunoPreCadastro, db: Session = Depends(get_db)):
    return AlunoService.criar_pre_cadastro(db, dados.nome, dados.email_pre_cadastro, dados.turma_id, dados.ra)

# Rota para o Aluno (logado ou recém-cadastrado) resgatar o vínculo
@router.post("/resgatar-convite")
def resgatar(token: str, db: Session = Depends(get_db), current_user = Depends(deps.get_current_user)):
    res = AlunoService.confirmar_vinculo(db, token, current_user.id)
    if not res["success"]:
        raise HTTPException(status_code=400, detail=res["detail"])
    return res

@router.post("/importar-planilha")
async def importar_alunos(
    desafio_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """
    Recebe um Excel/CSV, cria turmas inexistentes e pré-cadastra todos os alunos.
    """
    if not file.filename.endswith(('.xlsx', '.csv')):
        raise HTTPException(status_code=400, detail="Formato de arquivo inválido. Use Excel ou CSV.")

    conteudo = await file.read()
    resultado = ImportService.processar_planilha_alunos(db, conteudo, desafio_id)
    
    return {
        "message": "Processamento concluído",
        "detalhes": resultado
    }

@router.get("/acompanhamento/{desafio_id}")
def acompanhar_vinculos(
    desafio_id: int,
    turma_id: Optional[int] = None,
    sem_grupo: Optional[bool] = None, 
    vinculado: Optional[bool] = None, 
    db: Session = Depends(get_db)
):
    query = db.query(models.Aluno).join(models.Turma).filter(models.Turma.desafio_id == desafio_id)
    
    if sem_grupo:
        query = query.filter(models.Aluno.grupo_id == None)
    # 2. Filtro por Turma
    if turma_id:
        query = query.filter(models.Aluno.turma_id == turma_id)

    # 3. Filtro por Status de Vínculo
    if vinculado is True:
        # Busca apenas quem tem usuario_id preenchido
        query = query.filter(models.Aluno.usuario_id.isnot(None))
    elif vinculado is False:
        # Busca apenas quem ainda é "fantasma" (usuario_id é nulo)
        query = query.filter(models.Aluno.usuario_id.is_(None))

    alunos = query.all()

    # 4. Mapeamento para o Schema (Flattening)
    return [
        {
            "id": a.id,
            "nome": a.nome,
            "email_pre_cadastro": a.email_pre_cadastro,
            "ra": a.ra,
            "turma_id": a.turma_id,
            "nome_turma": a.turma.nome,
            "vinculado": a.usuario_id is not None
        }
        for a in alunos
    ]