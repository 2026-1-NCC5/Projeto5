# ScanCount AI - API Completa

Esta documentação detalha todos os endpoints disponíveis no sistema, organizados por módulos e hierarquia.

---

## 🔐 1. Autenticação e Usuários

### Login
`POST /api/auth/login` (OAuth2 Form Data)
**Resposta:**
```json
{
  "access_token": "token_string",
  "token_type": "bearer"
}
```

### Criar Usuário
`POST /api/usuarios/`
**Request:**
```json
{
  "nome": "João",
  "sobrenome": "Silva",
  "email": "joao@email.com",
  "username": "joao123",
  "celular": "11999998888",
  "senha": "password"
}
```

### Meu Perfil
`GET /api/usuarios/me`
`PUT /api/usuarios/me` (Edição)
`DELETE /api/usuarios/me` (Exclusão)

---

## 📁 2. Projetos
`/{username}/projetos`

### Listar/Criar Projetos
`GET /api/{username}/projetos`
`POST /api/{username}/projetos`
**Response (ProjetoOut):**
```json
{
  "id": 1,
  "nome": "Gincana 2024",
  "slug": "gincana-2024",
  "descricao": "string",
  "imagem": "string",
  "status": "ativo",
  "display": true,
  "data_criacao": "2024-05-11T20:00:00Z",
  "papel": "adm"
}
```

---

## 👥 3. Gestão de Membros (Vínculos)
`/{username}/projetos/{slugProjeto}/usuarios`

### Listar Membros do Projeto
`GET /api/{username}/projetos/{slugProjeto}/usuarios/`
**Response:**
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "papel": "adm"
  }
]
```

### Adicionar/Editar/Remover Membro
`POST /api/{username}/projetos/{slugProjeto}/usuarios/` (usuario_id, papel)
`PUT /api/{username}/projetos/{slugProjeto}/usuarios/{usuario_id}` (novo_papel)
`DELETE /api/{username}/projetos/{slugProjeto}/usuarios/{usuario_id}`

---

## 🏆 4. Edições (Desafios)
`/{username}/{slugProjeto}/edicoes`

### CRUD de Edições
`GET /api/{username}/{slugProjeto}/edicoes/`
`POST /api/{username}/{slugProjeto}/edicoes/`
`PUT /api/{username}/{slugProjeto}/edicoes/{slugEdicao}`
`DELETE /api/{username}/{slugProjeto}/edicoes/{slugEdicao}`

---

## 🏫 5. Acadêmico (Turmas, Alunos, Grupos)
`/{username}/{slugProjeto}/{slugEdicao}/`

### Turmas
`GET/POST /api/.../turmas/`
`PUT/DELETE /api/.../turmas/{slugTurma}`

### Alunos
`GET /api/.../alunos/`
`POST /api/.../alunos/vincular-usuario` (aluno_id)

### Grupos
`GET /api/.../grupos/`
`POST /api/.../grupos/` (Criar Grupo)
**Exemplo Resposta Grupo:**
```json
{
  "id": 1,
  "nome": "Grupo Alpha",
  "turma_id": 5,
  "alunos": [
    { "id": 10, "nome": "Aluno A", "email": "a@a.com" }
  ]
}
```

---

## 📦 6. Catálogo de Itens
`/{username}/{slugProjeto}/{slugEdicao}/catalogo`

### CRUD de Itens
`GET /api/.../catalogo/`
`POST /api/.../catalogo/`
`PUT/DELETE /api/.../catalogo/{item_id}`
**Request/Response:**
```json
{
  "nome": "Garrafa PET",
  "label": "Plástico",
  "preco": 0.50,
  "peso": 0.10,
  "id": 1,
  "edicao_id": 1
}
```

---

## ⚖️ 7. Registros de Pesagem (Alunos)
`/{username}/{slugProjeto}/{slugEdicao}/registro`

### Criar Registro (Pesagem)
`POST /api/.../registro/`
**Request:**
```json
{
  "tipo": "item",
  "grupo_id": 1,
  "aluno_id": 5,
  "itens_ids": [1, 1, 2] 
}
```

### Listar Registros (Resposta Unificada)
`GET /api/.../registro/`
**Response:**
```json
{
  "total_itens": 150,
  "total_valor_itens": 75.0,
  "total_peso": 15.5,
  "registros": [...],
  "resumo_por_item": [
    { "item_id": 1, "nome": "PET", "quantidade": 50, "subtotal_valor": 25.0 }
  ]
}
```

---

## 🔍 8. Checkout (Conferência ADM)
`/{username}/{slugProjeto}/{slugEdicao}/checkout`

### Criar Checkout
`POST /api/.../checkout/`
**Response Detalhado:**
```json
{
  "id": 10,
  "data_criacao": "2026-05-11T23:16:22.526Z",
  "adm_id": 1,
  "edicao_id": 5,
  "itens_resumo": [
    {
      "item": { "nome": "Papelão", "preco": 0.20, "id": 5 },
      "quantidade": 10,
      "valor_subtotal": 2.0,
      "peso_subtotal": 5.0
    }
  ],
  "total_itens": 10,
  "total_valor": 2.0,
  "total_peso": 5.0
}
```

---

## 📊 9. Analytics e Ranking

### Ranking de Grupos/Turmas
`GET /api/.../ranking/grupos?sort_by=kg`
`GET /api/.../ranking/turmas?sort_by=money`

### Dashboard de Métricas
`GET /api/.../metricas/dashboard?turma_ids=1,2&data_inicio=2024-01-01`
**Response:**
```json
{
  "resumo": {
    "total_kg": 500.0,
    "total_dinheiro": 250.0,
    "total_alunos": 80,
    "media_kg_aluno": 6.25
  },
  "distribuicao": [
    { "item_nome": "Plástico", "quantidade_kg": 200, "porcentagem": 40.0 }
  ],
  "evolucao": [
    { "data": "2024-05-10", "kg": 50.0, "dinheiro": 25.0 }
  ],
  "turmas_disponiveis": [
    { "id": 1, "nome": "9º Ano A" }
  ]
}
```
