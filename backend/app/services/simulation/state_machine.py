from typing import Dict, Any, Tuple
import copy

class SimulationStateMachine:
    """
    Manages deterministic clinical scenario progression, patient physiology,
    and vital-sign transitions based on student actions and elapsed time.
    """

    @staticmethod
    def calculate_new_state(
        current_state_name: str,
        action_type: str,
        action_identifier: str,
        current_vitals: Dict[str, Any],
        treatment_protocols: Dict[str, Any]
    ) -> Tuple[str, Dict[str, Any], bool, Dict[str, Any]]:
        """
        Determines if an action triggers a scenario state change (e.g. STABILIZING)
        and adjusts physiological vital signs deterministically.
        """
        vitals = copy.deepcopy(current_vitals)
        new_state = current_state_name
        state_changed = False
        action_result = {}

        if action_type == "TREATMENT":
            treatment_info = treatment_protocols.get(action_identifier, {})
            if treatment_info:
                action_result = {
                    "status": "administered",
                    "effect": treatment_info.get("effect", "standard"),
                    "clinical_notes": treatment_info.get("feedback", "Treatment applied.")
                }

                # Apply vital sign adjustments defined in protocol
                vitals_delta = treatment_info.get("vitals_change", {})
                if "hr" in vitals_delta and "hr" in vitals:
                    vitals["hr"] = max(40, min(200, vitals["hr"] + vitals_delta["hr"]))
                if "bp_sys" in vitals_delta and "bp_sys" in vitals:
                    vitals["bp_sys"] = max(60, min(240, vitals["bp_sys"] + vitals_delta["bp_sys"]))
                if "bp_dia" in vitals_delta and "bp_dia" in vitals:
                    vitals["bp_dia"] = max(40, min(140, vitals["bp_dia"] + vitals_delta["bp_dia"]))
                if "pain" in vitals_delta and "pain" in vitals:
                    vitals["pain"] = max(0, min(10, vitals["pain"] + vitals_delta["pain"]))

                # Check if critical success transitions patient to STABILIZING
                if treatment_info.get("effect") == "critical_success" or action_identifier in ["cath_lab_activation", "reperfusion"]:
                    new_state = "STABILIZING"
                    state_changed = (new_state != current_state_name)
                    vitals["spo2"] = 98
                    vitals["rr"] = 16
            else:
                action_result = {
                    "status": "administered",
                    "effect": "neutral",
                    "clinical_notes": "Action performed, no acute physiological shift."
                }

        elif action_type == "INVESTIGATION":
            # Investigations do not directly alter vitals, but provide diagnostic data
            action_result = {
                "status": "completed",
                "identifier": action_identifier
            }

        elif action_type == "EXAMINATION":
            action_result = {
                "status": "examined",
                "identifier": action_identifier
            }

        return new_state, vitals, state_changed, action_result
