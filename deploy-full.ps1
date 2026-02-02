# Deploy COMPLETO con rebuild
# Usa cuando cambies Dockerfile o requirements.txt

Write-Host "🚀 Desplegando REBUILD COMPLETO..." -ForegroundColor Cyan

# Actualizar código y rebuild completo
ssh root@31.97.36.248 "cd /var/www/cuentos-para-crecer && git pull origin main && docker-compose up -d --build"

Write-Host "✅ Aplicación reconstruida y desplegada" -ForegroundColor Green
Write-Host "⏳ Esperando que los contenedores arranquen..." -ForegroundColor Yellow

Start-Sleep -Seconds 5

Write-Host "🔍 Verificando estado de contenedores..." -ForegroundColor Yellow
ssh root@31.97.36.248 "docker ps | grep cuentos"

Write-Host "`n🌐 https://elratonsinverguencilla.es/cuentosparacrecer/" -ForegroundColor Blue
