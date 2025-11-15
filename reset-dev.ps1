# reset-dev.ps1
# Script para limpiar, reinstalar y levantar Next.js con Supabase

Write-Host "🚀 Iniciando limpieza del proyecto..."

# Ir al directorio del proyecto
Set-Location "E:\BuenosPasos\plataformahuman"

# Detener procesos Node en ejecución
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Eliminar caché y dependencias
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .turbo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

Write-Host "🧹 Limpieza completada."

# Reinstalar dependencias
Write-Host "📦 Reinstalando dependencias..."
npm install

# Actualizar paquetes clave
Write-Host "⬆️ Actualizando Next.js y Supabase..."
npm install next@latest @supabase/ssr@latest @supabase/supabase-js@latest

# Levantar servidor de desarrollo
Write-Host "🌐 Levantando servidor de desarrollo..."
npm run dev
