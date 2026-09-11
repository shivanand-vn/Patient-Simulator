import { 
  IConversationService, 
  IPatientResponseService, 
  StudentInput, 
  ConversationContext, 
  PatientResponse 
} from './types';
import { mockPatientService } from './mockPatientService';

/**
 * Conversation Service Orchestrator
 * 
 * Central coordinator for student messages and patient responses.
 * Implements architectural inversion of control: UI components communicate
 * strictly through this service, which delegates to an IPatientResponseService.
 * 
 * FUTURE INTEGRATION:
 * To connect to the real LLM/FastAPI backend:
 *   conversationService.setResponseService(new ApiPatientService());
 * No UI components will need modification.
 */
export class ConversationService implements IConversationService {
  private responseService: IPatientResponseService;

  constructor(initialService: IPatientResponseService = mockPatientService) {
    this.responseService = initialService;
  }

  /**
   * Set or swap the underlying patient response engine (Mock vs API/LLM).
   */
  public setResponseService(service: IPatientResponseService): void {
    this.responseService = service;
  }

  /**
   * Get current active patient response service.
   */
  public getResponseService(): IPatientResponseService {
    return this.responseService;
  }

  /**
   * Sends a student input message (text or voice) to the conversation engine.
   */
  public async sendMessage(
    input: StudentInput,
    context: ConversationContext
  ): Promise<PatientResponse> {
    if (!input.text || !input.text.trim()) {
      throw new Error('Student message cannot be empty.');
    }

    try {
      return await this.responseService.generateResponse(input, context);
    } catch (err) {
      console.error('[ConversationService] Error generating patient response:', err);
      throw new Error(
        err instanceof Error 
          ? err.message 
          : 'Unable to communicate with patient simulator at this time.'
      );
    }
  }
}

// Export singleton orchestrator
export const conversationService: IConversationService = new ConversationService();
export default conversationService;
