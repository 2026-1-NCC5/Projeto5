# ScanCount AI - Gerenciamento de Arrecadações com Visão Computacional

## 🚀 Como Iniciar o Projeto

Para rodar a aplicação completa, você precisará de dois terminais abertos:

### 1. Backend (FastAPI + SQLite)
Navegue até a pasta `Backend` e execute os comandos abaixo:
```bash
cd Backend
# Instalar dependências (caso necessário)
pip install -r requirements.txt

# Iniciar o servidor
uvicorn app.main:app --reload
```
*O backend estará rodando em: `http://localhost:8000`*

### 2. Frontend (Next.js 14)
Navegue até a pasta `frontend` e execute:
```bash
cd frontend
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```
*O frontend estará rodando em: `http://localhost:3000`*

---

## 🔐 Acesso para Testes (Seed Definitivo)

Para avaliar todas as funcionalidades com dados reais, utilize as credenciais abaixo:

- **Username:** `victor`
- **Senha:** `Victor123`

### 🎯 Link Direto para o Scanner (IA)
Após fazer o login, você pode acessar diretamente o módulo de visão computacional para testar a detecção de itens:
👉 [Testar Scanner de IA](http://localhost:3000/victor/liderancas-empaticas/2026-1/checkout)

---

## 🛠️ Funcionalidades Implementadas

- **Visão Computacional**: Detecção em tempo real de itens do catálogo via webcam.
- **Dashboards Dinâmicos**: Rankings de turmas, grupos e evolução diária de arrecadação.
- **Tabela de Síntese**: Comparativo automático entre o que os alunos declararam e o que foi conferido pela IA.
- **Gestão de Projetos**: Controle total sobre edições, turmas e alunos.

---
*Desenvolvido para o projeto de Lideranças Empáticas.*
