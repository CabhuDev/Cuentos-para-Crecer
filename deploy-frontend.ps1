# Deploy solo Frontend (HTML/CSS/JS)
# No requiere reiniciar Docker

Write-Host "🚀 Desplegando cambios de FRONTEND..." -ForegroundColor Cyan

# 1. Merge develop → main
Write-Host "📦 Haciendo merge develop → main..." -ForegroundColor Yellow
git checkout main
git pull origin main
git merge develop -m "Deploy: Frontend update"
git push origin main
git checkout develop

# 2. Actualizar código en VPS
Write-Host "☁️  Actualizando VPS..." -ForegroundColor Yellow
ssh root@31.97.36.248 "cd /var/www/cuentos-para-crecer && git reset --hard HEAD && git clean -fd && git pull origin main"

# 3. Sincronizar configuración de Nginx
Write-Host "⚙️  Actualizando configuración de Nginx..." -ForegroundColor Yellow
ssh root@31.97.36.248 "cp /var/www/cuentos-para-crecer/nginx/nginx.conf /etc/nginx/sites-available/elratonsinverguencilla.es && nginx -t && systemctl reload nginx"

Write-Host "✅ Frontend y Nginx actualizados en producción" -ForegroundColor Green
Write-Host "🌐 https://elratonsinverguencilla.es/cuentosparacrecer/" -ForegroundColor Blue
