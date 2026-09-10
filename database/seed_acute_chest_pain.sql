-- =============================================================================
-- Seed Data: Appendix A Case - Acute Chest Pain / Acute Myocardial Infarction
-- =============================================================================

-- 1. Create Default Medical College Institution
INSERT INTO tenant.institutions (institution_id, institution_code, institution_name, settings)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'BMC_BANGALORE',
    'Bangalore Medical College & Research Institute',
    '{"country": "India", "timezone": "Asia/Kolkata", "languages": ["en", "kn", "hi"]}'
) ON CONFLICT (institution_code) DO NOTHING;

-- 2. Create Default Clinical Faculty & Student
INSERT INTO tenant.users (user_id, institution_id, email, full_name, role, password_hash, preferred_language)
VALUES 
(
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'faculty.cardio@bmcri.edu.in',
    'Dr. Ramesh Kumar (Cardiology)',
    'FACULTY',
    '$2b$12$K8y0Wf7Z0iY5f6xYQzG1eO7r1t9wA9p9b8c7d6e5f4g3h2i1j0k1l', -- dummy hash
    'kn'
),
(
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'student.med2026@bmcri.edu.in',
    'Aditi Sharma',
    'STUDENT',
    '$2b$12$K8y0Wf7Z0iY5f6xYQzG1eO7r1t9wA9p9b8c7d6e5f4g3h2i1j0k1l',
    'en'
) ON CONFLICT (institution_id, email) DO NOTHING;

-- 3. Create Case: Acute Myocardial Infarction
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

-- 4. Case Version 1 (Published & Locked)
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

-- 5. Patient Persona: Mr. Malleshappa (Kannada primary, speaks English/Hindi as well)
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
    '{"pitch": 0.9, "speed": 0.95, "accent": "kannada_english", "tts_voice_id": "kn-IN-GaganNeural"}',
    '{"pain_expression": "groaning, clutching central chest with fist (Levine sign)", "anxiety_factor": 0.85, "reluctance_to_lie_flat": true}'
) ON CONFLICT (case_version_id) DO NOTHING;

-- 6. Clinical Truth Model
INSERT INTO clinical.clinical_truth_models (
    truth_model_id,
    case_version_id,
    chief_complaint,
    history_presenting,
    past_medical_hist,
    current_medications,
    allergies,
    family_social_hist,
    primary_diagnosis,
    differential_diag,
    hidden_diagnoses,
    baseline_vitals,
    examination_catalog,
    investigations_db,
    treatment_protocols
) VALUES (
    '77777777-7777-7777-7777-777777777777',
    '55555555-5555-5555-5555-555555555555',
    'Severe central crushing chest pain for approximately one hour.',
    'Pain started at rest while reading newspaper. Described as a heavy stone placed on chest. Radiates to left jaw and inner left arm. Accompanied by profuse cold sweating and nausea. No relief with rest.',
    '["Type 2 Diabetes Mellitus x 8 years", "Hypertension x 5 years", "Hyperlipidemia"]'::jsonb,
    '["Metformin 500mg BD", "Telmisartan 40mg OD", "Atorvastatin 10mg HS (non-compliant)"]'::jsonb,
    '["No known drug allergies (NKDA)"]'::jsonb,
    '{"smoking": "20 pack-years, active smoker", "alcohol": "Social, 1-2 drinks/weekend", "family": "Father died of MI at age 52"}'::jsonb,
    'Acute Anterior ST-Elevation Myocardial Infarction (STEMI)',
    ARRAY['Aortic Dissection', 'Acute Pulmonary Embolism', 'Acute Pericarditis', 'Gastroesophageal Reflux Disease'],
    ARRAY['STEMI', 'Myocardial Infarction', 'Coronary Artery Occlusion'],
    '{"hr": 102, "bp_sys": 148, "bp_dia": 92, "spo2": 94, "rr": 22, "temp": 37.0, "pain": 8}'::jsonb,
    '{
        "general": "Patient pale, diaphoretic, anxious, clutching sternum with right fist.",
        "cardiovascular": "S1 S2 present, S4 gallop audible at apex. No murmurs or pericardial friction rub. JVP normal.",
        "respiratory": "Bilateral clear breath sounds, minimal fine bibasilar crepitations.",
        "abdomen": "Soft, non-tender, no organomegaly."
    }'::jsonb,
    '{
        "ecg_12_lead": {"status": "available", "finding": "ST-elevation 3mm in leads V1-V4 with reciprocal ST-depression in II, III, aVF. Hyperacute T waves.", "is_diagnostic": true},
        "troponin_i": {"status": "delayed_30min", "finding": "Elevated at 1.45 ng/mL (Reference: <0.04 ng/mL)"},
        "chest_xray": {"status": "available", "finding": "Normal cardiac silhouette, clear lung fields, no widened mediastinum."},
        "bedside_echo": {"status": "available", "finding": "Anterior wall hypokinesia, LVEF estimated 40%."}
    }'::jsonb,
    '{
        "aspirin_300mg": {"effect": "mandatory", "vitals_change": {"pain": -1}, "feedback": "Appropriate antiplatelet loading."},
        "ticagrelor_180mg": {"effect": "mandatory", "feedback": "Appropriate dual antiplatelet therapy."},
        "sublingual_nitroglycerin": {"effect": "beneficial", "vitals_change": {"bp_sys": -15, "bp_dia": -10, "pain": -3}},
        "iv_morphine_2mg": {"effect": "beneficial", "vitals_change": {"pain": -4, "hr": -10}},
        "cath_lab_activation": {"effect": "critical_success", "feedback": "Primary PCI activated within door-to-balloon benchmark."}
    }'::jsonb
) ON CONFLICT (case_version_id) DO NOTHING;

-- 7. Scenario States & Transitions
INSERT INTO clinical.scenario_states (state_id, case_version_id, state_name, vitals_override, transition_rules)
VALUES 
(
    '88888888-8888-8888-8888-888888888881',
    '55555555-5555-5555-5555-555555555555',
    'INITIAL',
    '{"hr": 102, "bp_sys": 148, "bp_dia": 92, "spo2": 94, "rr": 22, "pain": 8}',
    '{"next": "DETERIORATING", "timeout_seconds": 600, "trigger": "If no ECG or oxygen administered within 10 minutes"}'
),
(
    '88888888-8888-8888-8888-888888888882',
    '55555555-5555-5555-5555-555555555555',
    'DETERIORATING',
    '{"hr": 124, "bp_sys": 92, "bp_dia": 60, "spo2": 89, "rr": 28, "pain": 10}',
    '{"next": "CRITICAL", "timeout_seconds": 300, "trigger": "Continued delay in reperfusion or antiplatelets"}'
),
(
    '88888888-8888-8888-8888-888888888883',
    '55555555-5555-5555-5555-555555555555',
    'STABILIZING',
    '{"hr": 84, "bp_sys": 126, "bp_dia": 78, "spo2": 98, "rr": 16, "pain": 3}',
    '{"next": "COMPLETED", "trigger": "Cath lab activated, DAPT given, patient pain controlled"}'
),
(
    '88888888-8888-8888-8888-888888888884',
    '55555555-5555-5555-5555-555555555555',
    'COMPLETED',
    '{"hr": 78, "bp_sys": 120, "bp_dia": 76, "spo2": 99, "rr": 14, "pain": 1}',
    '{"terminal": true}'
) ON CONFLICT (case_version_id, state_name) DO NOTHING;

-- 8. Scoring Rubric for Evaluation Engine
INSERT INTO assessment.scoring_rubrics (
    rubric_id,
    case_version_id,
    weight_history,
    weight_examination,
    weight_investigation,
    weight_treatment,
    weight_diagnosis,
    weight_communication,
    critical_errors_def,
    ideal_pathway
) VALUES (
    '99999999-9999-9999-9999-999999999999',
    '55555555-5555-5555-5555-555555555555',
    20.00,
    15.00,
    20.00,
    25.00,
    10.00,
    10.00,
    '[
        {"code": "ERR_NO_ECG", "description": "Failure to order 12-lead ECG within 10 minutes", "penalty_percent": 30},
        {"code": "ERR_MISSED_DAPT", "description": "Failure to load Aspirin + P2Y12 inhibitor", "penalty_percent": 25},
        {"code": "ERR_CONTRAINDICATED_MED", "description": "Administering beta-blocker while patient is hypotensive/in heart failure", "penalty_percent": 20}
    ]'::jsonb,
    '{
        "expected_history": ["pain_onset", "pain_radiation", "diaphoresis", "cardiac_risk_factors"],
        "expected_exam": ["vital_signs", "cardiovascular_auscultation", "respiratory_auscultation"],
        "expected_investigations": ["ecg_12_lead", "troponin_i", "chest_xray"],
        "expected_treatments": ["aspirin_300mg", "ticagrelor_180mg", "cath_lab_activation"]
    }'::jsonb
) ON CONFLICT (case_version_id) DO NOTHING;
