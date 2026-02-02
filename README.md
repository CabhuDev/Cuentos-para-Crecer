# 🏡 Refugio de la Amistad - Landing Page

Landing page para recursos exclusivos del libro **"Cuentos para Crecer"**.

Los lectores escanean un QR, introducen su email, y acceden a:
- 🎧 Audios de los cuentos
- 📚 PDFs descargables
- 🎨 Fichas para colorear
- 🏆 Diploma personalizado

---

## 🚀 Stack Tecnológico

**Frontend:**
- HTML5, CSS3, JavaScript vanilla
- Diseño responsive y moderno
- Canvas API para generación de diplomas

**Backend:**
- FastAPI (Python 3.11)
- SQLite (Base de datos local)
- SQLAlchemy (ORM)
- Integración opcional con Brevo (email marketing)
- API REST asíncrona

**Infraestructura:**
- Docker + Docker Compose
- Nginx como proxy reverso
- Ubuntu 24.04 VPS

---

## 📁 Estructura del Proyecto

```
refugio-amistad/
├── frontend/                 # Aplicación web estática
│   ├── index.html           # Landing page (formulario)
│   ├── refugio.html         # Página de recursos
│   └── assets/
│       ├── css/             # Estilos
│       ├── js/              # JavaScript
│       ├── img/             # Imágenes y fichas
│       ├── audio/           # Archivos de audio
│       └── pdf/             # PDFs descargables
│
├── backend/                 # API FastAPI
│   ├── main.py             # Aplicación principal
│   ├── database.py         # Configuración de SQLite y modelos
│   ├── export_contactos.py # Script de exportación
│   ├── requirements.txt    # Dependencias Python
│   ├── Dockerfile          # Imagen Docker
│   └── .env.example        # Variables de entorno
│
├── nginx/                   # Configuración del servidor
│   └── nginx.conf          # Config de Nginx
│
└── docker-compose.yml      # Orquestación de servicios
```

---

## 🧪 Pruebas Locales con Docker

### **Pre-requisitos**
- Docker Desktop instalado y corriendo
- Terminal PowerShell o CMD

### **Pasos para probar localmente:**

```powershell
# 1. Ir a la carpeta del proyecto
cd C:\Users\Pablo\Desktop\Cuentos_para_crecer\refugio-amistad

# 2. Construir y levantar los contenedores
docker-compose up -d --build

# 3. Ver logs en tiempo real (Ctrl+C para salir)
docker-compose logs -f
```

### **Verificar que funciona:**

1. **Backend API**: http://localhost:8000
2. **Documentación Swagger**: http://localhost:8000/docs
3. **Frontend**: http://localhost/cuentosparacrecer
4. **Health Check**: http://localhost:8000/health

### **Probar el flujo completo:**

```powershell
# Probar registro de email
$body = @{email="prueba@ejemplo.com"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8000/register" -Method Post -Body $body -ContentType "application/json"

# Ver contactos guardados
docker exec refugio_fastapi python -c "from database import SessionLocal, Contacto; db = SessionLocal(); contactos = db.query(Contacto).all(); [print(f'{c.id} | {c.email} | {c.fecha_registro}') for c in contactos]"
```

### **Detener el entorno:**

```powershell
# Detener contenedores
docker-compose down

# Detener y eliminar la base de datos (¡CUIDADO!)
docker-compose down -v
```

---

## 🛠️ Instalación y Configuración

### **1. Clonar o subir el proyecto al VPS**

```bash
# En tu VPS (Ubuntu 24.04)
cd /var/www/
git clone <tu-repositorio> refugio-amistad
cd refugio-amistad
```

### **2. Configurar variables de entorno**

```bash
cd backend
cp .env.example .env
nano .env
```

Edita el archivo `.env` con tus credenciales de Brevo:

```env
BREVO_API_KEY=tu_api_key_de_brevo_aqui
BREVO_LIST_ID=2
```

**¿Dónde consigo la API Key de Brevo?**
1. Inicia sesión en [Brevo](https://app.brevo.com)
2. Ve a **Settings → API Keys**
3. Crea una nueva API Key con permisos de "Contacts"
4. Copia la clave y pégala en el `.env`

**¿Dónde encuentro el ID de mi lista?**
1. En Brevo, ve a **Contacts → Lists**
2. Haz clic en tu lista
3. El ID aparece en la URL: `https://app.brevo.com/contact/list/ID`

### **3. Personalizar el dominio en Nginx**

```bash
nano nginx/nginx.conf
```

Cambia `tudominio.com` por tu dominio real:

```nginx
server_name tudominio.com www.tudominio.com;
```

### **4. Añadir tus recursos**

Coloca tus archivos en las carpetas correspondientes:

```bash
# Audios MP3
frontend/assets/audio/audio_001.mp3
frontend/assets/audio/audio_002.mp3

# PDFs
frontend/assets/pdf/guia_actividades.pdf
frontend/assets/pdf/valores.pdf

# Imágenes para colorear
frontend/assets/img/ficha_martin.png
frontend/assets/img/ficha_luli.png
frontend/assets/img/ficha_tilo.png

# Imagen hero (opcional)
frontend/assets/img/hero-martin.png
```

---

## 🐳 Despliegue con Docker

### **Opción A: Despliegue Completo (Frontend + Backend)**

```bash
# Construir y levantar todos los servicios
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Verificar que todo funciona
curl http://localhost/refugio
curl http://localhost/api/health
```

### **Opción B: Solo Backend (si ya tienes Nginx configurado)**

```bash
# Solo levantar la API
docker-compose up -d refugio-api

# La API estará en: http://localhost:8000
```

---

## 🌐 Configuración del Dominio

### **1. Apuntar el dominio al VPS**

En tu proveedor de dominios, crea estos registros DNS:

```
Tipo    Nombre    Valor
A       @         <IP de tu VPS>
A       www       <IP de tu VPS>
```

**Para elratonsinverguencilla.es:**
```
Tipo    Nombre    Valor
A       @         <tu-ip-vps>
A       www       <tu-ip-vps>
```

### **2. Configurar SSL con Let's Encrypt (HTTPS)**

```bash
# Instalar Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Obtener certificado SSL
sudo certbot --nginx -d elratonsinverguencilla.es -d www.elratonsinverguencilla.es

# Renovación automática (ya viene configurada)
sudo certbot renew --dry-run
```

Certbot modificará automáticamente el `nginx.conf` para usar HTTPS.

---

## 📝 Gestión del Proyecto

### **Comandos útiles**

```bash
# Ver estado de los contenedores
docker-compose ps

# Reiniciar servicios
docker-compose restart

# Detener todo
docker-compose down

# Ver logs en tiempo real
docker-compose logs -f refugio-api

# Actualizar solo el backend
docker-compose up -d --build refugio-api

# Entrar al contenedor para debugging
docker exec -it refugio_fastapi bash
```

### **Actualizar contenido**

Para actualizar audios, PDFs o imágenes:

```bash
# 1. Sube los nuevos archivos a frontend/assets/
scp mi_audio.mp3 root@elratonsinverguencilla.es:/var/www/refugio-amistad/frontend/assets/audio/

# 2. Si cambiaste HTML/CSS/JS, reinicia Nginx
docker-compose restart refugio-nginx
```

No es necesario reconstruir Docker si solo cambias archivos del frontend.

---

## 🧪 Pruebas Locales (Desarrollo)

### **Probar el frontend sin backend**

```bash
cd frontend
python -m http.server 8080
```

Abre: `http://localhost:8080`

### **Probar el backend**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API disponible en: `http://localhost:8000/docs` (Swagger UI)

---� Gestión de Contactos

### **Ver estadísticas**

```bash
docker exec -it refugio_fastapi python export_contactos.py
```

### **Exportar contactos a CSV/JSON**

```bash
# Entrar al contenedor
docker exec -it refugio_fastapi bash

# Ejecutar script de exportación
python export_contactos.py

# Los archivos se generan en el contenedor, cópialos al host:
# Salir del contenedor (Ctrl+D) y ejecutar:
docker cp refugio_fastapi:/app/contactos_export.csv ./
docker cp refugio_fastapi:/app/contactos_export.json ./
```

### **Acceso directo a la base de datos**

```bash
# Ver la base de datos SQLite
docker exec -it refugio_fastapi sqlite3 refugio.db

# Comandos útiles dentro de sqlite3:
.tables                    # Ver tablas
SELECT * FROM contactos;   # Ver todos los contactos
.quit                      # Salir
```

### **Backup de la base de datos**

```powershell
# Copiar base de datos del contenedor al host
docker cp refugio_fastapi:/app/data/refugio.db ./refugio_backup_$(Get-Date -Format 'yyyyMMdd').db

# Restaurar backup
docker cp refugio_backup_20260202.db refugio_fastapi:/app/data/refugio.db
docker-compose restart refugio-api
```

---

## �

## 🔧 Integración con tu Web Actual

Si ya tienes una web en el VPS, añade esto a tu `nginx.conf` existente:

```nginx
# Dentro de tu server block existente
location /refugio {
    alias /var/www/refugio-amistad/frontend;
    index index.html;
    try_files $uri $uri/ /refugio/index.html;
}

location /api/ {
    proxy_pass http://localhost:8000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

Luego reinicia Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 📊 Verificación de Funcionamiento

### **1. Verificar Backend**
```bash
curl http://tudominio.com/api/health
```

Respuesta esperada:
```json
{
  "status": "healthy",
  "brevo_configured": true,
  "timestamp": "2026-02-02T..."
}
```

### **2. Verificar Frontend**
```bash
curl http://tudominio.com/refugio
```

Debería devolver el HTML de la landing page.

### **3. Probar registro de email**
```bash
curl -X POST http://tudominio.com/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@ejemplo.com"}'
```

---

## 🎨 Personalización

### **Cambiar colores del tema**

Edita `frontend/assets/css/main.css`:

```css
:root {
  --color-primary: #4A90E2;    /* Azul principal */
  --color-secondary: #7B68EE;  /* Púrpura */
  /* ... */
}
```

### **Modificar textos**

- Landing page: `frontend/index.html`
- Página de recursos: `frontend/refugio.html`

### **Añadir más audios o fichas**

Edita `frontend/refugio.html` y duplica los bloques `.audio-card` o `.coloring-card`.

---

## 🐛 Solución de Problemas

### **Error: "BREVO_API_KEY no configurada"**
→ Verifica que creaste el archivo `.env` en `backend/`

### **Error 502 Bad Gateway**
→ El backend no está levantado. Verifica:
```bash
docker-compose logs refugio-api
```

### **Los emails no llegan a Brevo**
→ Revisa la API Key y los permisos en Brevo

### **Error CORS en el navegador**
→ Verifica que el backend acepta el origen correcto en `main.py`

---

## 📈 Próximos Pasos (Opcional)

- [ ] Configurar Google Analytics
- [ ] Añadir botón de compartir en redes sociales
- [ ] Implementar sistema de comentarios
- [ ] Crear dashboard de estadísticas de uso
- [ ] Progressive Web App (PWA) con service workers

---

## 📄 Licencia

© 2026 Cuentos para Crecer - Pablo Cabello Hurtado

---

## 🤝 Soporte

¿Problemas con el despliegue? Revisa los logs:

```bash
docker-compose logs -f
```

o contacta al desarrollador.

---

**¡Disfruta del Refugio de la Amistad! 🏡📖✨**
