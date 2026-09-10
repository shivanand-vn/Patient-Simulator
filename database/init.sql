-- =============================================================================
-- PostgreSQL 16+ Production DDL Schema for AI Patient Simulation Engine
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "btree_gist";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. Create Logical Schemas
CREATE SCHEMA IF NOT EXISTS tenant;
CREATE SCHEMA IF NOT EXISTS clinical;
CREATE SCHEMA IF NOT EXISTS simulation;
CREATE SCHEMA IF NOT EXISTS assessment;
CREATE SCHEMA IF NOT EXISTS audit;

-- =============================================================================
-- SCHEMA: tenant (Multi-Tenancy & Access Control)
-- =============================================================================

DO $$ BEGIN
    CREATE TYPE tenant.user_role AS ENUM (
        'STUDENT', 
        'FACULTY', 
        'INSTITUTION_ADMIN', 
        'CLINICAL_AUTHOR', 
        'SYSTEM_ADMIN'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS tenant.institutions (
    institution_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_code    citext UNIQUE NOT NULL,
    institution_name    VARCHAR(255) NOT NULL,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    settings            JSONB NOT NULL DEFAULT '{}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE IF NOT EXISTS tenant.users (
    user_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id      UUID NOT NULL REFERENCES tenant.institutions(institution_id) ON DELETE RESTRICT,
    email               citext NOT NULL,
    full_name           VARCHAR(255) NOT NULL,
    role                tenant.user_role NOT NULL,
    password_hash       VARCHAR(255) NOT NULL,
    preferred_language  VARCHAR(10) NOT NULL DEFAULT 'en',
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    CONSTRAINT uq_tenant_user_email UNIQUE (institution_id, email)
);

CREATE TABLE IF NOT EXISTS tenant.cohorts (
    cohort_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id      UUID NOT NULL REFERENCES tenant.institutions(institution_id) ON DELETE CASCADE,
    cohort_name         VARCHAR(150) NOT NULL,
    academic_year       VARCHAR(20) NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE IF NOT EXISTS tenant.cohort_enrollments (
    cohort_id           UUID NOT NULL REFERENCES tenant.cohorts(cohort_id) ON DELETE CASCADE,
    student_id          UUID NOT NULL REFERENCES tenant.users(user_id) ON DELETE CASCADE,
    enrolled_at         TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    PRIMARY KEY (cohort_id, student_id)
);

-- =============================================================================
-- SCHEMA: clinical (Clinical Truth, Personas, Scenarios - Version-Controlled)
-- =============================================================================

DO $$ BEGIN
    CREATE TYPE clinical.case_status AS ENUM ('DRAFT', 'UNDER_REVIEW', 'PUBLISHED', 'ARCHIVED');
    CREATE TYPE clinical.difficulty_level AS ENUM ('NOVICE', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS clinical.cases (
    case_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id      UUID REFERENCES tenant.institutions(institution_id) ON DELETE SET NULL, -- NULL = Global Library
    case_code           citext UNIQUE NOT NULL,
    title               VARCHAR(255) NOT NULL,
    medical_specialty   VARCHAR(100) NOT NULL,
    difficulty          clinical.difficulty_level NOT NULL DEFAULT 'INTERMEDIATE',
    created_by          UUID REFERENCES tenant.users(user_id),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE IF NOT EXISTS clinical.case_versions (
    case_version_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id             UUID NOT NULL REFERENCES clinical.cases(case_id) ON DELETE RESTRICT,
    version_number      INTEGER NOT NULL,
    status              clinical.case_status NOT NULL DEFAULT 'DRAFT',
    clinical_summary    TEXT NOT NULL,
    supported_languages TEXT[] NOT NULL DEFAULT ARRAY['en', 'hi', 'kn'],
    is_locked           BOOLEAN NOT NULL DEFAULT FALSE,
    published_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    CONSTRAINT uq_case_version UNIQUE (case_id, version_number)
);

CREATE TABLE IF NOT EXISTS clinical.patient_personas (
    persona_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_version_id     UUID UNIQUE NOT NULL REFERENCES clinical.case_versions(case_version_id) ON DELETE CASCADE,
    patient_name        VARCHAR(150) NOT NULL,
    age                 SMALLINT NOT NULL CHECK (age >= 0 AND age <= 130),
    biological_sex      VARCHAR(20) NOT NULL CHECK (biological_sex IN ('MALE', 'FEMALE', 'OTHER')),
    emotional_baseline  VARCHAR(50) NOT NULL DEFAULT 'ANXIOUS',
    communication_style VARCHAR(50) NOT NULL DEFAULT 'ARTICULATE',
    pain_level_baseline SMALLINT NOT NULL DEFAULT 0 CHECK (pain_level_baseline BETWEEN 0 AND 10),
    voice_config        JSONB NOT NULL DEFAULT '{"pitch": 1.0, "speed": 1.0, "accent": "indian_english"}',
    persona_rules       JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS clinical.clinical_truth_models (
    truth_model_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_version_id     UUID UNIQUE NOT NULL REFERENCES clinical.case_versions(case_version_id) ON DELETE CASCADE,
    chief_complaint     TEXT NOT NULL,
    history_presenting  TEXT NOT NULL,
    past_medical_hist   JSONB NOT NULL DEFAULT '[]',
    current_medications JSONB NOT NULL DEFAULT '[]',
    allergies           JSONB NOT NULL DEFAULT '[]',
    family_social_hist  JSONB NOT NULL DEFAULT '{}',
    primary_diagnosis   VARCHAR(255) NOT NULL,
    differential_diag   TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    hidden_diagnoses    TEXT[] NOT NULL,
    baseline_vitals     JSONB NOT NULL,
    examination_catalog JSONB NOT NULL,
    investigations_db   JSONB NOT NULL,
    treatment_protocols JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS clinical.scenario_states (
    state_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_version_id     UUID NOT NULL REFERENCES clinical.case_versions(case_version_id) ON DELETE CASCADE,
    state_name          VARCHAR(50) NOT NULL,
    vitals_override     JSONB,
    transition_rules    JSONB NOT NULL,
    CONSTRAINT uq_case_version_state UNIQUE (case_version_id, state_name)
);

-- =============================================================================
-- SCHEMA: simulation (High-Throughput Runtime Engine)
-- =============================================================================

DO $$ BEGIN
    CREATE TYPE simulation.session_status AS ENUM (
        'READY', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ABORTED', 'TIMED_OUT'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS simulation.simulation_sessions (
    session_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id      UUID NOT NULL REFERENCES tenant.institutions(institution_id) ON DELETE RESTRICT,
    student_id          UUID NOT NULL REFERENCES tenant.users(user_id) ON DELETE RESTRICT,
    case_version_id     UUID NOT NULL REFERENCES clinical.case_versions(case_version_id) ON DELETE RESTRICT,
    session_status      simulation.session_status NOT NULL DEFAULT 'READY',
    current_state_id    UUID REFERENCES clinical.scenario_states(state_id),
    primary_language    VARCHAR(10) NOT NULL DEFAULT 'en',
    start_time          TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    end_time            TIMESTAMPTZ,
    final_score         NUMERIC(5, 2),
    session_metadata    JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS simulation.conversation_turns (
    turn_id             UUID DEFAULT gen_random_uuid(),
    session_id          UUID NOT NULL,
    turn_index          INTEGER NOT NULL,
    speaker             VARCHAR(20) NOT NULL CHECK (speaker IN ('STUDENT', 'PATIENT', 'SYSTEM')),
    language_code       VARCHAR(10) NOT NULL DEFAULT 'en',
    transcript          TEXT NOT NULL,
    audio_file_uri      TEXT,
    sentiment_detected  VARCHAR(50),
    llm_tokens_consumed INTEGER DEFAULT 0,
    orchestrator_latency_ms INTEGER DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    PRIMARY KEY (turn_id, created_at)
) PARTITION BY RANGE (created_at);

CREATE TABLE IF NOT EXISTS simulation.session_vitals_log (
    vitals_log_id       UUID DEFAULT gen_random_uuid(),
    session_id          UUID NOT NULL,
    recorded_at         TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    heart_rate          SMALLINT CHECK (heart_rate BETWEEN 20 AND 300),
    bp_systolic         SMALLINT CHECK (bp_systolic BETWEEN 40 AND 300),
    bp_diastolic        SMALLINT CHECK (bp_diastolic BETWEEN 20 AND 200),
    spo2_percent        SMALLINT CHECK (spo2_percent BETWEEN 40 AND 100),
    respiratory_rate    SMALLINT CHECK (respiratory_rate BETWEEN 4 AND 80),
    temperature_c       NUMERIC(4, 2) CHECK (temperature_c BETWEEN 30.0 AND 45.0),
    pain_score          SMALLINT CHECK (pain_score BETWEEN 0 AND 10),
    dynamic_payload     JSONB NOT NULL DEFAULT '{}',
    PRIMARY KEY (vitals_log_id, recorded_at)
) PARTITION BY RANGE (recorded_at);

CREATE TABLE IF NOT EXISTS simulation.session_actions (
    action_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id          UUID NOT NULL REFERENCES simulation.simulation_sessions(session_id) ON DELETE CASCADE,
    action_type         VARCHAR(30) NOT NULL CHECK (action_type IN ('EXAMINATION', 'INVESTIGATION', 'TREATMENT', 'DIAGNOSIS_SUBMIT')),
    action_identifier   VARCHAR(100) NOT NULL,
    details             JSONB NOT NULL DEFAULT '{}',
    result_presented    JSONB NOT NULL DEFAULT '{}',
    is_critical_error   BOOLEAN NOT NULL DEFAULT FALSE,
    action_timestamp    TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE IF NOT EXISTS simulation.session_state_transitions (
    transition_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id          UUID NOT NULL REFERENCES simulation.simulation_sessions(session_id) ON DELETE CASCADE,
    from_state_id       UUID REFERENCES clinical.scenario_states(state_id),
    to_state_id         UUID NOT NULL REFERENCES clinical.scenario_states(state_id),
    trigger_type        VARCHAR(50) NOT NULL,
    trigger_details     JSONB NOT NULL DEFAULT '{}',
    transitioned_at     TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

-- =============================================================================
-- SCHEMA: assessment (Competency Scoring & Faculty Feedback Engine)
-- =============================================================================

CREATE TABLE IF NOT EXISTS assessment.scoring_rubrics (
    rubric_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_version_id     UUID UNIQUE NOT NULL REFERENCES clinical.case_versions(case_version_id) ON DELETE CASCADE,
    weight_history      NUMERIC(4, 2) NOT NULL DEFAULT 20.00,
    weight_examination  NUMERIC(4, 2) NOT NULL DEFAULT 15.00,
    weight_investigation NUMERIC(4,2) NOT NULL DEFAULT 15.00,
    weight_treatment    NUMERIC(4, 2) NOT NULL DEFAULT 20.00,
    weight_diagnosis    NUMERIC(4, 2) NOT NULL DEFAULT 20.00,
    weight_communication NUMERIC(4, 2) NOT NULL DEFAULT 10.00,
    critical_errors_def JSONB NOT NULL DEFAULT '[]',
    ideal_pathway       JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS assessment.session_evaluations (
    evaluation_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id          UUID UNIQUE NOT NULL REFERENCES simulation.simulation_sessions(session_id) ON DELETE CASCADE,
    evaluator_user_id   UUID REFERENCES tenant.users(user_id),
    total_score         NUMERIC(5, 2) NOT NULL CHECK (total_score BETWEEN 0.00 AND 100.00),
    is_passed           BOOLEAN NOT NULL DEFAULT FALSE,
    score_breakdown     JSONB NOT NULL,
    critical_errors_hit JSONB NOT NULL DEFAULT '[]',
    strengths           TEXT[] DEFAULT ARRAY[]::TEXT[],
    areas_for_growth    TEXT[] DEFAULT ARRAY[]::TEXT[],
    faculty_comments    TEXT,
    completed_at        TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

-- =============================================================================
-- SCHEMA: audit (Security, Tamper-Evident Logs)
-- =============================================================================

CREATE TABLE IF NOT EXISTS audit.security_audit_logs (
    audit_id            UUID DEFAULT gen_random_uuid(),
    institution_id      UUID,
    user_id             UUID,
    event_category      VARCHAR(50) NOT NULL,
    event_action        VARCHAR(100) NOT NULL,
    ip_address          INET,
    user_agent          TEXT,
    payload_before      JSONB,
    payload_after       JSONB,
    event_timestamp     TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    PRIMARY KEY (audit_id, event_timestamp)
) PARTITION BY RANGE (event_timestamp);

-- =============================================================================
-- Baseline Partitions (Initial 2026 Monthly Buckets)
-- =============================================================================

CREATE TABLE IF NOT EXISTS simulation.conversation_turns_default PARTITION OF simulation.conversation_turns DEFAULT;
CREATE TABLE IF NOT EXISTS simulation.session_vitals_log_default PARTITION OF simulation.session_vitals_log DEFAULT;
CREATE TABLE IF NOT EXISTS audit.security_audit_logs_default PARTITION OF audit.security_audit_logs DEFAULT;

-- =============================================================================
-- Performance Indexes
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_conversation_turns_session_seq 
ON simulation.conversation_turns (session_id, turn_index ASC);

CREATE INDEX IF NOT EXISTS idx_simulation_sessions_student_status 
ON simulation.simulation_sessions (student_id, session_status, start_time DESC);

CREATE INDEX IF NOT EXISTS idx_simulation_sessions_active 
ON simulation.simulation_sessions (session_id) 
WHERE session_status = 'ACTIVE';

CREATE INDEX IF NOT EXISTS idx_session_vitals_session_id 
ON simulation.session_vitals_log (session_id);

CREATE INDEX IF NOT EXISTS idx_clinical_truth_investigations_gin 
ON clinical.clinical_truth_models USING GIN (investigations_db jsonb_path_ops);

CREATE INDEX IF NOT EXISTS idx_cases_title_trgm 
ON clinical.cases USING GIN (title gin_trgm_ops);
