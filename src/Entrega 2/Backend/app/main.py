from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.models import models
from app.models.models import oauth2_scheme
from app.api import auth, projeto, desafio, turma, aluno, grupo, doacao, ranking, catalogo, financeiro, usuario, preferencia, vinculo, checkout
from app.core.logger import logger

try:
    Base.metadata.create_all(bind=engine)
    logger.info("[OK] Banco de dados sincronizado com sucesso.")
except Exception as e:
    logger.error(f"[ERRO] Erro ao sincronizar o banco: {e}")

app = FastAPI(
    title="ScanCount AI API",
    description="Backend para gestão de inventário e arrecadação via Visão Computacional",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(projeto.router)
app.include_router(desafio.router)
app.include_router(turma.router)
app.include_router(aluno.router)
app.include_router(grupo.router)
app.include_router(doacao.router)
app.include_router(ranking.router)
app.include_router(catalogo.router)
app.include_router(financeiro.router)
app.include_router(usuario.router)
app.include_router(preferencia.router)
app.include_router(vinculo.router)
app.include_router(checkout.router)

@app.get("/", tags=["Status"])
def root():
    return {
        "status": "online",
        "projeto": "ScanCount AI",
        "integrantes": ["Duda", "Caroliny", "Murilo", "Rafael"],
        "documentacao": "/docs"
    }

@app.get("/perfil", tags=["Usuário"])
def testar_autorizacao(token: str = Depends(oauth2_scheme)):
    return {
        "message": "Parabéns! Você acessou uma rota protegida.",
        "token_recebido": token
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)