@echo off
if exist "venv\Scripts\python.exe" (
    echo Starting backend using virtual environment (venv)...
    venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
) else if exist "..\.venv\Scripts\python.exe" (
    echo Starting backend using virtual environment (..\.venv)...
    ..\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
) else if exist ".venv\Scripts\python.exe" (
    echo Starting backend using virtual environment (.venv)...
    .venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
) else (
    echo Starting backend using system Python...
    python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
)
