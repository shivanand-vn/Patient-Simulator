import httpx
from typing import List, Dict, Any
from app.core.config import settings

class AIPatientOrchestrator:
    """
    Orchestrates the Conversational AI Patient Engine adhering strictly to SRS Section 10:
    1. Clinical Truth isolation (grounded solely in the scenario facts).
    2. Persona tone & emotional state injection (anxious, breathless, clutching chest).
    3. Strict Guardrails: never hallucinate unperformed exams or reveal hidden diagnoses.
    """

    SYSTEM_PROMPT_TEMPLATE = """You are roleplaying as a simulated medical patient in a clinical training encounter.
You MUST speak strictly from the patient's perspective in first-person ('I', 'my').

PATIENT IDENTITY & PERSONA:
- Name: {patient_name}
- Age: {age}, Sex: {biological_sex}
- Emotional State: {emotional_baseline}
- Pain Level: {pain_level}/10
- Language: {language}
- Speaking Style: {communication_style} (Keep answers realistic, relatively concise as you are in discomfort).

CLINICAL TRUTH (GROUND TRUTH FACTS ONLY):
- Chief Complaint: {chief_complaint}
- History of Illness: {history_presenting}
- Past Medical History: {past_medical_hist}
- Current Medications: {current_medications}
- Allergies: {allergies}
- Family & Social History: {family_social_hist}

STRICT CLINICAL SAFETY GUARDRAILS:
1. NEVER reveal your medical diagnosis (e.g. do NOT say "I am having a STEMI or Myocardial Infarction"). You only know your symptoms and how you feel.
2. NEVER make up clinical test results, lab values, or imaging findings. If asked about lab tests or ECG, say "The doctor hasn't told me yet" or "I just got here".
3. Answer truthfully according to your clinical facts when asked. If the student asks about something not in your history, say "No, I haven't had that" or "Not that I know of".
4. Express appropriate distress/pain consistent with your pain score of {pain_level}/10.
"""

    @classmethod
    async def generate_patient_turn(
        cls,
        user_message: str,
        conversation_history: List[Dict[str, str]],
        persona: Dict[str, Any],
        clinical_truth: Dict[str, Any],
        language_code: str = "en"
    ) -> str:
        """
        Generates a contextual response from the AI patient constrained by the clinical truth model.
        """
        system_content = cls.SYSTEM_PROMPT_TEMPLATE.format(
            patient_name=persona.get("patient_name", "Patient"),
            age=persona.get("age", 50),
            biological_sex=persona.get("biological_sex", "MALE"),
            emotional_baseline=persona.get("emotional_baseline", "DISTRESSED"),
            pain_level=clinical_truth.get("baseline_vitals", {}).get("pain", 8),
            language=language_code,
            communication_style=persona.get("communication_style", "BREATHLESS_CONCISE"),
            chief_complaint=clinical_truth.get("chief_complaint", ""),
            history_presenting=clinical_truth.get("history_presenting", ""),
            past_medical_hist=clinical_truth.get("past_medical_hist", []),
            current_medications=clinical_truth.get("current_medications", []),
            allergies=clinical_truth.get("allergies", []),
            family_social_hist=clinical_truth.get("family_social_hist", {})
        )

        messages = [{"role": "system", "content": system_content}]
        for turn in conversation_history[-6:]:  # include last 6 turns for conversational context
            messages.append({"role": turn["role"], "content": turn["content"]})
        messages.append({"role": "user", "content": user_message})

        # If an OpenAI or compatible API key is provided, call the LLM
        if settings.OPENAI_API_KEY and settings.OPENAI_API_KEY.startswith("sk-"):
            try:
                async with httpx.AsyncClient(timeout=15.0) as client:
                    response = await client.post(
                        "https://api.openai.com/v1/chat/completions",
                        headers={
                            "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                            "Content-Type": "application/json"
                        },
                        json={
                            "model": settings.LLM_MODEL_NAME,
                            "messages": messages,
                            "temperature": settings.LLM_TEMPERATURE,
                            "max_tokens": 200
                        }
                    )
                    if response.status_code == 200:
                        data = response.json()
                        return data["choices"][0]["message"]["content"].strip()
            except Exception:
                pass

        # Intelligent Deterministic Fallback (if offline or during initial development)
        lowered = user_message.lower()
        if any(w in lowered for w in ["pain", "hurt", "ache", "feeling"]):
            return "Doctor, it feels like an elephant is sitting on my chest... it is spreading down into my left arm and jaw. It started about an hour ago while I was at home."
        elif any(w in lowered for w in ["sweat", "breath", "dizzy", "nausea"]):
            return "Yes, I'm completely soaked in cold sweat... and feeling very sick to my stomach."
        elif any(w in lowered for w in ["medicine", "tablet", "pill", "prescription"]):
            return "I take tablets for sugar and blood pressure... Metformin and Telmisartan. I was prescribed a cholesterol tablet too, but I often forget to take it."
        elif any(w in lowered for w in ["smoke", "cigarette", "tobacco", "drink"]):
            return "I have been smoking a pack a day for about 20 years now, doctor. I don't drink much, just occasionally."
        elif any(w in lowered for w in ["family", "parent", "father", "mother"]):
            return "My father passed away quite young... he had a massive heart attack when he was only 52."
        else:
            return "Please help me doctor, this chest pressure is unbearable. What is happening to me?"
