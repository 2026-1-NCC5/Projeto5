import pandas as pd
from sqlalchemy.orm import Session
from app.models import models
from app.services.aluno_service import AlunoService
import io

class ImportService:
    @staticmethod
    def processar_planilha_alunos(db: Session, arquivo_bytes: bytes, desafio_id: int):
        # 1. Lê o arquivo (suporta CSV ou Excel)
        try:
            df = pd.read_excel(io.BytesIO(arquivo_bytes))
        except:
            df = pd.read_csv(io.BytesIO(arquivo_bytes))

        relatorio = {"turmas_criadas": 0, "alunos_importados": 0, "erros": []}

        # 2. Segregar por Turma para garantir que a Turma exista
        turmas_unicas = df['Turma'].unique()
        
        mapa_turmas = {}
        for nome_turma in turmas_unicas:
            # Busca ou cria a turma no banco
            turma = db.query(models.Turma).filter(
                models.Turma.nome == str(nome_turma),
                models.Turma.desafio_id == desafio_id
            ).first()
            
            if not turma:
                turma = models.Turma(nome=str(nome_turma), desafio_id=desafio_id)
                db.add(turma)
                db.commit()
                db.refresh(turma)
                relatorio["turmas_criadas"] += 1
            
            mapa_turmas[nome_turma] = turma.id

        # 3. Criar os alunos e gerar os convites
        for _, linha in df.iterrows():
            try:
                # Tratamos o RA para garantir que seja string e remova o ".0" se vier do Excel
                ra_limpo = str(linha['RA']).split('.')[0] if pd.notna(linha['RA']) else None

                AlunoService.criar_pre_cadastro(
                    db=db,
                    nome=str(linha['Nome']),
                    email=str(linha['Email']),
                    turma_id=mapa_turmas[linha['Turma']],
                    ra=ra_limpo
                )
                relatorio["alunos_importados"] += 1
            except Exception as e:
                relatorio["erros"].append(f"Erro no aluno {linha['Nome']}: {str(e)}")

        return relatorio