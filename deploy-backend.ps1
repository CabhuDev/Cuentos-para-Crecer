# Deploy Backend (Python/FastAPI)
# Reinicia el contenedor Docker

Write-Host "🚀 Desplegando cambios de BACKEND..." -ForegroundColor Cyan

# Actualizar código y reiniciar backend
ssh root@31.97.36.248 "cd /var/www/cuentos-para-crecer && git pull origin main && docker-compose restart refugio-api"

Write-Host "✅ Backend actualizado y reiniciado" -ForegroundColor Green
Write-Host "🔍 Verificando salud del backend..." -ForegroundColor Yellow

# Esperar 3 segundos para que arranque
Start-Sleep -Seconds 3

# Verificar health check
$response = curl -s https://elratonsinverguencilla.es/api/health
Write-Host "Respuesta: $response" -ForegroundColor White
