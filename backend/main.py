"""
Backend FastAPI para el Refugio de la Amistad
Maneja el registro de emails y sincronización con Brevo
"""
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import httpx
import os
from datetime import datetime
import logging

# Importar database
from database import init_db, get_db, Contacto

# Configuración de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Inicializar FastAPI
app = FastAPI(
    title="Refugio API",
    description="API para gestionar acceso a recursos del libro Cuentos para Crecer",
    version="1.0.0"
)

# Inicializar base de datos al arrancar
@app.on_event("startup")
async def startup_event():
    init_db()
    logger.info("✅ Base de datos inicializada")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica tu dominio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Variables de entorno
BREVO_API_KEY = os.getenv("BREVO_API_KEY", "")
BREVO_LIST_ID_STR = os.getenv("BREVO_LIST_ID", "2")
BREVO_LIST_ID = int(BREVO_LIST_ID_STR) if BREVO_LIST_ID_STR and BREVO_LIST_ID_STR.strip() else 2

# Modelos Pydantic
class EmailRegistration(BaseModel):
    email: EmailStr

class RegistrationResponse(BaseModel):
    success: bool
    message: str
    email: str

# ========================================
# ENDPOINTS
# ========================================

@app.get("/")
async def root():
    """Endpoint raíz para verificar que la API está funcionando"""
    return {
        "status": "online",
        "service": "Refugio API",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    """Health check para monitoreo"""
    return {
        "status": "healthy",
        "brevo_configured": bool(BREVO_API_KEY),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/contacts")
async def get_contacts(db: Session = Depends(get_db)):
    """
    Obtiene todos los contactos registrados
    """
    try:
        contactos = db.query(Contacto).order_by(Contacto.fecha_registro.desc()).all()
        
        return {
            "success": True,
            "total": len(contactos),
            "contacts": [
                {
                    "id": c.id,
                    "email": c.email,
                    "fecha_registro": c.fecha_registro.isoformat(),
                    "origen": c.origen,
                    "sincronizado_brevo": bool(c.sincronizado_brevo),
                    "ultima_sincronizacion": c.ultima_sincronizacion.isoformat() if c.ultima_sincronizacion else None
                }
                for c in contactos
            ]
        }
    except Exception as e:
        logger.error(f"❌ Error al obtener contactos: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener contactos: {str(e)}"
        )

@app.post("/register", response_model=RegistrationResponse)
async def register_email(registration: EmailRegistration, db: Session = Depends(get_db)):
    """
    Registra un email en la base de datos local y opcionalmente en Brevo
    """
    email = registration.email
    
    logger.info(f"📧 Nuevo registro: {email}")
    
    try:
        # 1. PRIMERO: Guardar en base de datos local (CRÍTICO)
        contacto = Contacto(
            email=email,
            fecha_registro=datetime.utcnow(),
            origen="QR_Libro_Refugio",
            sincronizado_brevo=0
        )
        
        try:
            db.add(contacto)
            db.commit()
            db.refresh(contacto)
            logger.info(f"✅ Email {email} guardado en base de datos local (ID: {contacto.id})")
        except IntegrityError:
            # Email ya existe, está bien
            db.rollback()
            logger.info(f"ℹ️ Email {email} ya existe en la base de datos")
            contacto = db.query(Contacto).filter(Contacto.email == email).first()
        
        # 2. DESPUÉS: Intentar sincronizar con Brevo (OPCIONAL)
        if BREVO_API_KEY:
            try:
                await send_to_brevo(email)
                
                # Marcar como sincronizado
                contacto.sincronizado_brevo = 1
                contacto.ultima_sincronizacion = datetime.utcnow()
                db.commit()
                
                logger.info(f"✅ Email {email} sincronizado con Brevo")
            except Exception as brevo_error:
                logger.warning(f"⚠️ Error al sincronizar con Brevo (no crítico): {brevo_error}")
                # No lanzamos error, continúa normal
        else:
            logger.warning("⚠️ BREVO_API_KEY no configurada. Saltando sincronización.")
        
        return RegistrationResponse(
            success=True,
            message="¡Bienvenido al Refugio de la Amistad! 🏡",
            email=email
        )
        
    except Exception as e:
        logger.error(f"❌ Error crítico al registrar {email}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al registrar el email: {str(e)}"
        )

# ========================================
# FUNCIONES AUXILIARES
# ========================================

async def send_to_brevo(email: str):
    """
    Envía el email a Brevo (SendinBlue) usando su API
    """
    if not BREVO_API_KEY:
        raise ValueError("BREVO_API_KEY no está configurada")
    
    url = "https://api.brevo.com/v3/contacts"
    
    headers = {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    
    payload = {
        "email": email,
        "listIds": [BREVO_LIST_ID],
        "updateEnabled": True,  # Actualiza si ya existe
        "attributes": {
            "FECHA_REGISTRO": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "ORIGEN": "QR_Libro_Refugio"
        }
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, headers=headers, timeout=10.0)
        
        if response.status_code not in [200, 201, 204]:
            logger.error(f"Error de Brevo: {response.status_code} - {response.text}")
            raise HTTPException(
                status_code=500,
                detail=f"Error al comunicar con Brevo: {response.status_code}"
            )
        
        return response.json()

# ========================================
# MANEJO DE ERRORES
# ========================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return {
        "success": False,
        "message": exc.detail,
        "status_code": exc.status_code
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
