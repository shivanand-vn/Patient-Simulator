import { 
  IPatientResponseService, 
  StudentInput, 
  ConversationContext, 
  PatientResponse 
} from './types';

/**
 * ============================================================================
 * TEMPORARY DEVELOPMENT MOCK PATIENT SERVICE
 * ============================================================================
 * 
 * This service returns deterministic, rule-matched clinical responses for development.
 * It simulates a 58-year-old male presenting with acute retrosternal chest pain
 * (Robert Henderson, Case ID: SIM-8842-AX).
 * 
 * ARCHITECTURE NOTICE FOR FUTURE INTEGRATION:
 * When the backend LLM and Clinical Simulation Orchestrator (FastAPI) are ready,
 * replace this with an `ApiPatientService` implementing `IPatientResponseService`.
 * The UI and `conversationService` abstractions will remain completely unchanged.
 * ============================================================================
 */
export class MockPatientService implements IPatientResponseService {
  /**
   * Generates a mock patient response based on input keywords and active simulation language.
   */
  public async generateResponse(
    input: StudentInput,
    context: ConversationContext
  ): Promise<PatientResponse> {
    // Brief simulated delay (350ms) to allow the loading state to render cleanly
    await new Promise((resolve) => setTimeout(resolve, 350));

    const normalizedQuery = input.text.trim().toLowerCase();
    const lang = context.language || 'en';

    let responseText = '';

    if (lang === 'kn') {
      responseText = this.matchKannadaResponse(normalizedQuery);
    } else if (lang === 'hi') {
      responseText = this.matchHindiResponse(normalizedQuery);
    } else {
      responseText = this.matchEnglishResponse(normalizedQuery);
    }

    return {
      text: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMock: true,
      clinicalNotes: 'Development mock rule-matched response'
    };
  }

  /**
   * Matches English student questions to clinical patient responses.
   */
  private matchEnglishResponse(query: string): string {
    // Pain location & radiation
    if (
      query.includes('where') && (query.includes('pain') || query.includes('start') || query.includes('feel') || query.includes('hurt')) ||
      query.includes('location') || query.includes('radiat') || query.includes('spread')
    ) {
      return 'It starts in the middle of my chest and sometimes moves toward my left arm.';
    }

    // Pain onset & duration
    if (
      query.includes('how long') || query.includes('when did') || query.includes('duration') || 
      query.includes('started') || query.includes('time')
    ) {
      return 'It started about two hours ago.';
    }

    // Aggravating factors
    if (
      query.includes('worse') || query.includes('aggravat') || query.includes('trigger') || 
      query.includes('increase') || query.includes('exert')
    ) {
      return 'It gets worse when I walk or exert myself.';
    }

    // Relieving factors
    if (query.includes('better') || query.includes('reliev') || query.includes('ease') || query.includes('rest')) {
      return 'Sitting down helps slightly, but the heavy pressure never completely goes away.';
    }

    // Severity / Scale
    if (query.includes('rate') || query.includes('1 to 10') || query.includes('scale') || query.includes('severe') || query.includes('severity')) {
      return "It feels like an 8 out of 10 right now. It's really uncomfortable.";
    }

    // Character / Quality of pain
    if (query.includes('describe') || query.includes('feel like') || query.includes('sharp') || query.includes('dull') || query.includes('pressure') || query.includes('crushing')) {
      return 'It feels like an intense heavy weight or crushing pressure right on my sternum.';
    }

    // Associated symptoms
    if (query.includes('breath') || query.includes('sweat') || query.includes('nause') || query.includes('dizz') || query.includes('other symptoms')) {
      return "I feel quite short of breath, a bit lightheaded, and I've broken out into a cold sweat.";
    }

    // Medications
    if (query.includes('medicat') || query.includes('medicine') || query.includes('pills') || query.includes('drug') || query.includes('take')) {
      return 'I take Amlodipine 5mg once a day for high blood pressure. I took it this morning as usual.';
    }

    // Allergies
    if (query.includes('allerg')) {
      return 'I have an allergy to Penicillin—it gave me a bad rash and hives a few years back.';
    }

    // Past medical history
    if (query.includes('history') || query.includes('heart attack') || query.includes('previous') || query.includes('past')) {
      return "I haven't had a heart attack before, but I have hypertension and I've smoked for thirty years.";
    }

    // General greeting
    if (query.startsWith('hello') || query.startsWith('hi') || query.startsWith('good morning') || query.startsWith('good afternoon')) {
      return 'Hello doctor. Thank you for seeing me quickly, this chest discomfort is really worrying me.';
    }

    // Unknown question fallback (as specified in guidelines)
    return "I'm not sure how to answer that right now. This is a development mock response.";
  }

  /**
   * Matches Kannada student questions or fallback.
   */
  private matchKannadaResponse(query: string): string {
    if (query.includes('ನೋವು') || query.includes('ಎದೆ') || query.includes('pain') || query.includes('start')) {
      return 'ನನ್ನ ಎದೆಯ ಮಧ್ಯಭಾಗದಲ್ಲಿ ತೀವ್ರವಾದ ಭಾರ ಮತ್ತು ನೋವು ಇದೆ, ಅದು ಎಡಗೈ ಕಡೆಗೆ ಹರಡುತ್ತಿದೆ.';
    }
    if (query.includes('ಯಾವಾಗ') || query.includes('ಎಷ್ಟು ಹೊತ್ತು') || query.includes('time') || query.includes('duration')) {
      return 'ಇದು ಸುಮಾರು ಎರಡು ಗಂಟೆಗಳ ಹಿಂದೆ ಪ್ರಾರಂಭವಾಯಿತು ಡಾಕ್ಟರ್.';
    }
    if (query.includes('ಜಾಸ್ತಿ') || query.includes('ಹೆಚ್ಚು') || query.includes('worse')) {
      return 'ನಾನು ನಡೆದಾಡಿದಾಗ ಅಥವಾ ಮೆಟ್ಟಿಲು ಹತ್ತಿದಾಗ ನೋವು ಇನ್ನಷ್ಟು ಉಲ್ಬಣಗೊಳ್ಳುತ್ತದೆ.';
    }
    return "ನನಗೆ ಸದ್ಯಕ್ಕೆ ಇದಕ್ಕೆ ಹೇಗೆ ಉತ್ತರಿಸಬೇಕೆಂದು ತಿಳಿಯುತ್ತಿಲ್ಲ. ಇದು ಡೆವಲಪ್‌ಮೆಂಟ್ ಮಾಕ್ ಪ್ರತಿಕ್ರಿಯೆ.";
  }

  /**
   * Matches Hindi student questions or fallback.
   */
  private matchHindiResponse(query: string): string {
    if (query.includes('दर्द') || query.includes('कहाँ') || query.includes('pain') || query.includes('start')) {
      return 'दर्द मेरे सीने के बीच में शुरू होता है और कभी-कभी बाएं हाथ की तरफ जाता है।';
    }
    if (query.includes('कब') || query.includes('कितनी देर') || query.includes('time') || query.includes('duration')) {
      return 'यह दर्द लगभग दो घंटे पहले शुरू हुआ था डॉक्टर साहब।';
    }
    if (query.includes('ज्यादा') || query.includes('बढ़ता') || query.includes('worse')) {
      return 'जब मैं चलता हूँ या थोड़ा भी ज़ोर लगाता हूँ, तो यह और बढ़ जाता है।';
    }
    return 'मुझे अभी इसका जवाब कैसे देना है समझ नहीं आ रहा। यह एक डेवलपमेंट मॉक प्रतिक्रिया है।';
  }
}

// Export default singleton
export const mockPatientService = new MockPatientService();
export default mockPatientService;
