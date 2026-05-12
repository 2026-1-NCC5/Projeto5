import sys
import os

# Adiciona o diretório atual ao path para importar os módulos da app
sys.path.append(os.getcwd())

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models import models

def seed_registros():
    db = SessionLocal()
    try:
        # 1. Busca a edição e a turma
        edicao = db.query(models.Edicao).filter(models.Edicao.nome == "1º Semestre 2024").first()
        if not edicao:
            print("ERRO: Edição '1º Semestre 2024' não encontrada. Execute o seed_real_db.py primeiro.")
            return

        turma = db.query(models.Turma).filter(models.Turma.edicao_id == edicao.id).first()
        if not turma:
            print("ERRO: Turma não encontrada.")
            return
        
        # 2. Criar um Grupo e um Aluno para os registros
        grupo = models.Grupo(nome="Grupo Águia", turma_id=turma.id)
        db.add(grupo)
        db.flush()

        aluno = models.Aluno(nome="Aluno Teste", ra="123456", turma_id=turma.id, grupo_id=grupo.id)
        db.add(aluno)
        db.flush()

        # 3. Pegar os itens do catálogo
        itens_catalogo = db.query(models.Catalogo).filter(models.Catalogo.edicao_id == edicao.id).all()
        
        print(f"Gerando registros para {len(itens_catalogo)} tipos de produtos...")

        # 4. Criar registros de doação (Meta)
        # Vamos simular que o aluno doou quantidades variadas
        quantidades_simuladas = {
            "Arroz 5kg": 10,
            "Arroz 10kg": 5,
            "Feijão 1kg": 20,
            "Macarrão 500g": 15,
            "Fubá 1kg": 8,
            "Óleo 900ml": 12
        }

        for item in itens_catalogo:
            qtd = quantidades_simuladas.get(item.nome, 5)
            
            # Cria um registro mestre para cada tipo de item para facilitar a visualização
            novo_registro = models.Registro(
                edicao_id=edicao.id,
                aluno_id=aluno.id,
                grupo_id=grupo.id,
                tipo="item"
            )
            db.add(novo_registro)
            db.flush()

            # Adiciona os itens individuais ao registro
            for _ in range(qtd):
                item_reg = models.RegistroItem(
                    registro_id=novo_registro.id,
                    item_id=item.id
                )
                db.add(item_reg)

        db.commit()
        print("\n[SUCESSO] Registros de alunos (Meta) gerados com sucesso!")
        print("Agora a sua SynthesisTable deve mostrar o progresso comparando com os Checkouts do ADM.")

    except Exception as e:
        db.rollback()
        print(f"ERRO AO GERAR SEED DE REGISTROS: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_registros()
