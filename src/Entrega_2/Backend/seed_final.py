import os
import sys

# Adiciona o diretório atual ao path para importar o app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models import models
from app.core.security import get_password_hash
from datetime import datetime, timedelta
import random

def seed_final():
    db: Session = SessionLocal()
    
    print("--- Iniciando Seed Definitivo ---")
    
    # 1. Criar Usuário Victor Rosseti
    victor = db.query(models.Usuario).filter(models.Usuario.username == "victor").first()
    if not victor:
        victor = models.Usuario(
            nome="Victor",
            sobrenome="Rosseti",
            email="victor@rosseti.com",
            username="victor",
            senha=get_password_hash("Victor123"),
            ativo=True
        )
        db.add(victor)
        db.commit()
        db.refresh(victor)
        print(f"Usuário Victor criado (ID: {victor.id})")
    else:
        print("Usuário Victor já existe.")

    # 2. Criar Projeto Lideranças Empáticas
    projeto = db.query(models.Projeto).filter(models.Projeto.nome == "Lideranças Empáticas").first()
    if not projeto:
        projeto = models.Projeto(
            nome="Lideranças Empáticas",
            slug="liderancas-empaticas",
            criador_id=victor.id,
            descricao="Projeto focado no desenvolvimento de lideranças através da arrecadação de alimentos para comunidades carentes.",
            status="ativo",
            display=True
        )
        db.add(projeto)
        db.commit()
        db.refresh(projeto)
        
        # Vincular Victor como ADM do projeto
        vinculo = models.VinculoProjeto(
            usuario_id=victor.id,
            projeto_id=projeto.id,
            papel="adm"
        )
        db.add(vinculo)
        db.commit()
        print(f"Projeto '{projeto.nome}' criado e vinculado a Victor.")
    else:
        print(f"Projeto '{projeto.nome}' já existe.")

    # 3. Criar Edição 2026-1
    edicao = db.query(models.Edicao).filter(models.Edicao.nome == "2026-1", models.Edicao.projeto_id == projeto.id).first()
    if not edicao:
        edicao = models.Edicao(
            projeto_id=projeto.id,
            nome="2026-1",
            slug="2026-1",
            semestre="1º Semestre 2026",
            data_inicio=datetime.now() - timedelta(days=30),
            data_fim=datetime.now() + timedelta(days=60),
            ativo=True
        )
        db.add(edicao)
        db.commit()
        db.refresh(edicao)
        print(f"Edição '{edicao.nome}' criada.")
    else:
        print(f"Edição '{edicao.nome}' já existe.")

    # 4. Criar Itens no Catálogo para esta Edição
    itens_catalogo = [
        {"nome": "Arroz 5kg", "label": "Arroz", "preco": 25.50, "peso": 5.0},
        {"nome": "Feijão 1kg", "label": "Feijão", "preco": 8.90, "peso": 1.0},
        {"nome": "Óleo 900ml", "label": "Óleo", "preco": 7.20, "peso": 0.9},
        {"nome": "Açúcar 1kg", "label": "Açúcar", "preco": 4.50, "peso": 1.0},
        {"nome": "Macarrão 500g", "label": "Macarrão", "preco": 3.80, "peso": 0.5},
        {"nome": "Sal 1kg", "label": "Sal", "preco": 2.20, "peso": 1.0},
    ]
    
    itens_db = []
    for item in itens_catalogo:
        it = db.query(models.Catalogo).filter(models.Catalogo.nome == item["nome"], models.Catalogo.edicao_id == edicao.id).first()
        if not it:
            it = models.Catalogo(edicao_id=edicao.id, **item)
            db.add(it)
            itens_db.append(it)
        else:
            itens_db.append(it)
    db.commit()
    print(f"{len(itens_catalogo)} itens adicionados ao catálogo.")

    # 5. Criar Turmas, Alunos e Grupos
    turmas_nomes = ["CCOMP1", "CCOMP2", "ADS51", "ADS2"]
    grupos_por_turma = [("Alfa", "Beta"), ("Gama", "Delta"), ("Epsilon", "Zeta"), ("Sigma", "Omega")]
    nomes_alunos = [
        "Ana Silva", "Beto Costa", "Carla Dias", "Davi Souza", "Eva Lima", "Fabio Vaz",
        "Gabi Rocha", "Hugo Neto", "Iara Sol", "Joao Mar", "Katia Luz", "Leo Fogo"
    ]
    
    for i, nome_t in enumerate(turmas_nomes):
        turma = db.query(models.Turma).filter(models.Turma.nome == nome_t, models.Turma.edicao_id == edicao.id).first()
        if not turma:
            turma = models.Turma(edicao_id=edicao.id, nome=nome_t, slug=nome_t.lower())
            db.add(turma)
            db.commit()
            db.refresh(turma)
            print(f"Turma {nome_t} criada.")
        
        # Criar 2 grupos para a turma
        for j, nome_g in enumerate(grupos_por_turma[i]):
            grupo = db.query(models.Grupo).filter(models.Grupo.nome == nome_g, models.Grupo.turma_id == turma.id).first()
            if not grupo:
                grupo = models.Grupo(turma_id=turma.id, nome=nome_g)
                db.add(grupo)
                db.commit()
                db.refresh(grupo)
            
            # Adicionar 3 alunos para cada grupo (6 por turma)
            alunos_grupo = []
            for k in range(3):
                idx_aluno = (j * 3) + k
                nome_a = f"{nomes_alunos[idx_aluno]} ({nome_t})"
                ra_a = f"RA{random.randint(100000, 999999)}"
                aluno = db.query(models.Aluno).filter(models.Aluno.ra == ra_a).first()
                if not aluno:
                    aluno = models.Aluno(
                        turma_id=turma.id,
                        grupo_id=grupo.id,
                        nome=nome_a,
                        email=f"{ra_a.lower()}@escola.com",
                        ra=ra_a
                    )
                    db.add(aluno)
                    alunos_grupo.append(aluno)
            db.commit()
            
            # 6. Simular Registros (5 por grupo)
            for _ in range(5):
                registro = models.Registro(
                    edicao_id=edicao.id,
                    grupo_id=grupo.id,
                    aluno_id=random.choice(alunos_grupo).id,
                    data_hora=datetime.now() - timedelta(days=random.randint(0, 20)),
                    tipo="arrecadacao"
                )
                db.add(registro)
                db.commit()
                db.refresh(registro)
                
                # Adicionar 4 itens aleatórios do catálogo por registro
                for _ in range(4):
                    item_sorteado = random.choice(itens_db)
                    reg_item = models.RegistroItem(
                        registro_id=registro.id,
                        item_id=item_sorteado.id
                    )
                    db.add(reg_item)
                
                # Adicionar um trocado em dinheiro as vezes
                if random.random() > 0.5:
                    reg_money = models.RegistroDinheiro(
                        registro_id=registro.id,
                        valor=random.uniform(5.0, 50.0)
                    )
                    db.add(reg_money)
            
            db.commit()
            print(f"Grupo {nome_g} ({nome_t}) configurado com alunos e registros.")

    print("--- Seed Finalizado com Sucesso! ---")
    print(f"Login: victor | Senha: Victor123")
    print(f"Projeto: liderancas-empaticas | Edição: 2026-1")

if __name__ == "__main__":
    seed_final()
