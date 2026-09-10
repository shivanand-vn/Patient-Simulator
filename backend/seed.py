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

# Local PostgreSQL connection parameters
PG_USER = os.getenv("POSTGRES_USER", "postgres")
PG_PASSWORD = os.getenv("POSTGRES_PASSWORD", "postgres") # Default local password
PG_HOST = os.getenv("POSTGRES_HOST", "localhost")
PG_PORT = int(os.getenv("POSTGRES_PORT", "5432"))
DB_NAME = os.getenv("POSTGRES_DB", "ai_patient_simulation")

async def init_and_seed_db():
    print("==================================================================")
    print("  AI Patient Simulation Engine — Automated Local DB Setup")
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
    if not INIT_SQL_PATH.exists():
        print(f"[ERROR] Could not find {INIT_SQL_PATH}")
        sys.exit(1)

    print("\nApplying database schemas, tables, and partitions from init.sql...")
    with open(INIT_SQL_PATH, "r", encoding="utf-8") as f:
        init_sql = f.read()

    try:
        await app_conn.execute(init_sql)
        print("✓ All schemas (tenant, clinical, simulation, assessment, audit) and tables created!")
    except Exception as e:
        print(f"[WARNING/NOTE] init.sql execution note: {e}")

    # 4. Execute seed_all_test_data.sql
    if not SEED_SQL_PATH.exists():
        print(f"[ERROR] Could not find {SEED_SQL_PATH}")
        sys.exit(1)

    print("\nSeeding testing datasets from seed_all_test_data.sql...")
    with open(SEED_SQL_PATH, "r", encoding="utf-8") as f:
        seed_sql = f.read()

    try:
        await app_conn.execute(seed_sql)
        print("✓ Successfully seeded:")
        print("  • Bangalore Medical College Institution & MBBS Cohorts")
        print("  • Test Users (Aditi Sharma - Student, Dr. Ramesh Kumar - Faculty, Admin)")
        print("  • Case 1: Acute Chest Pain / Anterior STEMI (58yo Male, Kannada/English)")
        print("  • Case 2: Acute Severe Asthma Exacerbation (24yo Female, Hindi/English)")
        print("  • Scoring Rubrics & Critical Error Definitions")
        print("  • Sample Completed Simulation Session & Assessment Scorecard")
    except Exception as e:
        print(f"[WARNING/NOTE] Seeding note: {e}")

    # 5. Verify counts
    cases_count = await app_conn.fetchval("SELECT COUNT(*) FROM clinical.cases")
    users_count = await app_conn.fetchval("SELECT COUNT(*) FROM tenant.users")
    sessions_count = await app_conn.fetchval("SELECT COUNT(*) FROM simulation.simulation_sessions")
    
    print("\n--- DATABASE VERIFICATION ---")
    print(f"Total Clinical Cases:     {cases_count}")
    print(f"Total Enrolled Users:     {users_count}")
    print(f"Pre-seeded Test Sessions: {sessions_count}")
    print("-----------------------------")
    print("\nDatabase is ready for local desktop simulation development!\n")

    await app_conn.close()

if __name__ == "__main__":
    asyncio.run(init_and_seed_db())
