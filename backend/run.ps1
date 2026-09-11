if (Test-Path ".\venv\Scripts\python.exe") {
    Write-Host "Starting backend using virtual environment (venv)..." -ForegroundColor Green
    & ".\venv\Scripts\python.exe" -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
} else {
    Write-Host "Starting backend using system Python..." -ForegroundColor Green
    python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
}
