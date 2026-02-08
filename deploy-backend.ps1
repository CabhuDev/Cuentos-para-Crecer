# Deploy Backend (Python/FastAPI)
# Reinicia el contenedor Docker

Write-Host "🚀 Desplegando cambios de BACKEND..." -ForegroundColor Cyan

# 1. Merge develop → main
Write-Host "📦 Haciendo merge develop → main..." -ForegroundColor Yellow
git checkout main
git pull origin main
git merge develop -m "Deploy: Backend update"
git push origin main
git checkout develop

# 2. Actualizar código y reiniciar backend en VPS
Write-Host "☁️  Actualizando VPS y reiniciando contenedor..." -ForegroundColor Yellow
ssh root@31.97.36.248 "cd /var/www/cuentos-para-crecer && git reset --hard HEAD && git clean -fd && git pull origin main && docker-compose down && docker-compose up -d --build refugio-api"


# Esperar 5 segundos para que arranque completamente
Start-Sleep -Seconds 5

# Verificar health check
Write-Host "🔗 Consultando https://elratonsinverguencilla.es/api/health" -ForegroundColor Gray
$response = curl -s https://elratonsinverguencilla.es/api/health
Write-Host "✅ Respuesta: $response" -ForegroundColor Green
