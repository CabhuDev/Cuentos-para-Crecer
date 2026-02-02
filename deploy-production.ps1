# Script de despliegue a PRODUCCIÓN
# Hace merge de develop a main y despliega

param(
    [switch]$SkipMerge,
    [switch]$Rebuild
)

Write-Host "═══════════════════════════════════════" -ForegroundColor Magenta
Write-Host "   DESPLIEGUE A PRODUCCIÓN 🚀" -ForegroundColor Magenta
Write-Host "═══════════════════════════════════════" -ForegroundColor Magenta

# Verificar que estamos en develop
$currentBranch = git rev-parse --abbrev-ref HEAD
if ($currentBranch -ne "develop" -and !$SkipMerge) {
    Write-Host "⚠️  No estás en la rama develop. Cambiando..." -ForegroundColor Yellow
    git checkout develop
}

# Verificar que no haya cambios sin commitear
$status = git status --porcelain
if ($status -and !$SkipMerge) {
    Write-Host "❌ Hay cambios sin commitear:" -ForegroundColor Red
    Write-Host $status
    Write-Host "`nCommitea los cambios primero:" -ForegroundColor Yellow
    Write-Host "  git add ." -ForegroundColor Cyan
    Write-Host "  git commit -m 'Descripción'" -ForegroundColor Cyan
    exit 1
}

if (!$SkipMerge) {
    # Push develop
    Write-Host "`n📤 Subiendo cambios de develop..." -ForegroundColor Cyan
    git push origin develop
    
    # Cambiar a main
    Write-Host "🔀 Cambiando a rama main..." -ForegroundColor Cyan
    git checkout main
    
    # Merge develop a main
    Write-Host "🔗 Haciendo merge de develop a main..." -ForegroundColor Cyan
    git merge develop -m "Merge develop to main for production deployment"
    
    # Push main
    Write-Host "📤 Subiendo main a GitHub..." -ForegroundColor Cyan
    git push origin main
    
    # Volver a develop
    git checkout develop
}

# Desplegar en VPS
Write-Host "`n🚀 Desplegando en VPS..." -ForegroundColor Cyan

if ($Rebuild) {
    Write-Host "🔨 Rebuild completo activado..." -ForegroundColor Yellow
    ssh root@31.97.36.248 "cd /var/www/cuentos-para-crecer && git pull origin main && docker-compose up -d --build"
} else {
    Write-Host "♻️  Restart rápido..." -ForegroundColor Yellow
    ssh root@31.97.36.248 "cd /var/www/cuentos-para-crecer && git pull origin main && docker-compose restart"
}

Write-Host "`n✅ ¡DESPLIEGUE COMPLETADO!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════" -ForegroundColor Magenta
Write-Host "🌐 https://elratonsinverguencilla.es/cuentosparacrecer/" -ForegroundColor Blue
Write-Host "═══════════════════════════════════════" -ForegroundColor Magenta

Write-Host "`n📋 Verificando salud del backend..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
curl -s https://elratonsinverguencilla.es/api/health
