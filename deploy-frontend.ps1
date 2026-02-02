# Deploy solo Frontend (HTML/CSS/JS)
# No requiere reiniciar Docker

Write-Host "🚀 Desplegando cambios de FRONTEND..." -ForegroundColor Cyan

# Actualizar código en VPS
ssh root@31.97.36.248 "cd /var/www/cuentos-para-crecer && git pull origin main"

Write-Host "✅ Frontend actualizado en producción" -ForegroundColor Green
Write-Host "🌐 https://elratonsinverguencilla.es/cuentosparacrecer/" -ForegroundColor Blue
