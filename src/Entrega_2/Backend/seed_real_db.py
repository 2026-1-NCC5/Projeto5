import sys
import os

# Adiciona o diretório atual ao path para importar os módulos da app
sys.path.append(os.getcwd())

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models import models
from app.core.security import get_password_hash

def seed():
    db = SessionLocal()
    try:
        # 1. Busca o usuário que você criou (ajuste o username se for diferente)
        target_username = "duda"
        user = db.query(models.Usuario).filter(models.Usuario.username == target_username).first()
        
        if not user:
            print(f"ERRO: Usuário '{target_username}' não encontrado. Crie ele primeiro no site.")
            return

        print(f"Populando banco para o usuário: {user.username}")

        # 2. Criar um Projeto
        projeto = models.Projeto(
            nome="Desafio de Arrecadação 2024",
            slug="desafio-de-arrecadacao-2024",
            criador_id=user.id,
            descricao="Projeto real integrado com Visão Computacional",
            status="ativo",
            display=True
        )
        db.add(projeto)
        db.flush() # Para pegar o ID do projeto

        # 3. Criar Vínculo (O criador também é admin do projeto)
        vinculo = models.VinculoProjeto(
            usuario_id=user.id,
            projeto_id=projeto.id,
            papel="adm"
        )
        db.add(vinculo)

        # 4. Criar uma Edição
        edicao = models.Edicao(
            projeto_id=projeto.id,
            nome="1º Semestre 2024",
            slug="2024-1",
            semestre="2024.1",
            ativo=True
        )
        db.add(edicao)
        db.flush()

        # 5. Criar uma Turma
        turma = models.Turma(
            edicao_id=edicao.id,
            nome="Turma de Engenharia A",
            slug="eng-a"
        )
        db.add(turma)

        # 6. Criar o Catálogo (Os 6 itens do YOLO)
        itens = [
            {"nome": "Arroz 5kg", "label": "arroz_5kg", "preco": 25.50, "peso": 5.0},
            {"nome": "Arroz 10kg", "label": "arroz_10kg", "preco": 48.90, "peso": 10.0},
            {"nome": "Feijão 1kg", "label": "feijao", "preco": 8.50, "peso": 1.0},
            {"nome": "Macarrão 500g", "label": "macarrao", "preco": 4.20, "peso": 0.5},
            {"nome": "Fubá 1kg", "label": "fuba", "preco": 3.80, "peso": 1.0},
            {"nome": "Óleo 900ml", "label": "garrafa_de_oleo", "preco": 6.50, "peso": 0.9},
        ]

        for item_data in itens:
            item = models.Catalogo(
                edicao_id=edicao.id,
                **item_data
            )
            db.add(item)

        db.commit()
        print("\n[SUCESSO] Banco de dados populado com sucesso!")
        print(f"Acesse em: http://localhost:3000/{user.username}/desafio-2024")

    except Exception as e:
        db.rollback()
        print(f"ERRO AO POPULAR BANCO: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
