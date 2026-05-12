from fastapi import FastAPI, Depends, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.models.models import oauth2_scheme
from app.api import auth, projeto, edicao, turma, aluno, grupo, ranking, catalogo, usuario, preferencia, vinculo, checkout, registro, metricas, convite
from app.core.logger import logger

# Criação das tabelas no banco de dados (SQLite)
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

# Configuração de CORS para permitir o frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Roteador mestre com prefixo /api para alinhar com o frontend (apiFetch)
api_router = APIRouter(prefix="/api")

# Rotas de Autenticação e Usuário (Não hierárquicas por projeto)
api_router.include_router(auth.router)
api_router.include_router(usuario.router)

# Rotas de Gestão de Projetos (Raiz do multi-tenancy)
api_router.include_router(projeto.router)

# Rotas Hierárquicas (/{username}/{slugProjeto}/...)
api_router.include_router(edicao.router)
api_router.include_router(turma.router)
api_router.include_router(registro.router)
api_router.include_router(checkout.router)
api_router.include_router(metricas.router)

# Outras rotas (Placeholders)
api_router.include_router(aluno.router)
api_router.include_router(grupo.router)
api_router.include_router(ranking.router)
api_router.include_router(catalogo.router)
api_router.include_router(preferencia.router)
api_router.include_router(vinculo.router)
api_router.include_router(convite.router)

app.include_router(api_router)

@app.get("/", tags=["Status"])
def root():
    return {
        "status": "online",
        "projeto": "ScanCount AI",
        "integrantes": ["Duda", "Caroliny", "Murilo", "Rafael"],
        "documentacao": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)