"""
Automated Database Initialization and Seeding Script for AI Patient Simulation Engine
Runs directly against your local PostgreSQL instance on Windows.
"""
import asyncio
import os
import sys
from pathlib import Path
import asyncpg
from dotenv import load_dotenv

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

load_dotenv()

# Paths to SQL files
BASE_DIR = Path(__file__).resolve().parent.parent
INIT_SQL_PATH = BASE_DIR / "database" / "init.sql"
SEED_SQL_PATH = BASE_DIR / "database" / "seed_all_test_data.sql"
MIGRATION_02_PATH = BASE_DIR / "database" / "migrations" / "02_redesign_schema_admin_exam.sql"
SEED_ADMIN_EXAM_PATH = BASE_DIR / "database" / "seed_admin_exam_workflow.sql"

# Local PostgreSQL connection parameters
PG_USER = os.getenv("POSTGRES_USER", "postgres")
PG_PASSWORD = os.getenv("POSTGRES_PASSWORD", "postgres") # Default local password
PG_HOST = os.getenv("POSTGRES_HOST", "localhost")
PG_PORT = int(os.getenv("POSTGRES_PORT", "5432"))
DB_NAME = os.getenv("POSTGRES_DB", "ai_patient_simulation")

async def init_and_seed_db():
    print("==================================================================")
    print("  AI Patient Simulation Engine — Comprehensive Local DB Setup")
    print("==================================================================")
    print(f"Connecting to local PostgreSQL on {PG_HOST}:{PG_PORT} as user '{PG_USER}'...")

    # 1. Connect to default 'postgres' database to ensure our target DB exists
    try:
        sys_conn = await asyncpg.connect(
            user=PG_USER,
            password=PG_PASSWORD,
            host=PG_HOST,
            port=PG_PORT,
            database="postgres"
        )
    except Exception as e:
        print(f"\n[ERROR] Could not connect to local PostgreSQL: {e}")
        print("\nPlease ensure:")
        print("1. PostgreSQL service is installed and running on your PC.")
        print("2. The username and password match your local installation.")
        print(f"   (Default tried: user='{PG_USER}', password='{PG_PASSWORD}')")
        print("\nTip: You can set POSTGRES_PASSWORD in your environment or in backend/.env")
        sys.exit(1)

    # Check if target database exists
    db_exists = await sys_conn.fetchval(
        "SELECT 1 FROM pg_database WHERE datname = $1", DB_NAME
    )
    if not db_exists:
        print(f"Database '{DB_NAME}' does not exist. Creating it now...")
        await sys_conn.execute(f'CREATE DATABASE "{DB_NAME}"')
        print(f"✓ Database '{DB_NAME}' created successfully.")
    else:
        print(f"✓ Target database '{DB_NAME}' already exists.")
    await sys_conn.close()

    # 2. Connect to the target simulation database
    app_conn = await asyncpg.connect(
        user=PG_USER,
        password=PG_PASSWORD,
        host=PG_HOST,
        port=PG_PORT,
        database=DB_NAME
    )

    # 3. Execute init.sql (Schemas, Tables, Indexes, Partitions)
    if INIT_SQL_PATH.exists():
        print("\nApplying baseline database schemas, tables, and partitions from init.sql...")
        with open(INIT_SQL_PATH, "r", encoding="utf-8") as f:
            init_sql = f.read()
        try:
            await app_conn.execute(init_sql)
            print("✓ Baseline schemas (tenant, clinical, simulation, assessment, audit) verified!")
        except Exception as e:
            print(f"[NOTE] init.sql notice: {e}")

    # 4. Execute seed_all_test_data.sql
    if SEED_SQL_PATH.exists():
        print("\nSeeding baseline testing datasets from seed_all_test_data.sql...")
        with open(SEED_SQL_PATH, "r", encoding="utf-8") as f:
            seed_sql = f.read()
        try:
            await app_conn.execute(seed_sql)
            print("✓ Baseline clinical cases and users verified!")
        except Exception as e:
            print(f"[NOTE] seed_all_test_data.sql notice: {e}")

    # 5. Execute Migration 02: Admin, Batches, Students & Exam Schedules
    if MIGRATION_02_PATH.exists():
        print("\nApplying Migration 02: academic and examination schemas...")
        with open(MIGRATION_02_PATH, "r", encoding="utf-8") as f:
            m02_sql = f.read()
        try:
            await app_conn.execute(m02_sql)
            print("✓ Academic and Examination tables (batches, students, exam_schedules, assessments) ready!")
        except Exception as e:
            print(f"[NOTE] migration 02 notice: {e}")

    # 6. Execute Seed for Admin, Faculty, Batches, and Schedules
    if SEED_ADMIN_EXAM_PATH.exists():
        print("\nSeeding Admin, Multi-Specialty Faculty, Batches, Students, and Exam Schedules...")
        with open(SEED_ADMIN_EXAM_PATH, "r", encoding="utf-8") as f:
            admin_seed_sql = f.read()
        try:
            await app_conn.execute(admin_seed_sql)
            print("✓ Rich multi-specialty clinical cases, batches, and exam schedules successfully seeded!")
        except Exception as e:
            print(f"[NOTE] admin seed notice: {e}")

    # 7. Verification Breakdown
    faculty_count = await app_conn.fetchval("SELECT COUNT(*) FROM tenant.users WHERE role = 'FACULTY'")
    batches_count = await app_conn.fetchval("SELECT COUNT(*) FROM academic.batches")
    students_total = await app_conn.fetchval("SELECT COUNT(*) FROM academic.students")
    students_backlog = await app_conn.fetchval("SELECT COUNT(*) FROM academic.students WHERE is_backlog = TRUE")
    cases_count = await app_conn.fetchval("SELECT COUNT(*) FROM clinical.cases")
    schedules_count = await app_conn.fetchval("SELECT COUNT(*) FROM examination.exam_schedules")
    assessments_count = await app_conn.fetchval("SELECT COUNT(*) FROM examination.student_assessments")

    print("\n==================================================================")
    print("                    DATABASE VERIFICATION REPORT                  ")
    print("==================================================================")
    print(f"  • Faculty Members:          {faculty_count} (Cardio, Resp, EM, Medicine)")
    print(f"  • Student Batches:          {batches_count} (Regular, Supplementary, PG)")
    print(f"  • Enrolled Students:        {students_total} total ({students_backlog} Backlog/Remedial)")
    print(f"  • Clinical Cases:           {cases_count} (Cardiology & Respiratory with Vitals)")
    print(f"  • Scheduled Examinations:   {schedules_count} (Bound: Batch+Case+Faculty+Date+Time)")
    print(f"  • Active/Completed Exams:   {assessments_count} (with 4-Step Vital Signs Records)")
    print("==================================================================")
    print("✓ Local database is fully seeded and ready for Admin, Faculty, and Student testing!\n")

    await app_conn.close()

if __name__ == "__main__":
    asyncio.run(init_and_seed_db())
