from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, Float, func
from sqlalchemy.orm import relationship
from fastapi.security import OAuth2PasswordBearer
from app.core.database import Base, engine

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# --- USUÁRIO E ACESSO ---
class Usuario(Base):
    __tablename__ = "usuario"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    senha = Column(String, nullable=False)
    
    preferencia = relationship("Preferencia", back_populates="usuario", uselist=False)
    vinculos = relationship("VinculoProjeto", back_populates="usuario")
    aluno = relationship("Aluno", back_populates="usuario", uselist=False)

class Preferencia(Base):
    __tablename__ = "preferencia"
    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, ForeignKey("usuario.id"))
    tema = Column(String, default="light") # light | dark
    notificacoes_ativas = Column(Boolean, default=True)
    
    usuario = relationship("Usuario", back_populates="preferencia")

class VinculoProjeto(Base):
    __tablename__ = "vinculo_projeto"
    usuario_id = Column(Integer, ForeignKey("usuario.id"), primary_key=True)
    projeto_id = Column(Integer, ForeignKey("projeto.id"), primary_key=True)
    papel = Column(String) # PROFESSOR | ALUNO | ADM
    
    usuario = relationship("Usuario", back_populates="vinculos")
    projeto = relationship("Projeto", back_populates="vinculos")

# --- ORGANIZAÇÃO DO PROJETO ---
class Projeto(Base):
    __tablename__ = "projeto"
    id = Column(Integer, primary_key=True)
    nome = Column(String, nullable=False)
    descricao = Column(String)
    data_criacao = Column(DateTime, server_default=func.now())
    ativo = Column(Boolean, default=True)
    
    vinculos = relationship("VinculoProjeto", back_populates="projeto")
    desafios = relationship("Desafio", back_populates="projeto")

class Desafio(Base):
    __tablename__ = "desafio"
    id = Column(Integer, primary_key=True)
    projeto_id = Column(Integer, ForeignKey("projeto.id"))
    semestre = Column(String)
    data_inicio = Column(DateTime)
    data_fim = Column(DateTime)
    prazo_auto_grupo = Column(DateTime)
    min_alunos_por_grupo = Column(Integer, default=1)
    max_alunos_por_grupo = Column(Integer, default=10)
    
    projeto = relationship("Projeto", back_populates="desafios")
    turmas = relationship("Turma", back_populates="desafio")

class Turma(Base):
    __tablename__ = "turma"
    id = Column(Integer, primary_key=True)
    desafio_id = Column(Integer, ForeignKey("desafio.id"))
    nome = Column(String)
    
    desafio = relationship("Desafio", back_populates="turmas")
    alunos = relationship("Aluno", back_populates="turma")

class Grupo(Base):
    __tablename__ = "grupo"
    id = Column(Integer, primary_key=True)
    turma_id = Column(Integer, ForeignKey("turma.id"))
    lider_id = Column(Integer, ForeignKey("aluno.id"))
    nome_projeto = Column(String)
    codigo_convite = Column(String, unique=True)
    
    alunos = relationship("Aluno", foreign_keys="[Aluno.grupo_id]", back_populates="grupo")

class Aluno(Base):
    __tablename__ = "aluno"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=True) 
    email_pre_cadastro = Column(String, nullable=True)
    token_convite = Column(String, unique=True, nullable=True)
    ra = Column(String, unique=True, index=True, nullable=True)
    usuario_id = Column(Integer, ForeignKey("usuario.id"), nullable=True)
    turma_id = Column(Integer, ForeignKey("turma.id"), nullable=False)
    grupo_id = Column(Integer, ForeignKey("grupo.id"), nullable=True)
    matricula = Column(String)

    usuario = relationship("Usuario", back_populates="aluno")
    turma = relationship("Turma")
    grupo = relationship("Grupo", foreign_keys=[grupo_id], back_populates="alunos")

class ConviteGrupo(Base):
    __tablename__ = "convites_grupo"

    id = Column(Integer, primary_key=True, index=True)
    grupo_id = Column(Integer, ForeignKey("grupo.id"), nullable=False)
    aluno_id = Column(Integer, ForeignKey("aluno.id"), nullable=False)
    status = Column(String, default="pendente")
    data_envio = Column(DateTime, default=func.now())

    grupo = relationship("Grupo")
    aluno = relationship("Aluno", backref="convites_recebidos")
    
class Convite(Base):
    __tablename__ = "convite"

    id = Column(Integer, primary_key=True)
    email_pre_cadastro = Column(String, nullable=False)
    turma_id = Column(Integer, ForeignKey("turma.id"), nullable=False)
    token_convite = Column(String, nullable=False)
    utilizado = Column(Boolean, default=False)
    data_criacao = Column(DateTime, server_default=func.now())
    
# --- FINANCEIRO E DOAÇÕES ---
class ArrecadacaoDinheiro(Base):
    __tablename__ = "arrecadacao_dinheiro"
    id = Column(Integer, primary_key=True)
    aluno_id = Column(Integer, ForeignKey("aluno.id"))
    valor = Column(Float)
    origem = Column(String)
    data = Column(DateTime, server_default=func.now())

class Doacao(Base):
    __tablename__ = "doacao"
    id = Column(Integer, primary_key=True)
    aluno_id = Column(Integer, ForeignKey("aluno.id"))
    tipo_origem = Column(String) # DIRETA | COMPRA_ARRECADACAO
    data_registro = Column(DateTime, server_default=func.now())
    
    itens = relationship("ItemDoado", back_populates="doacao")

class ItemDoado(Base):
    __tablename__ = "item_doado"
    id = Column(Integer, primary_key=True)
    doacao_id = Column(Integer, ForeignKey("doacao.id"))
    codigo_barras = Column(String, ForeignKey("catalogo_produto.codigo_barras"))
    quantidade = Column(Integer)
    
    doacao = relationship("Doacao", back_populates="itens")

# --- CATÁLOGO E IA ---
class ItemPermitido(Base):
    __tablename__ = "item_permitido"
    id = Column(Integer, primary_key=True)
    desafio_id = Column(Integer, ForeignKey("desafio.id"))
    nome = Column(String)
    unidade_medida = Column(String)

    desafio = relationship("Desafio")

class CatalogoProduto(Base):
    __tablename__ = "catalogo_produto"
    codigo_barras = Column(String, primary_key=True) # EAN-13
    item_id = Column(Integer, ForeignKey("item_permitido.id"))
    cadastrado_por_aluno_id = Column(Integer, ForeignKey("aluno.id"))
    marca = Column(String)
    peso_volume = Column(Float)
    
    item_permitido = relationship("ItemPermitido")
    criador = relationship("Aluno", foreign_keys=[cadastrado_por_aluno_id])

class ReconhecimentoIA(Base):
    __tablename__ = "reconhecimento_ia"
    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, ForeignKey("usuario.id")) # ADM
    item_id = Column(Integer, ForeignKey("item_permitido.id"))
    quantidade_contada = Column(Integer)
    data_apuracao = Column(DateTime, server_default=func.now())

# Cria as tabelas associadas aos modelos se elas ainda não existirem
Base.metadata.create_all(bind=engine)
