from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.models import models  # Importamos os modelos aqui para o Base conhecê-los
from app.models.models import oauth2_scheme  # Importante para o botão Authorize
from app.api import auth, projeto, desafio, turma, aluno, grupo, doacao, ranking, catalogo, financeiro
# 1. Sincronização Automática do Banco de Dados
# Isso lê o seu models.py e cria as tabelas no PostgreSQL
try:
    Base.metadata.create_all(bind=engine)
    print("[OK] Banco de dados sincronizado com sucesso.")
except Exception as e:
    print(f"[ERRO] Erro ao sincronizar o banco: {e}")

app = FastAPI(
    title="ScanCount AI API",
    description="Backend para gestão de inventário e arrecadação via Visão Computacional",
    version="1.0.0"
)

# 2. Configuração de CORS
# Permite que o seu App mobile ou Front-end acesse a API sem bloqueios
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Registro de Rotas (Endpoints)
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

@app.get("/", tags=["Status"])
def root():
    """
    Retorna o status da API e links úteis.
    """
    return {
        "status": "online",
        "projeto": "ScanCount AI",
        "integrantes": ["Duda", "Caroliny", "Murilo", "Rafael"],
        "documentacao": "/docs"
    }

# 4. Rota de exemplo para ativar o cadeado no Swagger
@app.get("/perfil", tags=["Usuário"])
def testar_autorizacao(token: str = Depends(oauth2_scheme)):
    return {
        "message": "Parabéns! Você acessou uma rota protegida.",
        "token_recebido": token
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)