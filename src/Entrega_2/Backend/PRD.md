# Documento de Requisitos de Produto (PRD) - API Backend ScanCount AI

Este documento detalha todos os endpoints disponíveis na API do Backend do projeto ScanCount AI, separados por domínio (Módulo), indicando o arquivo responsável, a operação CRUD, o endpoint e uma prévia do payload (JSON) esperado ou retornado.

---

## 🔐 1. Autenticação e Usuários

### Arquivo: `app/api/auth.py`
Gerencia a geração de tokens de acesso para todo o sistema.

| Operação | Endpoint | Descrição |
| :--- | :--- | :--- |
| **CREATE** | `POST /auth/login` | Recebe as credenciais (OAuth2 Form) e retorna o Token JWT. |

**JSON Retornado (Preview):**
```json
{
  "access_token": "eyJhbGciOiJIUz...",
  "token_type": "bearer"
}
```

### Arquivo: `app/api/usuario.py`
Gerenciamento de contas de usuário base.

| Operação | Endpoint | Descrição |
| :--- | :--- | :--- |
| **CREATE** | `POST /usuarios/` | Registra um novo usuário no sistema. |
| **READ** | `GET /usuarios/me` | Retorna os dados do perfil logado. |
| **UPDATE** | `PATCH /usuarios/me` | Atualiza as informações do perfil. |

**JSON Retornado (Preview - GET /me):**
```json
{
  "id": 1,
  "nome": "Duda Administradora",
  "email": "professor@fecap.br"
}
```

---

## 🏢 2. Multi-Tenancy (Projetos e Desafios)

### Arquivo: `app/api/projeto.py`
Gerenciamento de Tenants (Projetos Sociais pai).

| Operação | Endpoint | Descrição |
| :--- | :--- | :--- |
| **READ** | `GET /projetos/` | Lista projetos existentes (paginado `skip`, `limit`). |
| **CREATE** | `POST /projetos/` | Cria um novo projeto/Tenant. |

**JSON Retornado (Preview - GET /projetos/):**
```json
[
  {
    "id": 1,
    "nome": "ScanCount Social",
    "descricao": "Gestão de doações",
    "ativo": true
  }
]
```

### Arquivo: `app/api/desafio.py`
Desafios são eventos (ex: semestre letivo) que ocorrem dentro de um Projeto.

| Operação | Endpoint | Descrição |
| :--- | :--- | :--- |
| **CREATE** | `POST /desafios/` | Abre um novo desafio/evento. |
| **READ** | `GET /desafios/projeto/{projeto_id}` | Lista os desafios de um projeto. |

---

## 🏫 3. Organização (Turmas e Alunos)

### Arquivo: `app/api/turma.py`

| Operação | Endpoint | Descrição |
| :--- | :--- | :--- |
| **CREATE** | `POST /turmas/` | Cria uma nova turma no desafio. |
| **READ** | `GET /turmas/desafio/{id}` | Lista todas as turmas (paginado). |
| **READ** | `GET /turmas/lista-filtros/{id}`| Lista Turmas otimizado para React Native Selects. |

**JSON Retornado (Preview - GET lista-filtros):**
```json
[
  { "label": "TADS - 1º Semestre", "value": 1 },
  { "label": "CC - 3º Semestre", "value": 2 }
]
```

### Arquivo: `app/api/aluno.py`

| Operação | Endpoint | Descrição |
| :--- | :--- | :--- |
| **CREATE** | `POST /alunos/pre-cadastro` | Prof cadastra e-mail individualmente. |
| **CREATE** | `POST /alunos/importar-planilha`| Upload massivo via arquivo CSV/XLSX. |
| **CREATE** | `POST /alunos/resgatar-convite` | Aluno usa token de e-mail para validar a conta. |
| **READ** | `GET /alunos/acompanhamento/{id}`| Lista alunos que aceitaram ou não o convite. |

---

## 👥 4. Formação de Grupos

### Arquivo: `app/api/grupo.py`
Toda a lógica de convites e gestão de equipes do desafio.

| Operação | Endpoint | Descrição |
| :--- | :--- | :--- |
| **CREATE** | `POST /grupos/criar` | Aluno cria um grupo e vira líder. |
| **CREATE** | `POST /grupos/convidar` | Líder envia convite in-app a outro aluno. |
| **READ** | `GET /grupos/alunos-disponiveis/{id}`| Lista alunos sem grupo (paginado). |
| **READ** | `GET /grupos/meus-convites` | Lista pendências de aceite (paginado). |
| **CREATE** | `POST /grupos/aceitar-convite/{id}`| Aluno entra no grupo via convite in-app. |
| **UPDATE** | `PUT /grupos/professor/alocar-manual`| Professor força um aluno num grupo. |
| **CREATE** | `POST /grupos/entrar-por-codigo` | Aluno usa código UUID para entrar no grupo. |

**JSON Retornado (Preview - Criar Grupo):**
```json
{
  "message": "Grupo criado com sucesso!",
  "grupo": {
    "id": 1,
    "nome_projeto": "Equipe Alpha",
    "codigo_convite": "A3F9B2",
    "turma_id": 2,
    "lider_id": 14
  }
}
```

---

## 📋 5. Catálogo de Produtos

### Arquivo: `app/api/catalogo.py`
Gere a taxonomia de produtos permitidos e códigos de barra (EAN-13).

| Operação | Endpoint | Descrição |
| :--- | :--- | :--- |
| **CREATE** | `POST /catalogo/item-permitido` | Prof adiciona "Arroz", "Feijão" no desafio. |
| **READ** | `GET /catalogo/itens-permitidos/{id}`| Lista o catálogo oficial. |
| **CREATE** | `POST /catalogo/clonar-itens` | Copia itens do semestre passado. |
| **DELETE** | `DELETE /catalogo/item-permitido/{id}`| Remove se não houver doações atreladas. |
| **CREATE** | `POST /catalogo/validar-e-cadastrar`| Valida código de barras pelo App, cria se inédito. |

---

## 🛒 6. Checkout de Visão Computacional (YOLO)

### Arquivo: `app/api/checkout.py`
A ponte inovadora entre o modelo YOLOv8, o front-end e o banco de dados.

| Operação | Endpoint | Descrição |
| :--- | :--- | :--- |
| **READ** | `GET /checkout/classes` | Retorna as classes exportadas no `.pt`. |
| **STREAM** | `WS /checkout/ws/{session_id}` | Socket para enviar Base64 e receber Detecções. |
| **UPDATE** | `PUT /checkout/item/{sess}/{id}` | Correção manual de falso-positivo de IA. |
| **DELETE** | `DELETE /checkout/item/{sess}/{id}`| Remove item detectado acidentalmente. |
| **CREATE** | `POST /checkout/commit/{sess_id}`| Salva os itens em memória definitivamente no Banco. |

**JSON Recebido do WebSocket (Preview):**
```json
{
  "event": "new_detection",
  "items": [
    {"id": "uuid-1234", "name": "Arroz"}
  ],
  "just_detected": [{"id": "uuid-1234", "name": "Arroz"}]
}
```

---

## 📦 7. Doações Manuais e Financeiro

### Arquivo: `app/api/doacao.py`
| Operação | Endpoint | Descrição |
| :--- | :--- | :--- |
| **CREATE** | `POST /doacoes/registrar-contagem` | Endpoint tradicional para salvar doação via Leitor EAN. |

### Arquivo: `app/api/financeiro.py`
| Operação | Endpoint | Descrição |
| :--- | :--- | :--- |
| **CREATE** | `POST /financeiro/arrecadar` | Registra depósito via PIX/Dinheiro. |
| **READ** | `GET /financeiro/saldo-grupo` | Obtém caixa atual do grupo. |
| **CREATE** | `POST /financeiro/resgatar-para-compra`| "Saca" o dinheiro convertendo-o em Doação Física. |

---

## 🏆 8. Gamificação e Ranking

### Arquivo: `app/api/ranking.py`
Motor de processamento que lê as doações e o catálogo para gerar o Ranking.

| Operação | Endpoint | Descrição |
| :--- | :--- | :--- |
| **READ** | `GET /ranking/ranking-turmas/{id}` | Top Turmas (Soma de pesos). |
| **READ** | `GET /ranking/ranking-grupos/{id}` | Top Grupos geral (Independe da turma). |
| **READ** | `GET /ranking/ranking-interno-turma/{id}`| Pódio interno de uma turma. |
| **READ** | `GET /ranking/ranking-financeiro/{id}`| Pódio unicamente baseado na arrecadação R$. |

**JSON Retornado (Preview - Todos Rankings, padrão Limit 10):**
```json
[
  {
    "grupo": "Equipe Alpha",
    "total_arrecadado_kg_l": 450.5
  },
  {
    "grupo": "Equipe Beta",
    "total_arrecadado_kg_l": 380.0
  }
]
```
