"""
Configuración de la base de datos SQLite
"""
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

# Asegurar que existe el directorio data
os.makedirs("data", exist_ok=True)

# Configuración de la base de datos
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/refugio.db")

# Crear engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

# Crear sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para los modelos
Base = declarative_base()

# ========================================
# MODELO: Contacto
# ========================================
class Contacto(Base):
    __tablename__ = "contactos"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    fecha_registro = Column(DateTime, default=datetime.utcnow, nullable=False)
    origen = Column(String, default="QR_Libro", nullable=False)
    sincronizado_brevo = Column(Integer, default=0)  # 0=No, 1=Sí
    ultima_sincronizacion = Column(DateTime, nullable=True)
    
    def __repr__(self):
        return f"<Contacto(email='{self.email}', fecha='{self.fecha_registro}')>"

# Crear las tablas
def init_db():
    """Inicializar la base de datos creando todas las tablas"""
    Base.metadata.create_all(bind=engine)

# Dependencia para obtener la sesión de DB
def get_db():
    """Generador de sesión de base de datos para usar en endpoints"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
