-- =============================================================================
-- Comprehensive Seed Data: Admin, Faculty, Batches, Students, Cases & Exam Schedules
-- =============================================================================

-- 1. Ensure Institution Exists
INSERT INTO tenant.institutions (institution_id, institution_code, institution_name, settings)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'BMC_BANGALORE',
    'Bangalore Medical College & Research Institute',
    '{"country": "India", "city": "Bangalore", "timezone": "Asia/Kolkata"}'
) ON CONFLICT (institution_code) DO NOTHING;

-- 2. Admin & Multi-Specialty Faculty Members
-- Default password: password123
-- Hash: $2b$12$e868N806V06mEwL1pMreAei56KxUoi5J82eS80oT8J5W793fO7Lp6
INSERT INTO tenant.users (user_id, institution_id, email, full_name, role, password_hash, contact_number, must_change_password, is_active)
VALUES 
(
    '44444444-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'admin@bmcri.edu.in',
    'Simulation Center Administrator',
    'INSTITUTION_ADMIN',
    '$2b$12$e868N806V06mEwL1pMreAei56KxUoi5J82eS80oT8J5W793fO7Lp6',
    '+91 98450 12345',
    FALSE,
    TRUE
),
(
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'faculty.cardio@bmcri.edu.in',
    'Dr. Ramesh Kumar (Cardiology)',
    'FACULTY',
    '$2b$12$e868N806V06mEwL1pMreAei56KxUoi5J82eS80oT8J5W793fO7Lp6',
    '+91 98451 23456',
    TRUE,
    TRUE
),
(
    '22222222-2222-2222-2222-222222222223',
    '11111111-1111-1111-1111-111111111111',
    'faculty.resp@bmcri.edu.in',
    'Dr. Sunita Rao (Pulmonology)',
    'FACULTY',
    '$2b$12$e868N806V06mEwL1pMreAei56KxUoi5J82eS80oT8J5W793fO7Lp6',
    '+91 98452 34567',
    TRUE,
    TRUE
),
(
    '22222222-2222-2222-2222-222222222224',
    '11111111-1111-1111-1111-111111111111',
    'faculty.em@bmcri.edu.in',
    'Dr. Anand Kulkarni (Emergency Medicine)',
    'FACULTY',
    '$2b$12$e868N806V06mEwL1pMreAei56KxUoi5J82eS80oT8J5W793fO7Lp6',
    '+91 98453 45678',
    TRUE,
    TRUE
),
(
    '22222222-2222-2222-2222-222222222225',
    '11111111-1111-1111-1111-111111111111',
    'faculty.med@bmcri.edu.in',
    'Dr. Priya Sharma (Internal Medicine)',
    'FACULTY',
    '$2b$12$e868N806V06mEwL1pMreAei56KxUoi5J82eS80oT8J5W793fO7Lp6',
    '+91 98454 56789',
    TRUE,
    TRUE
) ON CONFLICT (institution_id, email) DO UPDATE
SET contact_number = EXCLUDED.contact_number,
    must_change_password = EXCLUDED.must_change_password,
    full_name = EXCLUDED.full_name;

-- 3. Batches (Standard Batches ~59 students, plus Remedial & PG Tracks)
INSERT INTO academic.batches (batch_id, institution_id, batch_name, academic_year, clinical_track, capacity, status)
VALUES 
(
    'b1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    '2026 MBBS Batch A',
    'Year 4 (Final Year)',
    'Emergency & Acute Care',
    59,
    'Active'
),
(
    'b2222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    '2026 MBBS Batch B',
    'Year 4 (Final Year)',
    'Inpatient Internal Medicine',
    59,
    'Active'
),
(
    'b3333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    '2025 Supplementary & Backlogs Batch',
    'Repeaters / Remedial 2025-26',
    'Remedial Clinical Skills & OSCE',
    30,
    'Active'
),
(
    'b4444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    '2026 PG Emergency Medicine Residents',
    'Postgraduate Year 1',
    'Advanced Critical Resuscitation',
    20,
    'Active'
) ON CONFLICT (batch_id) DO UPDATE
SET batch_name = EXCLUDED.batch_name,
    clinical_track = EXCLUDED.clinical_track,
    capacity = EXCLUDED.capacity;

-- 4. Students (Regular Students & Backlog Students with USN)
INSERT INTO academic.students (id, student_id, name, batch_id, year_of_joining, is_backlog, email, phone)
VALUES 
-- Batch A (Regular & Backlog Mix)
('s1111111-1111-1111-1111-111111111101', 'BMC2026001', 'Aditi Sharma', 'b1111111-1111-1111-1111-111111111111', 2022, FALSE, 'aditi.s@student.bmcri.edu.in', '+91 91234 56701'),
('s1111111-1111-1111-1111-111111111102', 'BMC2026014', 'Rohan Deshmukh', 'b1111111-1111-1111-1111-111111111111', 2022, FALSE, 'rohan.d@student.bmcri.edu.in', '+91 91234 56702'),
('s1111111-1111-1111-1111-111111111103', 'BMC2025044', 'Kavya Nair', 'b1111111-1111-1111-1111-111111111111', 2021, TRUE, 'kavya.n@student.bmcri.edu.in', '+91 91234 56703'), -- Backlog
('s1111111-1111-1111-1111-111111111104', 'BMC2026029', 'Siddharth Rao', 'b1111111-1111-1111-1111-111111111111', 2022, FALSE, 'siddharth.r@student.bmcri.edu.in', '+91 91234 56704'),
('s1111111-1111-1111-1111-111111111105', 'BMC2025052', 'Pooja Hegde', 'b1111111-1111-1111-1111-111111111111', 2021, TRUE, 'pooja.h@student.bmcri.edu.in', '+91 91234 56705'), -- Backlog
('s1111111-1111-1111-1111-111111111106', 'BMC2026033', 'Arun Swaminathan', 'b1111111-1111-1111-1111-111111111111', 2022, FALSE, 'arun.s@student.bmcri.edu.in', '+91 91234 56706'),
('s1111111-1111-1111-1111-111111111107', 'BMC2026041', 'Deepika Patil', 'b1111111-1111-1111-1111-111111111111', 2022, FALSE, 'deepika.p@student.bmcri.edu.in', '+91 91234 56707'),
('s1111111-1111-1111-1111-111111111108', 'BMC2026055', 'Farhan Khan', 'b1111111-1111-1111-1111-111111111111', 2022, FALSE, 'farhan.k@student.bmcri.edu.in', '+91 91234 56708'),

-- Batch B (Regular & Backlog Mix)
('s1111111-1111-1111-1111-111111111109', 'BMC2026060', 'Gautam Banerjee', 'b2222222-2222-2222-2222-222222222222', 2022, FALSE, 'gautam.b@student.bmcri.edu.in', '+91 91234 56709'),
('s1111111-1111-1111-1111-111111111110', 'BMC2026072', 'Harini Murthy', 'b2222222-2222-2222-2222-222222222222', 2022, FALSE, 'harini.m@student.bmcri.edu.in', '+91 91234 56710'),
('s1111111-1111-1111-1111-111111111111', 'BMC2025081', 'Ishaan Verma', 'b2222222-2222-2222-2222-222222222222', 2021, TRUE, 'ishaan.v@student.bmcri.edu.in', '+91 91234 56711'), -- Backlog
('s1111111-1111-1111-1111-111111111112', 'BMC2026090', 'Jyothi Reddy', 'b2222222-2222-2222-2222-222222222222', 2022, FALSE, 'jyothi.r@student.bmcri.edu.in', '+91 91234 56712'),

-- Supplementary & Backlog Dedicated Batch
('s1111111-1111-1111-1111-111111111113', 'BMC2024018', 'Kishore Chandran', 'b3333333-3333-3333-3333-333333333333', 2020, TRUE, 'kishore.c@student.bmcri.edu.in', '+91 91234 56713'), -- Senior Backlog
('s1111111-1111-1111-1111-111111111114', 'BMC2024029', 'Lakshmi Narayanan', 'b3333333-3333-3333-3333-333333333333', 2020, TRUE, 'lakshmi.n@student.bmcri.edu.in', '+91 91234 56714'), -- Senior Backlog
('s1111111-1111-1111-1111-111111111115', 'BMC2025091', 'Manish Kulkarni', 'b3333333-3333-3333-3333-333333333333', 2021, TRUE, 'manish.k@student.bmcri.edu.in', '+91 91234 56715'),
('s1111111-1111-1111-1111-111111111116', 'BMC2025099', 'Neha Singhal', 'b3333333-3333-3333-3333-333333333333', 2021, TRUE, 'neha.s@student.bmcri.edu.in', '+91 91234 56716'),

-- Postgraduate Emergency Medicine Residents
('s1111111-1111-1111-1111-111111111117', 'PGEM202601', 'Dr. Omkar Joshi (JR-1)', 'b4444444-4444-4444-4444-444444444444', 2026, FALSE, 'omkar.j@pg.bmcri.edu.in', '+91 91234 56717'),
('s1111111-1111-1111-1111-111111111118', 'PGEM202602', 'Dr. Prerna Bhat (JR-1)', 'b4444444-4444-4444-4444-444444444444', 2026, FALSE, 'prerna.b@pg.bmcri.edu.in', '+91 91234 56718')
ON CONFLICT (student_id) DO UPDATE
SET batch_id = EXCLUDED.batch_id,
    name = EXCLUDED.name,
    is_backlog = EXCLUDED.is_backlog;

-- 5. Clinical Cases (Cardiology, Respiratory, and Emergency Medicine)
INSERT INTO clinical.cases (
    case_id, institution_id, case_code, title, medical_specialty, category, difficulty, 
    doctor_name, patient_name, patient_age, patient_gender, chief_complaint, 
    target_vitals, vital_reference_ranges, predefined_assessment_order, created_by
) VALUES 
-- Case 1: Cardiology - STEMI
(
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'CASE-CARD-001',
    'Acute Anterior STEMI (Cardiology)',
    'Cardiology / Emergency Medicine',
    'Cardiology',
    'INTERMEDIATE',
    'Dr. Ramesh Kumar (Cardiologist)',
    'Ramesh Gowda',
    58,
    'Male',
    'Severe substernal crushing chest pain radiating to left shoulder and jaw for 2 hours with profuse diaphoresis.',
    '{"sys_bp": 145, "dia_bp": 95, "pulse": 104, "spo2": 93, "temp": 37.1}'::jsonb,
    '{
        "bp": {"sys_min": 90, "sys_max": 120, "dia_min": 60, "dia_max": 80, "unit": "mmHg"},
        "pulse": {"min": 60, "max": 100, "unit": "bpm"},
        "spo2": {"min": 95, "max": 100, "unit": "%"},
        "temp": {"min": 36.5, "max": 37.5, "unit": "°C"}
    }'::jsonb,
    '[
        {"step": 1, "code": "seq_1", "title": "Confirm Patient Identity & Introduction"},
        {"step": 2, "code": "seq_2", "title": "Elicit Chief Complaint & Pain Assessment"},
        {"step": 3, "code": "seq_3", "title": "Perform Sequential Vital Signs (BP, Pulse, SpO2, Temp)"},
        {"step": 4, "code": "seq_4", "title": "Cardiopulmonary Auscultation"},
        {"step": 5, "code": "seq_5", "title": "Diagnostic Investigation Selection (ECG/CXR)"},
        {"step": 6, "code": "seq_6", "title": "Formulate Primary Diagnosis & Differential"},
        {"step": 7, "code": "seq_7", "title": "Initial Emergency Management Protocol"}
    ]'::jsonb,
    '22222222-2222-2222-2222-222222222222'
),

-- Case 2: Respiratory - Severe Asthma Exacerbation
(
    '44444444-4444-4444-4444-444444444445',
    '11111111-1111-1111-1111-111111111111',
    'CASE-RESP-002',
    'Acute Severe Asthma Exacerbation (Respiratory)',
    'Pulmonology / Emergency Medicine',
    'Respiratory',
    'NOVICE',
    'Dr. Sunita Rao (Pulmonologist)',
    'Pooja Nair',
    24,
    'Female',
    'Severe acute breathlessness and diffuse expiratory wheeze, unable to complete sentences in one breath.',
    '{"sys_bp": 130, "dia_bp": 82, "pulse": 118, "spo2": 90, "temp": 36.8}'::jsonb,
    '{
        "bp": {"sys_min": 90, "sys_max": 120, "dia_min": 60, "dia_max": 80, "unit": "mmHg"},
        "pulse": {"min": 60, "max": 100, "unit": "bpm"},
        "spo2": {"min": 95, "max": 100, "unit": "%"},
        "temp": {"min": 36.5, "max": 37.5, "unit": "°C"}
    }'::jsonb,
    '[
        {"step": 1, "code": "seq_1", "title": "Confirm Patient Identity & Calm Approach"},
        {"step": 2, "code": "seq_2", "title": "Assess Work of Breathing & Asthma Triggers"},
        {"step": 3, "code": "seq_3", "title": "Record Vital Signs (BP, Pulse, SpO2, Temp)"},
        {"step": 4, "code": "seq_4", "title": "Respiratory Auscultation for Silent Chest Signs"},
        {"step": 5, "code": "seq_5", "title": "Order Peak Flow (PEFR) & Arterial Blood Gas"},
        {"step": 6, "code": "seq_6", "title": "Grade Severity of Asthma Exacerbation"},
        {"step": 7, "code": "seq_7", "title": "Deliver High-Flow O2 & Nebulized Bronchodilators"}
    ]'::jsonb,
    '22222222-2222-2222-2222-222222222223'
),

-- Case 3: Cardiology - Hypertensive Crisis with Pulmonary Edema
(
    '44444444-4444-4444-4444-444444444446',
    '11111111-1111-1111-1111-111111111111',
    'CASE-CARD-003',
    'Hypertensive Crisis with Acute Pulmonary Edema',
    'Cardiology / Emergency Medicine',
    'Cardiology',
    'ADVANCED',
    'Dr. Anand Kulkarni (Emergency Medicine)',
    'Venkatesh Rao',
    66,
    'Male',
    'Severe sudden orthopnea, coughing up pink frothy sputum, pounding occipital headache, and BP over 200.',
    '{"sys_bp": 210, "dia_bp": 120, "pulse": 110, "spo2": 88, "temp": 37.0}'::jsonb,
    '{
        "bp": {"sys_min": 90, "sys_max": 120, "dia_min": 60, "dia_max": 80, "unit": "mmHg"},
        "pulse": {"min": 60, "max": 100, "unit": "bpm"},
        "spo2": {"min": 95, "max": 100, "unit": "%"},
        "temp": {"min": 36.5, "max": 37.5, "unit": "°C"}
    }'::jsonb,
    '[
        {"step": 1, "code": "seq_1", "title": "Confirm Patient Identity & Position Upright"},
        {"step": 2, "code": "seq_2", "title": "Identify Acute Organ Damage Symptoms (Heart, Brain, Kidneys)"},
        {"step": 3, "code": "seq_3", "title": "Sequential Vital Signs (BP, Pulse, SpO2, Temp)"},
        {"step": 4, "code": "seq_4", "title": "Auscultate for Bilateral Coarse Crepitations & S3 Gallop"},
        {"step": 5, "code": "seq_5", "title": "Order Emergent Bedside Chest X-Ray & Troponin"},
        {"step": 6, "code": "seq_6", "title": "Diagnose Hypertensive Emergency with Acute LVF"},
        {"step": 7, "code": "seq_7", "title": "Initiate IV Nitroglycerin Infusion & CPAP Support"}
    ]'::jsonb,
    '22222222-2222-2222-2222-222222222224'
),

-- Case 4: Respiratory - Severe Community-Acquired Pneumonia with Sepsis
(
    '44444444-4444-4444-4444-444444444447',
    '11111111-1111-1111-1111-111111111111',
    'CASE-RESP-004',
    'Severe Community-Acquired Pneumonia with Septic Shock',
    'Pulmonology / Critical Care',
    'Respiratory',
    'ADVANCED',
    'Dr. Priya Sharma (Internal Medicine)',
    'Meenakshi Sundaram',
    49,
    'Female',
    'High-grade fever with rigors for 4 days, productive purulent cough, pleuritic chest pain, and increasing lethargy.',
    '{"sys_bp": 88, "dia_bp": 56, "pulse": 124, "spo2": 89, "temp": 39.2}'::jsonb,
    '{
        "bp": {"sys_min": 90, "sys_max": 120, "dia_min": 60, "dia_max": 80, "unit": "mmHg"},
        "pulse": {"min": 60, "max": 100, "unit": "bpm"},
        "spo2": {"min": 95, "max": 100, "unit": "%"},
        "temp": {"min": 36.5, "max": 37.5, "unit": "°C"}
    }'::jsonb,
    '[
        {"step": 1, "code": "seq_1", "title": "Confirm Identity & Assess Mental Status (AVPU Scale)"},
        {"step": 2, "code": "seq_2", "title": "Elicit Sepsis Screen (Fever, Sputum, Rigors, Urine Output)"},
        {"step": 3, "code": "seq_3", "title": "Record Vital Signs (BP, Pulse, SpO2, Temp)"},
        {"step": 4, "code": "seq_4", "title": "Auscultate for Right Middle/Lower Lobe Consolidation"},
        {"step": 5, "code": "seq_5", "title": "Draw Blood Cultures, Sputum Gram Stain & Lactate"},
        {"step": 6, "code": "seq_6", "title": "Calculate CURB-65 & qSOFA Risk Scores"},
        {"step": 7, "code": "seq_7", "title": "Deliver Sepsis Six Bundle (IV Fluid Bolus + Broad-Spectrum Antibiotics)"}
    ]'::jsonb,
    '22222222-2222-2222-2222-222222222225'
) ON CONFLICT (case_code) DO UPDATE
SET category = EXCLUDED.category,
    doctor_name = EXCLUDED.doctor_name,
    patient_name = EXCLUDED.patient_name,
    patient_age = EXCLUDED.patient_age,
    patient_gender = EXCLUDED.patient_gender,
    chief_complaint = EXCLUDED.chief_complaint,
    target_vitals = EXCLUDED.target_vitals,
    vital_reference_ranges = EXCLUDED.vital_reference_ranges,
    predefined_assessment_order = EXCLUDED.predefined_assessment_order;

-- 6. Exam Schedules (Admin binds: Batch + Case + Faculty + Date + Time)
INSERT INTO examination.exam_schedules (
    schedule_id, batch_id, case_id, faculty_id, exam_date, exam_time, rig_location, status, created_by, notes
) VALUES 
-- Schedule 1: Batch A - Cardiology STEMI
(
    'e1111111-1111-1111-1111-111111111111',
    'b1111111-1111-1111-1111-111111111111', -- 2026 MBBS Batch A
    '44444444-4444-4444-4444-444444444444', -- CASE-CARD-001 (Cardiology)
    '22222222-2222-2222-2222-222222222222', -- Dr. Ramesh Kumar
    CURRENT_DATE,
    '09:00:00',
    'Simulation Room 01 (ICU Manikin)',
    'Room Ready',
    '44444444-1111-1111-1111-111111111111',
    'OSCE Station 1: STEMI Recognition & Rapid PCI Activation'
),

-- Schedule 2: Batch A - Respiratory Asthma
(
    'e2222222-2222-2222-2222-222222222222',
    'b1111111-1111-1111-1111-111111111111', -- 2026 MBBS Batch A
    '44444444-4444-4444-4444-444444444445', -- CASE-RESP-002 (Respiratory)
    '22222222-2222-2222-2222-222222222223', -- Dr. Sunita Rao
    CURRENT_DATE,
    '14:00:00',
    'Simulation Room 03 (Standard Lab)',
    'Scheduled',
    '44444444-1111-1111-1111-111111111111',
    'OSCE Station 2: Acute Asthma Severity Grading & Nebulization'
),

-- Schedule 3: Supplementary & Backlogs Batch - Cardiology STEMI
(
    'e3333333-3333-3333-3333-333333333333',
    'b3333333-3333-3333-3333-333333333333', -- 2025 Supplementary & Backlogs Batch
    '44444444-4444-4444-4444-444444444444', -- CASE-CARD-001
    '22222222-2222-2222-2222-222222222224', -- Dr. Anand Kulkarni
    CURRENT_DATE + INTERVAL '1 day',
    '10:00:00',
    'Remedial OSCE Rig 02',
    'Scheduled',
    '44444444-1111-1111-1111-111111111111',
    'Backlog Remedial Assessment Session'
),

-- Schedule 4: Batch B - Hypertensive Emergency
(
    'e4444444-4444-4444-4444-444444444444',
    'b2222222-2222-2222-2222-222222222222', -- 2026 MBBS Batch B
    '44444444-4444-4444-4444-444444444446', -- CASE-CARD-003
    '22222222-2222-2222-2222-222222222224', -- Dr. Anand Kulkarni
    CURRENT_DATE + INTERVAL '1 day',
    '14:00:00',
    'Critical Care Rig 01',
    'Scheduled',
    '44444444-1111-1111-1111-111111111111',
    'Inpatient Ward Hypertensive Crisis Simulation'
),

-- Schedule 5: PG Residents - Pneumonia with Septic Shock
(
    'e5555555-5555-5555-5555-555555555555',
    'b4444444-4444-4444-4444-444444444444', -- PG Emergency Medicine Residents
    '44444444-4444-4444-4444-444444444447', -- CASE-RESP-004
    '22222222-2222-2222-2222-222222222225', -- Dr. Priya Sharma
    CURRENT_DATE + INTERVAL '2 days',
    '11:00:00',
    'Simulation Room 04 (High-Fidelity Suite)',
    'Scheduled',
    '44444444-1111-1111-1111-111111111111',
    'PG Resident Resuscitation & Sepsis Protocol Exam'
) ON CONFLICT (schedule_id) DO NOTHING;

-- 7. Pre-populated Student Assessment & Sequential Vital Signs
-- Sample 1: Completed Assessment for Aditi Sharma (BMC2026001) on Schedule 1
INSERT INTO examination.student_assessments (
    assessment_id, schedule_id, student_id, case_id, faculty_id, status,
    checklist_progress, sequence_score, vitals_score, total_score, faculty_feedback, started_at, completed_at
) VALUES (
    'a1111111-1111-1111-1111-111111111101',
    'e1111111-1111-1111-1111-111111111111',
    'BMC2026001',
    '44444444-4444-4444-4444-444444444444',
    '22222222-2222-2222-2222-222222222222',
    'Completed',
    '{"seq_1": true, "seq_2": true, "seq_3": true, "seq_4": true, "seq_5": true, "seq_6": true, "seq_7": true}'::jsonb,
    50.00,
    42.00,
    92.00,
    'Excellent patient communication, adherence to vital sequence, and timely ECG request.',
    clock_timestamp() - INTERVAL '30 minutes',
    clock_timestamp() - INTERVAL '5 minutes'
) ON CONFLICT (assessment_id) DO NOTHING;

-- Vital Signs Record for Aditi Sharma: Step 1 BP -> Step 2 Pulse -> Step 3 SpO2 -> Step 4 Temp
INSERT INTO examination.vital_signs_records (
    record_id, assessment_id, student_id, case_id,
    step_1_bp_sys, step_1_bp_dia, step_1_bp_status,
    step_2_pulse, step_2_pulse_status,
    step_3_spo2, step_3_spo2_status,
    step_4_temp, step_4_temp_status,
    sequence_followed, vitals_score
) VALUES (
    'v1111111-1111-1111-1111-111111111101',
    'a1111111-1111-1111-1111-111111111101',
    'BMC2026001',
    '44444444-4444-4444-4444-444444444444',
    140.0, 90.0, 'Abnormal (Hypertensive)',
    100, 'Tachycardia',
    94, 'Mild Hypoxia',
    37.0, 'Normal',
    TRUE,
    42.00
) ON CONFLICT (record_id) DO NOTHING;

-- Sample 2: In-Progress Assessment for Backlog Student Kavya Nair (BMC2025044)
INSERT INTO examination.student_assessments (
    assessment_id, schedule_id, student_id, case_id, faculty_id, status,
    checklist_progress, sequence_score, vitals_score, total_score, started_at
) VALUES (
    'a1111111-1111-1111-1111-111111111102',
    'e1111111-1111-1111-1111-111111111111',
    'BMC2025044',
    '44444444-4444-4444-4444-444444444444',
    '22222222-2222-2222-2222-222222222222',
    'In Progress',
    '{"seq_1": true, "seq_2": true, "seq_3": false, "seq_4": false, "seq_5": false, "seq_6": false, "seq_7": false}'::jsonb,
    14.30,
    0.00,
    14.30,
    clock_timestamp() - INTERVAL '10 minutes'
) ON CONFLICT (assessment_id) DO NOTHING;
