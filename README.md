# FECAP - Fundação de Comércio Álvares Penteado

<p align="center">
<a href= "https://www.fecap.br/"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhZPrRa89Kma0ZZogxm0pi-tCn_TLKeHGVxywp-LXAFGR3B1DPouAJYHgKZGV0XTEf4AE&usqp=CAU" alt="FECAP - Fundação de Comércio Álvares Penteado" border="0"></a>
</p>

# ScanCount AI - Gerenciamento de Arrecadações

## Integrantes
* <a href="#">Duda Lucena Miguel</a>
* <a href="#">Caroliny Rossi Bittencourt</a>
* <a href="#">Murilo de Souza Vieira</a>
* <a href="#">Rafael Alves dos Santos Guimarães</a>

## Professores Orientadores
* <a href="#">Rafael Diogo Rossetti</a>
* <a href="#">Rodnil da Silva Moreira Lisboa</a>
* <a href="#">Rodrigo da Rosa</a>
* <a href="#">Marcos Minoru Nakatsugawa</a>
* <a href="#">Victor Rosetti de Quiroz</a>

## Descrição

<p align="center">
<img src="imagens/logo_projeto.png" alt="ScanCount AI" border="0">
</p>

O **ScanCount AI** é uma solução de Visão Computacional projetada para transformar a logística de arrecadações em campanhas sociais e gincanas escolares. Utilizando o modelo **YOLOv8** (You Only Look Once), o sistema realiza a detecção e contagem automática de itens em tempo real através de uma interface intuitiva, garantindo precisão e transparência nos dados coletados.

O projeto integra um backend robusto em FastAPI com um dashboard moderno em Next.js, permitindo o acompanhamento ao vivo de métricas, rankings de grupos e auditoria de coletas.

## 🛠 Estrutura de pastas

├───documentos
│   ├───Entrega 1
│   │   ├───Inteligência Artifical e Aprendizado de Máquina
│   │   ├───Projeto Interdisciplinar Inteligência Artificial
│   │   ├───Psicologia, Liderança e Soft Skills
│   │   ├───Sistemas Operacionais e Computação em Nuvem
│   │   └───Álgebra Linear, Vetores e Geometria Analítica
│   └───Entrega 2
│       ├───Disciplina 4
│       ├───Psicologia, Liderança e Softskills
│       ├───Sistemas Operacionais e Computação em Nuvem
│       └───Álgebra Linear, Vetores e Geometria Analítica
│           └───imgs
├───imagens
└───src
    ├───Entrega 1
    │   ├───Backend
    │   └───Frontend
    │       ├───dataset
    │       │   ├───images
    │       │   └───labels
    │       └───runs
    │           └───detect
    │               ├───train
    │               ├───train10
    │               ├───train11
    │               │   └───weights
    │               ├───train12
    │               │   └───weights
    │               ├───train2
    │               ├───train3
    │               ├───train4
    │               ├───train5
    │               ├───train6
    │               ├───train7
    │               ├───train8
    │               └───train9
    └───Entrega_2
        ├───Backend
        │   └───app
        │       ├───api
        │       ├───core
        │       ├───models
        │       └───schemas
        └───frontend
            ├───public
            │   └───models
            └───src
                ├───app
                │   ├───(auth)
                │   │   ├───cadastro
                │   │   └───login
                │   └───(dashboard)
                │       ├───perfil
                │       └───[username]
                │           ├───projetos
                │           │   └───novo
                │           └───[slug_projeto]
                │               ├───edicoes
                │               │   └───nova_edicao
                │               ├───informacoes_do_projeto
                │               └───[slug_edicao]
                │                   ├───(adm-feature)
                │                   │   ├───checkout
                │                   │   │   └───scanner
                │                   │   ├───informacoes
                │                   │   ├───metricas
                │                   │   │   └───ranking
                │                   │   ├───turmas
                │                   │   └───[slug_turma]
                │                   │       ├───alunos
                │                   │       └───grupos
                │                   └───(member-feature)
                │                       ├───home
                │                       └───registrar_coleta
                ├───components
                │   ├───alunosPage
                │   ├───Checkout
                │   ├───CreateTurmaCard
                │   ├───EdicaoCard
                │   ├───gruposPage
                │   ├───ImportStudentsPanel
                │   ├───memberHome
                │   ├───metricasPage
                │   ├───Navbar
                │   ├───PerfilBox
                │   ├───ProjectInfo
                │   ├───ProjetoCard
                │   ├───ResourceNotFound
                │   ├───Sidebar
                │   ├───StudentRegistrationPanel
                │   └───TurmaCard
                ├───contexts
                ├───hooks
                ├───mocks
                │   ├───data
                │   └───handlers
                ├───services
                ├───types
                └───utils

A pasta raiz contém a organização principal do projeto:

<b>documentos</b>: Toda a documentação do projeto, incluindo escopo e relatórios.

<b>imagens</b>: Ativos visuais e capturas de tela do sistema em funcionamento.

<b>src</b>: Pasta principal contendo o código-fonte dividido por fases de entrega (Entrega 1 e Entrega 2), com subpastas para o Backend (FastAPI) e Frontend (Next.js).

## 🛠 Instalação e Configuração
O projeto está dividido em duas partes principais: o **Backend** (API e IA) e o **Frontend** (Interface do Usuário).

### 1. Backend (FastAPI + YOLOv8)
Navegue até a pasta do backend para configurar o ambiente Python:

```bash
cd src/Entrega_2/Backend
# Recomendamos o uso de um ambiente virtual
python -m venv venv
./venv/Scripts/activate  # Windows
# Instalar dependências
pip install -r requirements.txt
# Iniciar o servidor
uvicorn app.main:app --reload
```
*O servidor estará disponível em: `http://localhost:8000`*

### 2. Frontend (Next.js 15)
Navegue até a pasta do frontend para instalar as dependências do Node.js:

```bash
cd src/Entrega_2/frontend
# Instalar dependências
npm install
# Iniciar o servidor de desenvolvimento
npm run dev
```
*A interface estará disponível em: `http://localhost:3000`*

## 💻 Tecnologias Utilizadas
- **Visão Computacional**: YOLOv8 (Ultralytics) via exportação ONNX.
- **Backend**: FastAPI (Python), SQLAlchemy, SQLite.
- **Frontend**: Next.js 15, React 19, TailwindCSS, Recharts.
- **IA/ML Integration**: ONNX Runtime Web para inferência eficiente no navegador.

## 📋 Licença/License
<a href="https://github.com/2026-1-NCC5/Projeto5">ScanCount-AI</a> © 2026 by <a href="https://github.com/2026-1-NCC5/Projeto5">CDMR</a> is licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a><img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="" style="max-width: 1em;max-height:1em;margin-left: .2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="" style="max-width: 1em;max-height:1em;margin-left: .2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/nc.svg" alt="" style="max-width: 1em;max-height:1em;margin-left: .2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/sa.svg" alt="" style="max-width: 1em;max-height:1em;margin-left: .2em;">

## 🎓 Referências
Aqui estão as principais referências e ferramentas utilizadas no desenvolvimento deste projeto:

1. [YOLOv8 by Ultralytics](https://ultralytics.com/yolov8)
2. [FastAPI Documentation](https://fastapi.tiangolo.com/)
3. [Next.js Documentation](https://nextjs.org/docs)
4. [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/)
5. [Recharts - Composable Charting Library](https://recharts.org/)
6. [FECAP - Fundação de Comércio Álvares Penteado](https://www.fecap.br/)
