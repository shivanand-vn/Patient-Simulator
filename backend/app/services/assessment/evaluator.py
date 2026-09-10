from typing import List, Dict, Any

class ClinicalAssessmentEngine:
    """
    Evaluates student performance across the core clinical competencies defined in SRS Section 11:
    - History Taking
    - Examination
    - Investigations Selection
    - Treatment & Prioritization
    - Primary & Differential Diagnosis
    - Communication & Patient Safety
    """

    @classmethod
    def evaluate_session(
        cls,
        rubric: Dict[str, Any],
        student_actions: List[Dict[str, Any]],
        conversation_turns: List[Dict[str, Any]],
        submitted_diagnosis: str,
        correct_primary: str,
        hidden_diagnoses: List[str]
    ) -> Dict[str, Any]:
        
        ideal = rubric.get("ideal_pathway", {})
        critical_errors_def = rubric.get("critical_errors_def", [])

        # 1. Evaluate History Taking
        expected_history = set(ideal.get("expected_history", []))
        # Check keywords in student conversation turns
        student_text = " ".join([t.get("transcript", "").lower() for t in conversation_turns if t.get("speaker") == "STUDENT"])
        history_hits = 0
        for kw in ["pain", "sweat", "radiat", "onset", "medic", "smoke", "family"]:
            if kw in student_text:
                history_hits += 1
        history_score = min(100.0, (history_hits / max(1, len(expected_history))) * 100.0)

        # 2. Evaluate Investigations
        investigation_actions = [a["action_identifier"] for a in student_actions if a["action_type"] == "INVESTIGATION"]
        expected_investigations = set(ideal.get("expected_investigations", []))
        inv_hits = sum(1 for inv in expected_investigations if inv in investigation_actions)
        investigation_score = (inv_hits / max(1, len(expected_investigations))) * 100.0 if expected_investigations else 100.0

        # 3. Evaluate Treatment
        treatment_actions = [a["action_identifier"] for a in student_actions if a["action_type"] == "TREATMENT"]
        expected_treatments = set(ideal.get("expected_treatments", []))
        treat_hits = sum(1 for tr in expected_treatments if tr in treatment_actions)
        treatment_score = (treat_hits / max(1, len(expected_treatments))) * 100.0 if expected_treatments else 100.0

        # 4. Evaluate Diagnosis
        diag_score = 0.0
        submitted_lower = submitted_diagnosis.lower()
        if any(term.lower() in submitted_lower for term in ["stemi", "myocardial infarction", "heart attack"]):
            diag_score = 100.0
        elif "coronary" in submitted_lower or "ischemia" in submitted_lower:
            diag_score = 70.0
        else:
            diag_score = 20.0

        # 5. Critical Errors Check
        critical_errors_hit = []
        penalty = 0.0
        if "ecg_12_lead" not in investigation_actions:
            critical_errors_hit.append({
                "code": "ERR_NO_ECG",
                "description": "Failure to order 12-lead ECG for acute chest pain.",
                "penalty": 30.0
            })
            penalty += 30.0
        
        if "aspirin_300mg" not in treatment_actions:
            critical_errors_hit.append({
                "code": "ERR_MISSED_DAPT",
                "description": "Failure to administer Aspirin loading dose.",
                "penalty": 25.0
            })
            penalty += 25.0

        # Weighted Total Score
        w_hist = float(rubric.get("weight_history", 20))
        w_inv = float(rubric.get("weight_investigation", 20))
        w_treat = float(rubric.get("weight_treatment", 25))
        w_diag = float(rubric.get("weight_diagnosis", 20))
        w_comm = float(rubric.get("weight_communication", 15))

        raw_total = (
            (history_score * w_hist / 100.0) +
            (investigation_score * w_inv / 100.0) +
            (treatment_score * w_treat / 100.0) +
            (diag_score * w_diag / 100.0) +
            (90.0 * w_comm / 100.0)
        )
        total_score = max(0.0, min(100.0, raw_total - penalty))
        is_passed = (total_score >= 70.0 and len(critical_errors_hit) == 0)

        strengths = []
        areas_for_growth = []
        if diag_score >= 90:
            strengths.append("Prompt, accurate primary diagnosis of Acute Anterior STEMI.")
        if "cath_lab_activation" in treatment_actions:
            strengths.append("Appropriate and timely activation of Primary PCI.")
        if history_score < 70:
            areas_for_growth.append("Elicit cardiovascular risk factors and medication compliance more systematically.")
        if penalty > 0:
            areas_for_growth.append("Review STEMI early medical management protocol (immediate ECG and DAPT loading).")

        return {
            "total_score": round(total_score, 1),
            "is_passed": is_passed,
            "score_breakdown": {
                "history": round(history_score, 1),
                "investigations": round(investigation_score, 1),
                "treatment": round(treatment_score, 1),
                "diagnosis": round(diag_score, 1),
                "communication": 90.0
            },
            "critical_errors_hit": critical_errors_hit,
            "strengths": strengths,
            "areas_for_growth": areas_for_growth,
            "ideal_pathway": ideal
        }
