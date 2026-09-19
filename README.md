# AI Patient Simulation Engine (Local Desktop Architecture)

All application data and patient simulation models are stored and executed **100% locally on your machine**. No external cloud services or Docker containers are required.

The system consists of two primary parts:
1. **Python FastAPI Backend** (`backend/`): Handles clinical simulation state machines, database persistence, REST endpoints, and WebSocket connections.
2. **Tauri + React Desktop Application** (`frontend/`): Native desktop interface built with React, Vite, Tailwind CSS, and compiled using Rust + Microsoft Visual Studio C++ Build Tools.

---

## System Workflows & Core Modules

```mermaid
flowchart LR
    Admin["Admin"] -->|Add/Manage| Faculty["Faculty Members"]
    Admin -->|Create ~59 cap| Batches["Batches & Students (w/ Backlogs)"]
    Admin -->|Manage| Cases["Clinical Cases (Doctor + Vitals)"]
    Admin -->|Schedule| Exam["Exam Schedule (Batch + Case + Faculty + Date + Time)"]
    Exam -->|Assigned To| FacView["Faculty Dashboard (Read-Only)"]
    FacView -->|Supervises| StudentExam["Student Clinical Encounter"]
    StudentExam -->|Step 1 to 7| Checklist["Predefined Assessment Order"]
    Checklist -->|Sequential 1 to 4| Vitals["Vitals: BP → Pulse → SpO2 → Temp"]
    Vitals -->|Scored & Logged| Completion["Assessment Completed & Scorecard"]
```

### 1. Admin Module
* **Faculty Management**: Admin adds faculty with **Name, Email ID, Contact Number**, and a default password. Email serves as login ID. Faculty must change password on first login.
* **Batch Management**: Admin creates and manages batches (capacity ~59 students). Supports student enrollment with **Student ID (USN), Name, Year of Joining**, and explicit **Backlog student tracking**.
* **Clinical Case Management**: Cases across medical specialties (**Cardiology, Respiratory, Emergency Medicine**), each having unique Case IDs, Doctor's Name, Patient Demographics, Chief Complaint, Target Vitals, Reference Ranges, and Predefined Assessment Sequence.
* **Exam Scheduling Engine**: Admin binds **Batch + Case + Faculty + Exam Date + Exam Time** into official exam sessions.

### 2. Faculty Module
* **Assigned Examinations**: Faculty logs in and views examinations assigned by Admin. Read-only view (Batch, Case, Date, Time, Doctor Name, Patient Name). Empty state if no exams assigned.
* **Password Management**: Faculty can securely change their password upon first login.

### 3. Student Assessment & Sequential Vital Signs
* **Structured Clinical Encounter**: Records Student ID and Case ID. Displays Patient Name, Age, Gender, Doctor's Name, and Chief Complaint.
* **Predefined Assessment Checklist**: Enforces a 7-step clinical sequence.
* **Strict 4-Step Vital Signs Order**:
  1. **Blood Pressure (BP)** *(Normal range: 90–120 / 60–80 mmHg)*
  2. **Pulse Rate** *(Normal range: 60–100 bpm)*
  3. **Oxygen Saturation ($\text{SpO}_2$)** *(Normal range: 95–100%)*
  4. **Temperature** *(Normal range: 36.5–37.5°C)*
* Evaluates recorded vitals against case targets and logs sequence completion with competency scorecards.

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
Run the comprehensive automated database initializer and seeder:
```powershell
python seed.py
```

This automated script applies:
1. Baseline Schemas (`tenant`, `clinical`, `simulation`, `assessment`, `audit`) from `init.sql`.
2. Migration 02 (`academic` and `examination` schemas, batch capacity, backlog flags, exam schedules).
3. Comprehensive test data seeding:
   * **5 Faculty Members** across Cardiology, Pulmonology, Emergency Medicine, and Internal Medicine.
   * **4 Batches** (`2026 MBBS Batch A`, `Batch B`, `2025 Supplementary / Backlog Batch`, `PG EM Residents`).
   * **18+ Enrolled Students** with USNs and explicit Backlog tracking (`BMC2025044`, `BMC2025052`, `BMC2024018`, etc.).
   * **4 Clinical Cases** with Doctor's names, patient demographics, chief complaints, target vitals, and reference ranges.
   * **5 Scheduled Examinations** binding Batch + Case + Faculty + Date + Time.
   * **Sample Completed Student Assessment** with sequential vital signs records.

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

## 3. Pre-Configured Test Credentials & Datasets

Once the database is seeded (`python seed.py`), the following credentials are ready for use:

### Test User Logins:
| Role | Email | Password | Contact Number | Notes |
|---|---|---|---|---|
| **System Admin** | `admin@bmcri.edu.in` | `password123` | `+91 98450 12345` | Full system management & scheduling |
| **Faculty (Cardiology)** | `faculty.cardio@bmcri.edu.in` | `password123` | `+91 98451 23456` | Prompts password change on 1st login |
| **Faculty (Pulmonology)**| `faculty.resp@bmcri.edu.in` | `password123` | `+91 98452 34567` | Prompts password change on 1st login |
| **Faculty (Emergency Med)**| `faculty.em@bmcri.edu.in` | `password123` | `+91 98453 45678` | Prompts password change on 1st login |
| **Faculty (Internal Med)**| `faculty.med@bmcri.edu.in` | `password123` | `+91 98454 56789` | Prompts password change on 1st login |
| **Student (Regular)** | `student.med2026@bmcri.edu.in` | `password123` | `+91 91234 56701` | Aditi Sharma (`BMC2026001`) |
| **Student (Backlog)** | `kavya.n@student.bmcri.edu.in` | `password123` | `+91 91234 56703` | Kavya Nair (`BMC2025044`) |

### Pre-Configured Clinical Cases:
1. **`CASE-CARD-001`**: *Acute Anterior STEMI (Cardiology)*
   * Patient: Ramesh Gowda, 58yo Male | Doctor: Dr. Ramesh Kumar (Cardiologist)
   * Vitals: BP 145/95 mmHg, Pulse 104 bpm, $\text{SpO}_2$ 93%, Temp 37.1°C
2. **`CASE-RESP-002`**: *Acute Severe Asthma Exacerbation (Respiratory)*
   * Patient: Pooja Nair, 24yo Female | Doctor: Dr. Sunita Rao (Pulmonologist)
   * Vitals: BP 130/82 mmHg, Pulse 118 bpm, $\text{SpO}_2$ 90%, Temp 36.8°C
3. **`CASE-CARD-003`**: *Hypertensive Crisis with Acute Pulmonary Edema (Cardiology / EM)*
   * Patient: Venkatesh Rao, 66yo Male | Doctor: Dr. Anand Kulkarni (Emergency Medicine)
   * Vitals: BP 210/120 mmHg, Pulse 110 bpm, $\text{SpO}_2$ 88%, Temp 37.0°C
4. **`CASE-RESP-004`**: *Severe Community-Acquired Pneumonia with Septic Shock (Respiratory / Critical Care)*
   * Patient: Meenakshi Sundaram, 49yo Female | Doctor: Dr. Priya Sharma (Internal Medicine)
   * Vitals: BP 88/56 mmHg, Pulse 124 bpm, $\text{SpO}_2$ 89%, Temp 39.2°C

---

## 4. Frontend Setup (Tauri Desktop Application)

The frontend is a **React + Vite** app wrapped in **Tauri**, which compiles into a native Windows `.exe`.

### Step 4.1: Install Dependencies
```powershell
cd "f:\AI Patient Simulation Engine\Patient-Simulator\frontend"
npm install --legacy-peer-deps
```

### Step 4.2: Launch the Desktop Application
```powershell
cd "f:\AI Patient Simulation Engine\Patient-Simulator\frontend"
npm run desktop
```
*(This launches the Vite development server and opens the standalone native desktop application window).*

### Step 4.3: Web-Only Preview (Alternative)
If Rust or Visual Studio C++ build tools are not yet configured on your machine, you can run the web client directly in any browser:
```powershell
cd "f:\AI Patient Simulation Engine\Patient-Simulator\frontend"
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 5. Git Branching & Contribution Policy

> **CRITICAL RULE**: Direct pushes to `main` are strictly forbidden. All updates must be developed on a dedicated feature branch and merged via Pull Request.

```powershell
# 1. Update your local main branch
git checkout main
git pull origin main

# 2. Create and switch to your feature branch
git checkout -b feat/your-feature-name

# 3. Stage and commit changes
git add .
git commit -m "feat: your concise commit message"

# 4. Push to your branch
git push -u origin feat/your-feature-name

# 5. Open a Pull Request on GitHub for peer review
```
