import uuid
import time
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models import models
from app.schemas.doacao import RegistrarContagemIn, ItemContado
from app.services.doacao_service import DoacaoService
from app.core.logger import logger

SESSION_BUFFER = {}

class CheckoutService:
    @staticmethod
    def get_or_create_session(session_id: str):
        if session_id not in SESSION_BUFFER:
            SESSION_BUFFER[session_id] = {"items": [], "last_detected": {}}
        return SESSION_BUFFER[session_id]

    @staticmethod
    def process_detected_items(session_id: str, detected_items: list):
        session = CheckoutService.get_or_create_session(session_id)
        current_time = time.time()
        new_additions = []

        for item_data in detected_items:
            item_name = item_data.get("name") if isinstance(item_data, dict) else item_data
            item_conf = item_data.get("confidence", 0.0) if isinstance(item_data, dict) else 0.0
            
            last_time = session["last_detected"].get(item_name, 0)
            
            if current_time - last_time > 3.0:
                session["last_detected"][item_name] = current_time
                new_item = {"id": str(uuid.uuid4()), "name": item_name, "confidence": item_conf}
                session["items"].append(new_item)
                new_additions.append(new_item)
                
        return session["items"], new_additions

    @staticmethod
    def delete_item(session_id: str, item_id: str):
        if session_id not in SESSION_BUFFER:
            raise HTTPException(status_code=404, detail="Session not found")
        
        items = SESSION_BUFFER[session_id]["items"]
        filtered_items = [i for i in items if i["id"] != item_id]
        
        if len(items) == len(filtered_items):
            raise HTTPException(status_code=404, detail="Item not found")
            
        SESSION_BUFFER[session_id]["items"] = filtered_items
        return filtered_items

    @staticmethod
    def update_item(session_id: str, item_id: str, new_name: str):
        if session_id not in SESSION_BUFFER:
            raise HTTPException(status_code=404, detail="Session not found")
            
        items = SESSION_BUFFER[session_id]["items"]
        for item in items:
            if item["id"] == item_id:
                item["name"] = new_name
                return items
                
        raise HTTPException(status_code=404, detail="Item not found")

    @staticmethod
    def commit_session(session_id: str, db: Session, aluno_id: int):
        if session_id not in SESSION_BUFFER:
            raise HTTPException(status_code=404, detail="Session not found")
        
        items = SESSION_BUFFER[session_id]["items"]
        if not items:
            raise HTTPException(status_code=400, detail="Buffer is empty")
            
        try:
            # Agrupar itens por nome e somar quantidades
            grouped_items = {}
            for item in items:
                name = item["name"]
                grouped_items[name] = grouped_items.get(name, 0) + 1
                
            itens_contados = []
            
            for nome_item, qtd in grouped_items.items():
                codigo_barras_gen = f"YOLO-{nome_item.upper().replace(' ', '-')}"
                
                # Verifica se o código genérico já existe no catálogo
                catalogo = db.query(models.CatalogoProduto).filter(models.CatalogoProduto.codigo_barras == codigo_barras_gen).first()
                
                if not catalogo:
                    # Se não existe no catálogo, verifica se existe o ItemPermitido
                    item_permitido = db.query(models.ItemPermitido).filter(models.ItemPermitido.nome == nome_item).first()
                    if not item_permitido:
                        # Cria ItemPermitido dummy (se não houver desafio, ficará null)
                        item_permitido = models.ItemPermitido(nome=nome_item, unidade_medida="UN")
                        db.add(item_permitido)
                        db.flush()
                        
                    # Cria CatalogoProduto dummy
                    catalogo = models.CatalogoProduto(
                        codigo_barras=codigo_barras_gen,
                        item_id=item_permitido.id,
                        marca="YOLO Generic",
                        peso_volume=1.0
                    )
                    db.add(catalogo)
                    db.flush()
                    
                itens_contados.append(ItemContado(
                    codigo_barras=codigo_barras_gen,
                    quantidade=qtd
                ))
                
            # Prepara o payload para o DoacaoService
            dados_doacao = RegistrarContagemIn(
                aluno_id=aluno_id,
                itens=itens_contados,
                tipo_origem="DIRETA"
            )
            
            # Chama o serviço real de doação
            DoacaoService.registrar_contagem(db, dados_doacao)
            
            # Limpa o buffer após o sucesso
            del SESSION_BUFFER[session_id]
            return len(items)
            
        except HTTPException as he:
            raise he
        except Exception as e:
            logger.error(f"ROLLBACK. Error: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
