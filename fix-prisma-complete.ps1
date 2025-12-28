# Complete Prisma Fix Script
# Run this in PowerShell: .\fix-prisma-complete.ps1

Write-Host "Stopping all Node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

Write-Host "Clearing Next.js cache..." -ForegroundColor Yellow
if (Test-Path .next) {
    Remove-Item -Recurse -Force .next
    Write-Host "✓ .next folder deleted" -ForegroundColor Green
}

Write-Host "Clearing Prisma cache..." -ForegroundColor Yellow
if (Test-Path "node_modules\.prisma") {
    Remove-Item -Recurse -Force "node_modules\.prisma"
    Write-Host "✓ Prisma cache deleted" -ForegroundColor Green
}

Write-Host "Regenerating Prisma client..." -ForegroundColor Yellow
npx prisma generate

Write-Host "Syncing database..." -ForegroundColor Yellow
npx prisma db push

Write-Host "`n✓ Done! You can now run: npm run dev" -ForegroundColor Green

