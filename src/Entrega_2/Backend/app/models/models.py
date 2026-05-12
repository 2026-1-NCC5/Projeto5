from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float, DateTime, Table, UniqueConstraint, event
from sqlalchemy.orm import relationship, validates
from sqlalchemy.sql import func
from app.core.database import Base
from fastapi.security import OAuth2PasswordBearer
import re
import unicodedata

def slugify(text: str) -> str:
    """Transforma 'Nome do Projeto' em 'nome-do-projeto'"""
    if not text:
        return ""
    # Remove acentos
    text = unicodedata.normalize('NFD', text)
    text = text.encode('ascii', 'ignore').decode('utf-8')
    # Lowercase e remove caracteres especiais
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    # Espaços e hifens duplicados para um único hífen
    text = re.sub(r'[-\s]+', '-', text).strip('-')
    return text

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

class Usuario(Base):
    __tablename__ = "usuario"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    sobrenome = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    celular = Column(String, nullable=True)
    senha = Column(String, nullable=False)
    avatar = Column(String, nullable=True)
    ativo = Column(Boolean, default=True)
    
    projetos = relationship("VinculoProjeto", back_populates="usuario")
    checkouts_realizados = relationship("Checkout", back_populates="adm")

class Projeto(Base):
    __tablename__ = "projeto"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    slug = Column(String, index=True)
    criador_id = Column(Integer, ForeignKey("usuario.id")) # Namespace do slug
    descricao = Column(String, nullable=True)
    imagem = Column(String, nullable=True)
    status = Column(String, nullable=False)
    display = Column(Boolean, default=True)
    data_criacao = Column(DateTime(timezone=True), server_default=func.now())
    
    # O slug é único para aquele criador
    __table_args__ = (UniqueConstraint('criador_id', 'slug', name='_usuario_projeto_slug_uc'),)

    usuarios = relationship("VinculoProjeto", back_populates="projeto")
    edicoes = relationship("Edicao", back_populates="projeto")
    criador = relationship("Usuario")

class VinculoProjeto(Base):
    __tablename__ = "vinculo_projeto"
    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuario.id"))
    projeto_id = Column(Integer, ForeignKey("projeto.id"))
    papel = Column(String) # 'adm' | 'membro'
    
    usuario = relationship("Usuario", back_populates="projetos")
    projeto = relationship("Projeto", back_populates="usuarios")

class Edicao(Base):
    __tablename__ = "edicao"
    id = Column(Integer, primary_key=True, index=True)
    projeto_id = Column(Integer, ForeignKey("projeto.id"))
    nome = Column(String)
    slug = Column(String, index=True)
    semestre = Column(String, nullable=True)
    data_inicio = Column(DateTime, nullable=True)
    data_fim = Column(DateTime, nullable=True)
    min_alunos_por_grupo = Column(Integer, default=2)
    max_alunos_por_grupo = Column(Integer, default=6)
    ativo = Column(Boolean, default=True)
    
    # O slug é único dentro do projeto
    __table_args__ = (UniqueConstraint('projeto_id', 'slug', name='_projeto_edicao_slug_uc'),)

    projeto = relationship("Projeto", back_populates="edicoes")
    turmas = relationship("Turma", back_populates="edicao")
    itens_permitidos = relationship("Catalogo", back_populates="edicao")
    checkouts = relationship("Checkout", back_populates="edicao")

class Turma(Base):
    __tablename__ = "turma"
    id = Column(Integer, primary_key=True, index=True)
    edicao_id = Column(Integer, ForeignKey("edicao.id"))
    nome = Column(String)
    slug = Column(String, index=True)
    
    # O slug é único dentro da edição
    __table_args__ = (UniqueConstraint('edicao_id', 'slug', name='_edicao_turma_slug_uc'),)

    edicao = relationship("Edicao", back_populates="turmas")
    alunos = relationship("Aluno", back_populates="turma")

class Aluno(Base):
    __tablename__ = "aluno"
    id = Column(Integer, primary_key=True, index=True)
    turma_id = Column(Integer, ForeignKey("turma.id"))
    usuario_id = Column(Integer, ForeignKey("usuario.id"), nullable=True)
    nome = Column(String)
    email = Column(String, unique=True)
    ra = Column(String, unique=True)
    
    turma = relationship("Turma", back_populates="alunos")
    grupo_id = Column(Integer, ForeignKey("grupo.id"), nullable=True)
    grupo = relationship("Grupo", back_populates="alunos")
    convites_enviados = relationship("ConviteGrupo", foreign_keys="[ConviteGrupo.criador_id]", back_populates="criador")
    convites_recebidos = relationship("ConviteGrupo", foreign_keys="[ConviteGrupo.convidado_id]", back_populates="convidado")

class Grupo(Base):
    __tablename__ = "grupo"
    id = Column(Integer, primary_key=True, index=True)
    turma_id = Column(Integer, ForeignKey("turma.id"))
    nome = Column(String)
    
    alunos = relationship("Aluno", back_populates="grupo")
    turma = relationship("Turma")
    coletas = relationship("Registro", back_populates="grupo")

class ConviteGrupo(Base):
    __tablename__ = "convite_grupo" 
    id = Column(Integer, primary_key=True, index=True)
    criador_id = Column(Integer, ForeignKey("aluno.id"))
    convidado_id = Column(Integer, ForeignKey("aluno.id"))
    grupo_id = Column(Integer, ForeignKey("grupo.id"))
    data_criacao = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="pendente") ##pendente/aceito
    
    criador = relationship("Aluno", foreign_keys=[criador_id], back_populates="convites_enviados")
    convidado = relationship("Aluno", foreign_keys=[convidado_id], back_populates="convites_recebidos")
    grupo = relationship("Grupo")

class Catalogo(Base):
    __tablename__ = "catalogo"
    id = Column(Integer, primary_key=True, index=True)
    edicao_id = Column(Integer, ForeignKey("edicao.id"))
    nome = Column(String)
    label = Column(String)
    preco = Column(Float)
    peso = Column(Float)
    largura = Column(Float)
    comprimento = Column(Float)
    
    edicao = relationship("Edicao", back_populates="itens_permitidos")
    itens = relationship("RegistroItem", back_populates="catalogo")
    checkout_itens = relationship("CheckoutItem", back_populates="catalogo")

class Registro(Base):
    __tablename__ = "registro"
    id = Column(Integer, primary_key=True, index=True)
    edicao_id = Column(Integer, ForeignKey("edicao.id"))
    grupo_id = Column(Integer, ForeignKey("grupo.id"))
    aluno_id = Column(Integer, ForeignKey("aluno.id"))
    data_hora = Column(DateTime(timezone=True), server_default=func.now())
    tipo = Column(String)
    
    edicao = relationship("Edicao")
    grupo = relationship("Grupo", back_populates="coletas")
    aluno = relationship("Aluno")
    itens = relationship("RegistroItem", back_populates="registro")
    entrada_dinheiro = relationship("RegistroDinheiro", back_populates="registro", uselist=False)
    resgate_dinheiro = relationship("ResgateDinheiro", back_populates="registro", uselist=False)

class RegistroItem(Base):
    __tablename__ = "registro_itens"
    id = Column(Integer, primary_key=True, index=True)
    registro_id = Column(Integer, ForeignKey("registro.id"))
    item_id = Column(Integer, ForeignKey("catalogo.id"))
    
    registro = relationship("Registro", back_populates="itens")
    catalogo = relationship("Catalogo", back_populates="itens")

class RegistroDinheiro(Base):
    __tablename__ = "registro_dinheiro"
    id = Column(Integer, primary_key=True, index=True)
    registro_id = Column(Integer, ForeignKey("registro.id"))
    valor = Column(Float)

    registro = relationship("Registro", back_populates="entrada_dinheiro")

class ResgateDinheiro(Base):
    __tablename__ = "resgate_dinheiro"
    id = Column(Integer, primary_key=True, index=True)
    registro_id = Column(Integer, ForeignKey("registro.id"))
    valor = Column(Float)

    registro = relationship("Registro", back_populates="resgate_dinheiro")

class Checkout(Base):
    __tablename__ = "checkout"
    id = Column(Integer, primary_key=True, index=True)
    data_criacao = Column(DateTime(timezone=True), server_default=func.now())
    edicao_id = Column(Integer, ForeignKey("edicao.id"))
    adm_id = Column(Integer, ForeignKey("usuario.id"))

    edicao = relationship("Edicao", back_populates="checkouts")
    adm = relationship("Usuario", back_populates="checkouts_realizados")
    itens = relationship("CheckoutItem", back_populates="checkout")

class CheckoutItem(Base):
    __tablename__ = "checkout_itens"
    id = Column(Integer, primary_key=True, index=True)
    checkout_id = Column(Integer, ForeignKey("checkout.id"))
    item_id = Column(Integer, ForeignKey("catalogo.id"))
    
    checkout = relationship("Checkout", back_populates="itens")
    catalogo = relationship("Catalogo", back_populates="checkout_itens")

# Listeners para gerar slugs automaticamente
def auto_slug(mapper, connection, target):
    if hasattr(target, 'nome') and target.nome:
        target.slug = slugify(target.nome)

# Registrando os eventos para cada classe que usa slug automático
for cls in [Projeto, Edicao, Turma]:
    event.listen(cls, 'before_insert', auto_slug)
    event.listen(cls, 'before_update', auto_slug)
