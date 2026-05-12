import sys
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models import models

def seed_catalogo(username: str, slug_projeto: str, slug_edicao: str):
    db = SessionLocal()
    try:
        # 1. Busca a edição para vincular os itens
        edicao = db.query(models.Edicao).join(models.Projeto).join(models.Usuario).filter(
            models.Usuario.username == username,
            models.Projeto.slug == slug_projeto,
            models.Edicao.slug == slug_edicao
        ).first()

        if not edicao:
            print(f"Erro: Edição '{slug_edicao}' não encontrada para o projeto '{slug_projeto}' do usuário '{username}'.")
            return

        # 2. Definição dos itens (Baseado na sua solicitação)
        itens = [
            {"nome": "Arroz 5kg", "peso_referencia": 5.0, "pontos_por_unidade": 50, "categoria": "Alimento"},
            {"nome": "Arroz 10kg", "peso_referencia": 10.0, "pontos_por_unidade": 100, "categoria": "Alimento"},
            {"nome": "Feijão 1kg", "peso_referencia": 1.0, "pontos_por_unidade": 15, "categoria": "Alimento"},
            {"nome": "Macarrão 500g", "peso_referencia": 0.5, "pontos_por_unidade": 10, "categoria": "Alimento"},
            {"nome": "Fubá 1kg", "peso_referencia": 1.0, "pontos_por_unidade": 10, "categoria": "Alimento"},
            {"nome": "Açúcar 1kg", "peso_referencia": 1.0, "pontos_por_unidade": 12, "categoria": "Alimento"},
            {"nome": "Óleo 900ml", "peso_referencia": 0.9, "pontos_por_unidade": 20, "categoria": "Alimento"},
        ]

        # 3. Inserção
        print(f"Alimentando catálogo para a edição: {edicao.nome}...")
        for item_data in itens:
            # Verifica se já existe um item com o mesmo nome nesta edição para evitar duplicidade
            existente = db.query(models.Catalogo).filter(
                models.Catalogo.edicao_id == edicao.id,
                models.Catalogo.nome == item_data["nome"]
            ).first()
            
            if not existente:
                novo_item = models.Catalogo(**item_data, edicao_id=edicao.id)
                db.add(novo_item)
                print(f"  [+] Item adicionado: {item_data['nome']}")
            else:
                print(f"  [!] Item já existe: {item_data['nome']}")

        db.commit()
        print("\nSincronização concluída com sucesso! ✅")

    except Exception as e:
        print(f"Erro ao popular catálogo: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Uso: python seed_catalogo.py <username> <slug_projeto> <slug_edicao>")
    else:
        seed_catalogo(sys.argv[1], sys.argv[2], sys.argv[3])
