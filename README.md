# AI Patient Simulation Engine (Local Desktop Architecture)

All application data and patient simulation models are stored and executed **100% locally on your machine**. No cloud services or external Docker containers are required.

The system consists of two primary parts:
1. **Python FastAPI Backend** (`backend/`): Handles clinical simulation state machines, database persistence, REST endpoints, and WebSocket connections.
2. **Tauri + React Desktop Application** (`frontend/`): Native desktop interface built with React, Vite, Tailwind CSS, and compiled using Rust + Microsoft Visual Studio C++ Build Tools.

---

## System Prerequisites

Before starting, ensure the following software is installed on your Windows machine:

| Component | Requirement | Installation Command / Link |
|---|---|---|
| **Python** | 3.10 to 3.13 | [python.org](https://www.python.org/downloads/) |
| **Node.js & npm** | Node v18+ or v20+ | `winget install OpenJS.NodeJS.LTS` |
| **PostgreSQL** | Version 16.x | `winget install PostgreSQL.PostgreSQL` |
| **Rust Toolchain** | `rustc` & `cargo` | `winget install Rustlang.Rustup` |
| **C++ Build Tools** | VS 2022 C++ Tools | Visual Studio Installer ("Desktop development with C++") |

---

## 1. Install & Set Up PostgreSQL Locally

### Option A: One-Command Installation via PowerShell (Fastest)
Open **PowerShell as Administrator** and run:
```powershell
winget install PostgreSQL.PostgreSQL
```

### Option B: Official GUI Windows Installer
1. Download PostgreSQL 16 installer from: [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. Run the installer and keep the defaults:
   - **Port**: `5432` (Default)
   - **Password**: Set a master password for the default `postgres` superuser (e.g. `postgres` or `admin123`). *Remember this password for your `.env` configuration!*
3. Finish the wizard. PostgreSQL will automatically run in the background as a Windows service.

---

## 2. Backend Setup (Python & Database)

> **Important**: All Python commands must be run from inside the `backend/` directory or with your active virtual environment. **Never run `pip install` in the `frontend/` directory.**

### Step 2.1: Navigate and Set Up Virtual Environment
Open PowerShell or Command Prompt:
```powershell
cd "f:\AI Patient Simulation Engine\Patient-Simulator\backend"

# Create virtual environment (if not already created)
python -m venv venv

# Activate virtual environment:
# On PowerShell:
.\venv\Scripts\Activate.ps1
# On Command Prompt:
.\venv\Scripts\activate.bat
```

### Step 2.2: Install Backend Dependencies
```powershell
pip install -r requirements.txt
```

### Step 2.3: Configure Environment Variables
Copy `.env.example` to `.env`:
```powershell
copy .env.example .env
```
Open `backend/.env` in VS Code or Notepad and verify:
* `POSTGRES_PASSWORD`: Must match the password you set during PostgreSQL installation (e.g. `postgres` or `admin123`).
* `DATABASE_URL`: Ensure credentials match your PostgreSQL instance (e.g. `postgresql+asyncpg://postgres:YOUR_PASSWORD@localhost:5432/ai_patient_simulation`).

### Step 2.4: Initialize and Seed the Database
Run the automated database initializer and seeder:
```powershell
python seed.py
```
This script automatically:
* Creates the `ai_patient_simulation` database.
* Configures all 5 logical schemas (`tenant`, `clinical`, `simulation`, `assessment`, `audit`).
* Seeds clinical cases, patient personas, rubrics, institutions, and test users.

### Step 2.5: Start the Backend Server
```powershell
# Using the provided PowerShell runner script:
.\run.ps1

# Or running Uvicorn directly:
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

* **Swagger API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

## 3. Frontend Setup (Tauri Desktop Application)

The frontend is a **React + Vite** app wrapped in **Tauri**, which compiles into a native Windows `.exe`.

### Step 3.1: Install Desktop Build Prerequisites

1. **Microsoft Visual Studio C++ Build Tools**:
   * Install via Visual Studio Installer.
   * Make sure **Desktop development with C++** is checked.
2. **Rust Toolchain**:
   ```powershell
   winget install Rustlang.Rustup
   ```
   *After installation, restart your terminal or refresh PATH: `$env:Path = "$HOME\.cargo\bin;$env:Path"`.*

### Step 3.2: Automated Setup (Recommended)
You can automatically check prerequisites and install packages by running the included setup script:
```powershell
cd "f:\AI Patient Simulation Engine\Patient-Simulator\frontend"
.\setup.ps1
```

### Step 3.3: Manual Installation (Alternative)
If you prefer running manual commands:
```powershell
cd "f:\AI Patient Simulation Engine\Patient-Simulator\frontend"
npm install --legacy-peer-deps
```

### Step 3.4: Launch the Desktop Application
```powershell
cd "f:\AI Patient Simulation Engine\Patient-Simulator\frontend"
npm run desktop
```
*(This will launch the Vite development server and open the standalone native desktop application window).*

### Step 3.5: Build Windows Installer / Standalone `.exe`
To compile a release Windows installer:
```powershell
npm run desktop:build
```
Compiled binaries will be generated in `frontend/src-tauri/target/release/bundle/msi/` or `nsis/`.

---

## 4. Pre-Configured Test Accounts & Scenarios

Once the database is seeded (`python seed.py`), the following credentials are ready for use:

### Test User Logins:
| Role | Email | Password |
|---|---|---|
| **Medical Student** | `student.med2026@bmcri.edu.in` | `password123` |
| **Faculty / Evaluator** | `faculty.cardio@bmcri.edu.in` | `password123` |
| **System Admin** | `admin@bmcri.edu.in` | `password123` |

### Pre-Configured Clinical Cases:
1. **Acute Anterior STEMI (Cardiology)**:
   - 58-year-old male with crushing substernal chest pain, diaphoresis, and ECG findings. Multilingual persona (Kannada & English).
2. **Acute Severe Asthma Exacerbation (Pulmonology)**:
   - 24-year-old female in respiratory distress, tripod positioning, bilateral expiratory wheeze. Multilingual persona (Hindi & English).

---

## 5. Common Troubleshooting & FAQs

### Q: Why did `pip install -r requirement.txt` fail in the `frontend` folder?
* **Answer**: The frontend is a Node.js/Tauri application, so dependencies are installed with `npm install`, not `pip`. Python's `pip` is only used inside the `backend` folder with `backend/requirements.txt`.

### Q: PowerShell error: `The term 'f:/AI' is not recognized...`
* **Answer**: When running commands or scripts in paths that contain spaces (e.g. `F:\AI Patient Simulation Engine`), PowerShell requires quotes and the call operator `&`:
  ```powershell
  & "F:\AI Patient Simulation Engine\Patient-Simulator\.venv\Scripts\python.exe" -m ...
  ```

### Q: Tauri fails to compile with "cargo not recognized"
* **Answer**: Rust is not installed or not in your current shell's PATH. Install Rust using `winget install Rustlang.Rustup`, then restart your terminal.
