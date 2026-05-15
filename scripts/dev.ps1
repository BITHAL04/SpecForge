# SpecForge dev bootstrap (Windows)
Write-Host "Starting SpecForge development environment..." -ForegroundColor Cyan

Set-Location (Join-Path $PSScriptRoot "..")

$python = Join-Path $PSScriptRoot "..\.venv\Scripts\python.exe"
$apiPath = Join-Path $PSScriptRoot "..\apps\api"

Write-Host "Starting backend..." -ForegroundColor Yellow
$backend = Start-Job -ScriptBlock {
	param($pythonPath, $workingDirectory)
	Set-Location $workingDirectory
	& $pythonPath -m uvicorn app.main:app --reload --port 8000
} -ArgumentList $python, $apiPath

Write-Host "Starting frontend..." -ForegroundColor Yellow
Write-Host ""
Write-Host "SpecForge is ready!" -ForegroundColor Green
Write-Host "  Backend: http://127.0.0.1:8000"
Write-Host "  Frontend: http://127.0.0.1:3000"
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Ensure .env files are set for Railway/Vercel parity"
Write-Host "  2. Use Ctrl+C in this window to stop the launcher"

try {
	Set-Location (Join-Path $PSScriptRoot "..")
	npx --yes pnpm@9 dev:web
}
finally {
	if ($backend.State -eq "Running") {
		Stop-Job $backend -ErrorAction SilentlyContinue
	}
	Remove-Job $backend -Force -ErrorAction SilentlyContinue
}
