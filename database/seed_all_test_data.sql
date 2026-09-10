-- =============================================================================
-- Comprehensive Test & Development Seed Dataset for Local PostgreSQL
-- AI Patient Simulation Engine
-- =============================================================================

-- 1. INSTITUTION & COHORTS
INSERT INTO tenant.institutions (institution_id, institution_code, institution_name, settings)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'BMC_BANGALORE',
    'Bangalore Medical College & Research Institute',
    '{"country": "India", "city": "Bangalore", "supported_languages": ["en", "kn", "hi"]}'
) ON CONFLICT (institution_code) DO NOTHING;

INSERT INTO tenant.cohorts (cohort_id, institution_id, cohort_name, academic_year)
VALUES 
(
    'c1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'MBBS Final Year - Clinical Batch A',
    '2026-2027'
),
(
    'c2222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'Postgraduate Emergency Medicine Residents',
    '2026-2028'
) ON CONFLICT DO NOTHING;

-- 2. TEST USERS (All default passwords: password123)
-- bcrypt hash for 'password123': $2b$12$e868N806V06mEwL1pMreAei56KxUoi5J82eS80oT8J5W793fO7Lp6
INSERT INTO tenant.users (user_id, institution_id, email, full_name, role, password_hash, preferred_language)
VALUES 
(
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'faculty.cardio@bmcri.edu.in',
    'Dr. Ramesh Kumar (Cardiology)',
    'FACULTY',
    '$2b$12$e868N806V06mEwL1pMreAei56KxUoi5J82eS80oT8J5W793fO7Lp6',
    'kn'
),
(
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'student.med2026@bmcri.edu.in',
    'Aditi Sharma',
    'STUDENT',
    '$2b$12$e868N806V06mEwL1pMreAei56KxUoi5J82eS80oT8J5W793fO7Lp6',
    'en'
),
(
    '44444444-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'admin@bmcri.edu.in',
    'Admin Office',
    'INSTITUTION_ADMIN',
    '$2b$12$e868N806V06mEwL1pMreAei56KxUoi5J82eS80oT8J5W793fO7Lp6',
    'en'
) ON CONFLICT (institution_id, email) DO NOTHING;

INSERT INTO tenant.cohort_enrollments (cohort_id, student_id)
VALUES ('c1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333')
ON CONFLICT DO NOTHING;

-- =============================================================================
-- CASE 1: ACUTE CHEST PAIN / STEMI (Cardiology)
-- =============================================================================
INSERT INTO clinical.cases (case_id, institution_id, case_code, title, medical_specialty, difficulty, created_by)
VALUES (
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'CARDIO-STEMI-001',
    'Acute Chest Pain with Diaphoresis in a 58-Year-Old Male',
    'Cardiology / Emergency Medicine',
    'INTERMEDIATE',
    '22222222-2222-2222-2222-222222222222'
) ON CONFLICT (case_code) DO NOTHING;

INSERT INTO clinical.case_versions (case_version_id, case_id, version_number, status, clinical_summary, supported_languages, is_locked, published_at)
VALUES (
    '55555555-5555-5555-5555-555555555555',
    '44444444-4444-4444-4444-444444444444',
    1,
    'PUBLISHED',
    'Patient is a 58-year-old male presenting with acute crushing central chest pain radiating to the left arm for 1 hour. Associated with diaphoresis and nausea. Requires immediate 12-lead ECG, aspirin/ticagrelor, and activation of catheterization laboratory.',
    ARRAY['en', 'kn', 'hi'],
    TRUE,
    clock_timestamp()
) ON CONFLICT (case_id, version_number) DO NOTHING;

INSERT INTO clinical.patient_personas (persona_id, case_version_id, patient_name, age, biological_sex, emotional_baseline, communication_style, pain_level_baseline, voice_config, persona_rules)
VALUES (
    '66666666-6666-6666-6666-666666666666',
    '55555555-5555-5555-5555-555555555555',
    'Malleshappa Gowda',
    58,
    'MALE',
    'DISTRESSED',
    'BREATHLESS_CONCISE',
    8,
    '{"pitch": 0.9, "speed": 0.95, "accent": "kannada_english"}',
    '{"pain_expression": "groaning, clutching sternum with fist", "reluctance_to_lie_flat": true}'
) ON CONFLICT (case_version_id) DO NOTHING;

INSERT INTO clinical.clinical_truth_models (
    truth_model_id, case_version_id, chief_complaint, history_presenting,
    past_medical_hist, current_medications, allergies, family_social_hist,
    primary_diagnosis, differential_diag, hidden_diagnoses, baseline_vitals,
    examination_catalog, investigations_db, treatment_protocols
) VALUES (
    '77777777-7777-7777-7777-777777777777',
    '55555555-5555-5555-5555-555555555555',
    'Severe central crushing chest pain for approximately one hour.',
    'Pain started at rest while reading newspaper. Described as a heavy stone placed on chest. Radiates to left jaw and inner left arm. Accompanied by profuse cold sweating and nausea. No relief with rest.',
    '["Type 2 Diabetes Mellitus x 8 years", "Hypertension x 5 years"]'::jsonb,
    '["Metformin 500mg BD", "Telmisartan 40mg OD"]'::jsonb,
    '["No known drug allergies (NKDA)"]'::jsonb,
    '{"smoking": "20 pack-years, active smoker", "family": "Father died of MI at age 52"}'::jsonb,
    'Acute Anterior ST-Elevation Myocardial Infarction (STEMI)',
    ARRAY['Aortic Dissection', 'Pulmonary Embolism', 'Acute Pericarditis', 'GERD'],
    ARRAY['STEMI', 'Myocardial Infarction', 'Coronary Artery Occlusion'],
    '{"hr": 102, "bp_sys": 148, "bp_dia": 92, "spo2": 94, "rr": 22, "temp": 37.0, "pain": 8}'::jsonb,
    '{
        "cardiovascular": "S1 S2 present, S4 gallop audible at apex. No murmurs or pericardial rub.",
        "respiratory": "Bilateral clear breath sounds, minimal fine bibasilar crepitations.",
        "general": "Patient pale, sweating profusely, clutching center of chest with right fist."
    }'::jsonb,
    '{
        "ecg_12_lead": {"status": "available", "finding": "ST-elevation 3mm in leads V1-V4 with reciprocal ST-depression in II, III, aVF. Hyperacute T waves."},
        "troponin_i": {"status": "delayed", "finding": "Elevated at 1.45 ng/mL (Reference: <0.04 ng/mL)"},
        "chest_xray": {"status": "available", "finding": "Normal cardiac silhouette, clear lung fields, no mediastinal widening."}
    }'::jsonb,
    '{
        "aspirin_300mg": {"effect": "mandatory", "vitals_change": {"pain": -1}, "feedback": "Antiplatelet loading administered."},
        "ticagrelor_180mg": {"effect": "mandatory", "feedback": "Dual antiplatelet therapy initiated."},
        "sublingual_nitroglycerin": {"effect": "beneficial", "vitals_change": {"bp_sys": -15, "bp_dia": -10, "pain": -3}},
        "cath_lab_activation": {"effect": "critical_success", "feedback": "Primary PCI team mobilized within benchmark."}
    }'::jsonb
) ON CONFLICT (case_version_id) DO NOTHING;

INSERT INTO clinical.scenario_states (state_id, case_version_id, state_name, vitals_override, transition_rules)
VALUES 
('88888888-8888-8888-8888-888888888881', '55555555-5555-5555-5555-555555555555', 'INITIAL', '{"hr": 102, "bp_sys": 148, "bp_dia": 92, "spo2": 94, "rr": 22, "pain": 8}'::jsonb, '{"next": "DETERIORATING", "timeout_seconds": 600}'::jsonb),
('88888888-8888-8888-8888-888888888882', '55555555-5555-5555-5555-555555555555', 'DETERIORATING', '{"hr": 124, "bp_sys": 92, "bp_dia": 60, "spo2": 89, "rr": 28, "pain": 10}'::jsonb, '{"next": "CRITICAL"}'::jsonb),
('88888888-8888-8888-8888-888888888883', '55555555-5555-5555-5555-555555555555', 'STABILIZING', '{"hr": 84, "bp_sys": 126, "bp_dia": 78, "spo2": 98, "rr": 16, "pain": 3}'::jsonb, '{"next": "COMPLETED"}'::jsonb),
('88888888-8888-8888-8888-888888888884', '55555555-5555-5555-5555-555555555555', 'COMPLETED', '{"hr": 78, "bp_sys": 120, "bp_dia": 76, "spo2": 99, "rr": 14, "pain": 1}'::jsonb, '{"terminal": true}'::jsonb)
ON CONFLICT (case_version_id, state_name) DO NOTHING;

INSERT INTO assessment.scoring_rubrics (rubric_id, case_version_id, weight_history, weight_examination, weight_investigation, weight_treatment, weight_diagnosis, weight_communication, critical_errors_def, ideal_pathway)
VALUES (
    '99999999-9999-9999-9999-999999999999',
    '55555555-5555-5555-5555-555555555555',
    20.00, 15.00, 20.00, 25.00, 10.00, 10.00,
    '[{"code": "ERR_NO_ECG", "description": "Failure to order 12-lead ECG", "penalty_percent": 30}]'::jsonb,
    '{"expected_history": ["pain", "radiat", "onset", "medic"], "expected_investigations": ["ecg_12_lead", "troponin_i"], "expected_treatments": ["aspirin_300mg", "cath_lab_activation"]}'::jsonb
) ON CONFLICT (case_version_id) DO NOTHING;

-- =============================================================================
-- CASE 2: ACUTE SEVERE ASTHMA EXACERBATION (Pulmonology)
-- =============================================================================
INSERT INTO clinical.cases (case_id, institution_id, case_code, title, medical_specialty, difficulty, created_by)
VALUES (
    '44444444-4444-4444-4444-444444444445',
    '11111111-1111-1111-1111-111111111111',
    'RESP-ASTHMA-002',
    'Acute Shortness of Breath and Wheezing in a 24-Year-Old Female',
    'Pulmonology / Emergency Medicine',
    'NOVICE',
    '22222222-2222-2222-2222-222222222222'
) ON CONFLICT (case_code) DO NOTHING;

INSERT INTO clinical.case_versions (case_version_id, case_id, version_number, status, clinical_summary, supported_languages, is_locked, published_at)
VALUES (
    '55555555-5555-5555-5555-555555555556',
    '44444444-4444-4444-4444-444444444445',
    1,
    'PUBLISHED',
    '24-year-old female with known bronchial asthma presenting with severe breathlessness, unable to complete sentences in one breath. Requires high-flow oxygen, nebulized salbutamol + ipratropium, and IV hydrocortisone.',
    ARRAY['en', 'hi', 'kn'],
    TRUE,
    clock_timestamp()
) ON CONFLICT (case_id, version_number) DO NOTHING;

INSERT INTO clinical.patient_personas (persona_id, case_version_id, patient_name, age, biological_sex, emotional_baseline, communication_style, pain_level_baseline, voice_config)
VALUES (
    '66666666-6666-6666-6666-666666666667',
    '55555555-5555-5555-5555-555555555556',
    'Pooja Nair',
    24,
    'FEMALE',
    'PANICKED',
    'MONOSYLLABIC_GASPING',
    3,
    '{"pitch": 1.2, "speed": 1.1, "accent": "indian_english"}'::jsonb
) ON CONFLICT (case_version_id) DO NOTHING;

INSERT INTO clinical.clinical_truth_models (
    truth_model_id, case_version_id, chief_complaint, history_presenting,
    past_medical_hist, current_medications, allergies, family_social_hist,
    primary_diagnosis, differential_diag, hidden_diagnoses, baseline_vitals,
    examination_catalog, investigations_db, treatment_protocols
) VALUES (
    '77777777-7777-7777-7777-777777777778',
    '55555555-5555-5555-5555-555555555556',
    'Severe difficulty breathing and wheezing for the past 3 hours.',
    'Symptoms flared up after exposure to dust during house cleaning. Inhaled salbutamol puffer 4 puffs at home with minimal relief. Speaks in 2-3 word phrases.',
    '["Bronchial Asthma diagnosed at age 10", "Allergic rhinitis"]'::jsonb,
    '["Salbutamol 100mcg inhaler PRN", "Budesonide 200mcg inhaler BD (infrequent use)"]'::jsonb,
    '["Aspirin (causes wheezing)", "Dust mites"]'::jsonb,
    '{"smoking": "Non-smoker", "family": "Mother has allergic asthma"}'::jsonb,
    'Acute Severe Asthma Exacerbation',
    ARRAY['Anaphylaxis', 'Foreign Body Aspiration', 'Acute Bronchitis', 'Pneumothorax'],
    ARRAY['Asthma Exacerbation', 'Status Asthmaticus'],
    '{"hr": 118, "bp_sys": 130, "bp_dia": 82, "spo2": 90, "rr": 30, "temp": 36.8, "pain": 2}'::jsonb,
    '{
        "respiratory": "Bilateral widespread expiratory high-pitched wheezing, accessory muscle use (sternocleidomastoid retractions), prolonged expiratory phase.",
        "cardiovascular": "Tachycardia (118 bpm), normal heart sounds.",
        "general": "Agitated, sitting upright in tripod position, sweating."
    }'::jsonb,
    '{
        "peak_flow": {"status": "available", "finding": "Peak Expiratory Flow (PEF) 180 L/min (<50% predicted)."},
        "arterial_blood_gas": {"status": "available", "finding": "pH 7.42, PaCO2 38 mmHg (pseudonormal PaCO2 indicating impending respiratory muscle fatigue), PaO2 62 mmHg."},
        "chest_xray": {"status": "available", "finding": "Hyperinflated lungs with flattened diaphragms, no pneumothorax or consolidation."}
    }'::jsonb,
    '{
        "salbutamol_nebulization": {"effect": "mandatory", "vitals_change": {"rr": -6, "spo2": 5}, "feedback": "Bronchodilator delivered via oxygen-driven nebulizer."},
        "ipratropium_nebulization": {"effect": "beneficial", "vitals_change": {"rr": -4, "spo2": 3}},
        "iv_hydrocortisone_100mg": {"effect": "mandatory", "feedback": "Systemic corticosteroid administered to reduce airway inflammation."},
        "oxygen_therapy": {"effect": "mandatory", "vitals_change": {"spo2": 7}}
    }'::jsonb
) ON CONFLICT (case_version_id) DO NOTHING;

INSERT INTO assessment.scoring_rubrics (rubric_id, case_version_id, weight_history, weight_examination, weight_investigation, weight_treatment, weight_diagnosis, weight_communication, critical_errors_def, ideal_pathway)
VALUES (
    '99999999-9999-9999-9999-999999999998',
    '55555555-5555-5555-5555-555555555556',
    15.00, 20.00, 15.00, 30.00, 10.00, 10.00,
    '[{"code": "ERR_NO_OXYGEN", "description": "Failure to apply supplemental oxygen for SpO2 < 92%", "penalty_percent": 25}]'::jsonb,
    '{"expected_history": ["breath", "wheez", "trigger", "inhaler"], "expected_investigations": ["peak_flow", "arterial_blood_gas"], "expected_treatments": ["salbutamol_nebulization", "oxygen_therapy", "iv_hydrocortisone_100mg"]}'::jsonb
) ON CONFLICT (case_version_id) DO NOTHING;

-- 3. Pre-seed 1 Sample Completed Session (For immediate UI Verification)
INSERT INTO simulation.simulation_sessions (
    session_id, institution_id, student_id, case_version_id,
    session_status, primary_language, start_time, end_time, final_score, session_metadata
) VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    '55555555-5555-5555-5555-555555555555',
    'COMPLETED',
    'en',
    clock_timestamp() - INTERVAL '25 minutes',
    clock_timestamp(),
    88.50,
    '{"notes": "Completed baseline test simulation with primary PCI activation."}'::jsonb
) ON CONFLICT DO NOTHING;

INSERT INTO assessment.session_evaluations (
    evaluation_id, session_id, evaluator_user_id, total_score, is_passed,
    score_breakdown, critical_errors_hit, strengths, areas_for_growth
) VALUES (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '22222222-2222-2222-2222-222222222222',
    88.50,
    TRUE,
    '{"history": 85.0, "investigations": 100.0, "treatment": 90.0, "diagnosis": 100.0, "communication": 90.0}'::jsonb,
    '[]'::jsonb,
    ARRAY['Accurate, immediate recognition of STEMI on 12-lead ECG.', 'Prompt administration of dual antiplatelet therapy.'],
    ARRAY['Remember to inquire about aspirin allergy before administering oral loading dose.']
) ON CONFLICT DO NOTHING;
