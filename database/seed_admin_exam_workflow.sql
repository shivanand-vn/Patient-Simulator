-- =============================================================================
-- Seed Data for Admin, Faculty, Batches, Cases, and Exam Schedules
-- =============================================================================

-- 1. Ensure Institution Exists
INSERT INTO tenant.institutions (institution_id, institution_code, institution_name, settings)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'BMC_BANGALORE',
    'Bangalore Medical College & Research Institute',
    '{"country": "India", "city": "Bangalore"}'
) ON CONFLICT (institution_code) DO NOTHING;

-- 2. Admin & Faculty Users (Default Password: password123)
-- Password hash: $2b$12$e868N806V06mEwL1pMreAei56KxUoi5J82eS80oT8J5W793fO7Lp6
INSERT INTO tenant.users (user_id, institution_id, email, full_name, role, password_hash, contact_number, must_change_password)
VALUES 
(
    '44444444-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'admin@bmcri.edu.in',
    'Simulation Center Administrator',
    'INSTITUTION_ADMIN',
    '$2b$12$e868N806V06mEwL1pMreAei56KxUoi5J82eS80oT8J5W793fO7Lp6',
    '+91 98450 12345',
    FALSE
),
(
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'faculty.cardio@bmcri.edu.in',
    'Dr. Ramesh Kumar (Cardiology)',
    'FACULTY',
    '$2b$12$e868N806V06mEwL1pMreAei56KxUoi5J82eS80oT8J5W793fO7Lp6',
    '+91 98451 23456',
    TRUE -- Will prompt password change on first login
),
(
    '22222222-2222-2222-2222-222222222223',
    '11111111-1111-1111-1111-111111111111',
    'faculty.resp@bmcri.edu.in',
    'Dr. Sunita Rao (Pulmonology)',
    'FACULTY',
    '$2b$12$e868N806V06mEwL1pMreAei56KxUoi5J82eS80oT8J5W793fO7Lp6',
    '+91 98452 34567',
    TRUE
) ON CONFLICT (institution_id, email) DO UPDATE
SET contact_number = EXCLUDED.contact_number,
    must_change_password = EXCLUDED.must_change_password;

-- 3. Batches (Approximately 59 students per batch capacity)
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
) ON CONFLICT (batch_id) DO NOTHING;

-- 4. Students with Student ID (USN), Regular and Backlog Students
INSERT INTO academic.students (id, student_id, name, batch_id, year_of_joining, is_backlog, email, phone)
VALUES 
('s1111111-1111-1111-1111-111111111101', 'BMC2026001', 'Aditi Sharma', 'b1111111-1111-1111-1111-111111111111', 2022, FALSE, 'aditi.s@student.bmcri.edu.in', '+91 91234 56701'),
('s1111111-1111-1111-1111-111111111102', 'BMC2026014', 'Rohan Deshmukh', 'b1111111-1111-1111-1111-111111111111', 2022, FALSE, 'rohan.d@student.bmcri.edu.in', '+91 91234 56702'),
('s1111111-1111-1111-1111-111111111103', 'BMC2025044', 'Kavya Nair', 'b1111111-1111-1111-1111-111111111111', 2021, TRUE, 'kavya.n@student.bmcri.edu.in', '+91 91234 56703'), -- Backlog
('s1111111-1111-1111-1111-111111111104', 'BMC2026029', 'Siddharth Rao', 'b1111111-1111-1111-1111-111111111111', 2022, FALSE, 'siddharth.r@student.bmcri.edu.in', '+91 91234 56704'),
('s1111111-1111-1111-1111-111111111105', 'BMC2025052', 'Pooja Hegde', 'b1111111-1111-1111-1111-111111111111', 2021, TRUE, 'pooja.h@student.bmcri.edu.in', '+91 91234 56705') -- Backlog
ON CONFLICT (student_id) DO UPDATE
SET batch_id = EXCLUDED.batch_id, is_backlog = EXCLUDED.is_backlog;

-- 5. Clinical Cases (Cardiology and Respiratory with Doctor's Name & Patient Demographics)
INSERT INTO clinical.cases (
    case_id, institution_id, case_code, title, medical_specialty, category, difficulty, 
    doctor_name, patient_name, patient_age, patient_gender, chief_complaint, 
    target_vitals, created_by
) VALUES 
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
    '22222222-2222-2222-2222-222222222222'
),
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
    '22222222-2222-2222-2222-222222222223'
) ON CONFLICT (case_code) DO UPDATE
SET category = EXCLUDED.category,
    doctor_name = EXCLUDED.doctor_name,
    patient_name = EXCLUDED.patient_name,
    patient_age = EXCLUDED.patient_age,
    patient_gender = EXCLUDED.patient_gender,
    chief_complaint = EXCLUDED.chief_complaint,
    target_vitals = EXCLUDED.target_vitals;

-- 6. Exam Schedules (Admin schedules: Batch + Case + Faculty + Date + Time)
INSERT INTO examination.exam_schedules (
    schedule_id, batch_id, case_id, faculty_id, exam_date, exam_time, rig_location, status, created_by
) VALUES 
(
    'e1111111-1111-1111-1111-111111111111',
    'b1111111-1111-1111-1111-111111111111', -- 2026 MBBS Batch A
    '44444444-4444-4444-4444-444444444444', -- CASE-CARD-001 (Cardiology)
    '22222222-2222-2222-2222-222222222222', -- Dr. Ramesh Kumar
    CURRENT_DATE,
    '09:00:00',
    'Simulation Lab 01',
    'Room Ready',
    '44444444-1111-1111-1111-111111111111'
),
(
    'e2222222-2222-2222-2222-222222222222',
    'b1111111-1111-1111-1111-111111111111', -- 2026 MBBS Batch A
    '44444444-4444-4444-4444-444444444445', -- CASE-RESP-002 (Respiratory)
    '22222222-2222-2222-2222-222222222223', -- Dr. Sunita Rao
    CURRENT_DATE,
    '14:00:00',
    'Simulation Lab 03',
    'Scheduled',
    '44444444-1111-1111-1111-111111111111'
) ON CONFLICT (schedule_id) DO NOTHING;
