-- =============================================================================
-- Migration 02: Admin Management, Exam Scheduling & Structured Student Assessment
-- =============================================================================

-- 1. Create Academic and Examination Schemas
CREATE SCHEMA IF NOT EXISTS academic;
CREATE SCHEMA IF NOT EXISTS examination;

-- 2. Extend tenant.users with contact number and must_change_password flag
ALTER TABLE tenant.users 
ADD COLUMN IF NOT EXISTS contact_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN NOT NULL DEFAULT TRUE;

-- 3. Batches (Cohorts of ~59 students)
CREATE TABLE IF NOT EXISTS academic.batches (
    batch_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id      UUID REFERENCES tenant.institutions(institution_id) ON DELETE CASCADE,
    batch_name          VARCHAR(150) NOT NULL,
    academic_year       VARCHAR(50) NOT NULL,
    clinical_track      VARCHAR(100) DEFAULT 'MBBS General Clinical',
    capacity            INTEGER NOT NULL DEFAULT 60,
    status              VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Archived')),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

-- 4. Students (Supports Student ID / USN, year of joining, and backlog tracking)
CREATE TABLE IF NOT EXISTS academic.students (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id          VARCHAR(50) UNIQUE NOT NULL, -- e.g. BMC2026001
    name                VARCHAR(255) NOT NULL,
    batch_id            UUID REFERENCES academic.batches(batch_id) ON DELETE SET NULL,
    year_of_joining     INTEGER NOT NULL,
    is_backlog          BOOLEAN NOT NULL DEFAULT FALSE,
    email               VARCHAR(255),
    phone               VARCHAR(50),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

-- 5. Extend clinical.cases with Doctor's Name, Category/Specialty, and Patient Demographics
ALTER TABLE clinical.cases
ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Cardiology',
ADD COLUMN IF NOT EXISTS doctor_name VARCHAR(255) DEFAULT 'Attending Physician',
ADD COLUMN IF NOT EXISTS patient_name VARCHAR(150) DEFAULT 'Patient',
ADD COLUMN IF NOT EXISTS patient_age INTEGER DEFAULT 50,
ADD COLUMN IF NOT EXISTS patient_gender VARCHAR(20) DEFAULT 'Male',
ADD COLUMN IF NOT EXISTS chief_complaint TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS target_vitals JSONB DEFAULT '{"sys_bp": 120, "dia_bp": 80, "pulse": 72, "spo2": 98, "temp": 37.0}',
ADD COLUMN IF NOT EXISTS vital_reference_ranges JSONB DEFAULT '{
    "bp": {"sys_min": 90, "sys_max": 120, "dia_min": 60, "dia_max": 80, "unit": "mmHg"},
    "pulse": {"min": 60, "max": 100, "unit": "bpm"},
    "spo2": {"min": 95, "max": 100, "unit": "%"},
    "temp": {"min": 36.5, "max": 37.5, "unit": "°C"}
}',
ADD COLUMN IF NOT EXISTS predefined_assessment_order JSONB DEFAULT '[
    {"step": 1, "code": "seq_1", "title": "Confirm Patient Identity & Introduction"},
    {"step": 2, "code": "seq_2", "title": "Elicit Chief Complaint & Pain Assessment"},
    {"step": 3, "code": "seq_3", "title": "Perform Sequential Vital Signs (BP, Pulse, SpO2, Temp)"},
    {"step": 4, "code": "seq_4", "title": "Cardiopulmonary Auscultation"},
    {"step": 5, "code": "seq_5", "title": "Diagnostic Investigation Selection (ECG/CXR)"},
    {"step": 6, "code": "seq_6", "title": "Formulate Primary Diagnosis & Differential"},
    {"step": 7, "code": "seq_7", "title": "Initial Emergency Management Protocol"}
]';

-- 6. Exam Scheduling (Admin binds: Batch + Case + Faculty + Exam Date + Exam Time)
CREATE TABLE IF NOT EXISTS examination.exam_schedules (
    schedule_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id            UUID NOT NULL REFERENCES academic.batches(batch_id) ON DELETE RESTRICT,
    case_id             UUID NOT NULL REFERENCES clinical.cases(case_id) ON DELETE RESTRICT,
    faculty_id          UUID NOT NULL REFERENCES tenant.users(user_id) ON DELETE RESTRICT,
    exam_date           DATE NOT NULL,
    exam_time           TIME NOT NULL,
    rig_location        VARCHAR(100) DEFAULT 'Simulation Room 1',
    status              VARCHAR(30) NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Room Ready', 'In Progress', 'Completed', 'Cancelled')),
    notes               TEXT,
    created_by          UUID REFERENCES tenant.users(user_id),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

-- 7. Student Assessment Records during Scheduled Exam
CREATE TABLE IF NOT EXISTS examination.student_assessments (
    assessment_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id         UUID NOT NULL REFERENCES examination.exam_schedules(schedule_id) ON DELETE CASCADE,
    student_id          VARCHAR(50) NOT NULL REFERENCES academic.students(student_id) ON DELETE CASCADE,
    case_id             UUID NOT NULL REFERENCES clinical.cases(case_id) ON DELETE RESTRICT,
    faculty_id          UUID NOT NULL REFERENCES tenant.users(user_id),
    status              VARCHAR(30) NOT NULL DEFAULT 'In Progress' CHECK (status IN ('In Progress', 'Completed', 'Incomplete')),
    checklist_progress  JSONB NOT NULL DEFAULT '{}',
    sequence_score      NUMERIC(5, 2) DEFAULT 0.00,
    vitals_score        NUMERIC(5, 2) DEFAULT 0.00,
    total_score         NUMERIC(5, 2) DEFAULT 0.00,
    faculty_feedback    TEXT,
    started_at          TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    completed_at        TIMESTAMPTZ
);

-- 8. Sequential Vital Signs Recording (1. BP -> 2. Pulse -> 3. SpO2 -> 4. Temp)
CREATE TABLE IF NOT EXISTS examination.vital_signs_records (
    record_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id       UUID NOT NULL REFERENCES examination.student_assessments(assessment_id) ON DELETE CASCADE,
    student_id          VARCHAR(50) NOT NULL,
    case_id             UUID NOT NULL,
    step_1_bp_sys       NUMERIC(5, 1) NOT NULL,
    step_1_bp_dia       NUMERIC(5, 1) NOT NULL,
    step_1_bp_status    VARCHAR(30) DEFAULT 'Abnormal',
    step_2_pulse        INTEGER NOT NULL,
    step_2_pulse_status VARCHAR(30) DEFAULT 'Tachycardia',
    step_3_spo2         INTEGER NOT NULL,
    step_3_spo2_status  VARCHAR(30) DEFAULT 'Hypoxia',
    step_4_temp         NUMERIC(4, 1) NOT NULL,
    step_4_temp_status  VARCHAR(30) DEFAULT 'Normal',
    sequence_followed   BOOLEAN NOT NULL DEFAULT TRUE,
    vitals_score        NUMERIC(5, 2) DEFAULT 50.00,
    recorded_at         TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

-- Indexes for high-speed lookup
CREATE INDEX IF NOT EXISTS idx_exam_schedules_faculty ON examination.exam_schedules(faculty_id, exam_date);
CREATE INDEX IF NOT EXISTS idx_exam_schedules_batch ON examination.exam_schedules(batch_id);
CREATE INDEX IF NOT EXISTS idx_students_batch ON academic.students(batch_id);
CREATE INDEX IF NOT EXISTS idx_student_assessments_schedule ON examination.student_assessments(schedule_id);
