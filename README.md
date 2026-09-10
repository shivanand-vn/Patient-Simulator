# AI Patient Simulation Engine (Local Desktop Architecture)

All application data and patient simulation models are stored and executed **100% locally on your machine**. No cloud services or Docker containers are required.

---

## 1. How to Install & Set Up PostgreSQL Locally on Windows

You have two easy ways to install PostgreSQL:

### Method A: One-Command Installation via Windows Terminal (Fastest)
Open **PowerShell as Administrator** and run:
```powershell
winget install PostgreSQL.PostgreSQL
```
Follow the on-screen prompt to complete the setup.

### Method B: Official GUI Windows Installer
1. Download the free PostgreSQL 16 installer from: **[https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)**
2. Run the `.exe` installer.
3. Keep default settings:
   - **Installation Directory**: Default
   - **Port**: `5432` (Default)
   - **Password**: Set a password for the default `postgres` superuser (e.g. `postgres` or `admin`).
4. Once installation finishes, PostgreSQL will run automatically in the background as a lightweight Windows service.

---

## 2. Automated Database Creation & Testing Data Seeding

We have created an automated Python script that creates the `ai_patient_simulation` database, configures all 5 logical schemas (`tenant`, `clinical`, `simulation`, `assessment`, `audit`), and seeds realistic clinical scenarios with pre-configured personas.

### Run the Seeder:
```powershell
cd "f:\AI Patient Simulation Engine\Patient Simulator\backend"
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

# Run the automated seed script
python seed.py
```

### What gets seeded automatically:
1. **Institutions & Cohorts**:
   - Bangalore Medical College & Research Institute
   - MBBS Final Year - Clinical Batch A & Emergency Medicine Residents
2. **Pre-configured Test Users**:
   - Student: `student.med2026@bmcri.edu.in` (Password: `password123`)
   - Faculty: `faculty.cardio@bmcri.edu.in` (Password: `password123`)
   - Admin: `admin@bmcri.edu.in` (Password: `password123`)
3. **Clinical Cases**:
   - **Case 1 (Cardiology)**: *Acute Anterior STEMI in a 58-Year-Old Male* (Kannada & English, crushing chest pain, diaphoresis, 12-lead ECG, Troponin, DAPT loading, Cath Lab activation).
   - **Case 2 (Pulmonology)**: *Acute Severe Asthma Exacerbation in a 24-Year-Old Female* (Hindi & English, tripod position, wheezing, Peak Flow, Nebulization, IV steroids).
4. **Scoring Rubrics & Critical Safety Rules**:
   - Competency breakdown (History, Exam, Investigations, Treatment, Diagnosis, Communication).
5. **Sample Completed Simulation Session**:
   - Pre-loaded session with 88.5% score breakdown and clinical feedback ready for UI testing.

---

## 3. Starting the Backend API

```powershell
cd "f:\AI Patient Simulation Engine\Patient Simulator\backend"
.\venv\Scripts\activate
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

* **Interactive API Documentation (Swagger)**: `http://localhost:8000/docs`
* **Health Check**: `http://localhost:8000/health`
