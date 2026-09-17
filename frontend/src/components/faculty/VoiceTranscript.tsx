import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, MessageSquare } from 'lucide-react';

interface TranscriptItem {
  id: string;
  sender: 'Nurse (Student)' | 'Patient (AI)';
  text: string;
  timestamp: string;
}

interface VoiceTranscriptProps {
  caseTitle?: string;
  patientName?: string;
}

/**
 * Voice Interaction & Live Transcript Component
 * Uses Browser Web Speech API for voice recognition during clinical assessment.
 */
export const VoiceTranscript: React.FC<VoiceTranscriptProps> = ({
  caseTitle = 'Acute Anterior STEMI',
  patientName = 'Ramesh Gowda (58M)',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([
    {
      id: '1',
      sender: 'Nurse (Student)',
      text: 'Good morning, Mr. Ramesh. What brings you to the emergency room today?',
      timestamp: '10:15:02 AM',
    },
    {
      id: '2',
      sender: 'Patient (AI)',
      text: 'Doctor, I have severe crushing chest pain since 2 hours. It feels like a heavy weight on my chest and is radiating to my left arm.',
      timestamp: '10:15:08 AM',
    },
  ]);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API if supported by browser
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalSentence = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalSentence += transcript;
          } else {
            currentInterim += transcript;
          }
        }

        if (currentInterim) {
          setInterimText(currentInterim);
        }

        if (finalSentence.trim()) {
          const newMsg: TranscriptItem = {
            id: Date.now().toString(),
            sender: 'Nurse (Student)',
            text: finalSentence.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          };

          setTranscripts((prev) => [...prev, newMsg]);
          setInterimText('');

          // Simulate AI Patient response based on clinical case context
          simulateAiPatientResponse(finalSentence.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [caseTitle]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      // Fallback if browser doesn't support Web Speech API
      alert('Speech Recognition API is not supported in this browser. You can type or simulate voice input below.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const simulateAiPatientResponse = (questionText: string) => {
    let aiReply = "Doctor, I am feeling very uncomfortable and anxious about this pain.";
    const lower = questionText.toLowerCase();

    if (lower.includes('pain') || lower.includes('chest') || lower.includes('where')) {
      aiReply = "The pain is right in the center of my chest, 8/10 intensity, squeezing type.";
    } else if (lower.includes('sweat') || lower.includes('nausea') || lower.includes('breath')) {
      aiReply = "Yes, I am sweating heavily and feeling slightly short of breath.";
    } else if (lower.includes('history') || lower.includes('bp') || lower.includes('sugar') || lower.includes('diabetes')) {
      aiReply = "I have hypertension for 5 years and I take regular medications.";
    } else if (lower.includes('bp') || lower.includes('pulse') || lower.includes('vitals')) {
      aiReply = "Nurse is taking my blood pressure right now.";
    }

    setTimeout(() => {
      setTranscripts((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'Patient (AI)',
          text: aiReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  const addManualPrompt = (presetText: string) => {
    const newMsg: TranscriptItem = {
      id: Date.now().toString(),
      sender: 'Nurse (Student)',
      text: presetText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setTranscripts((prev) => [...prev, newMsg]);
    simulateAiPatientResponse(presetText);
  };

  return (
    <div className="bg-surface-container-lowest border border-surface-container rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
      {/* Component Header */}
      <div className="flex items-center justify-between border-b border-surface-container pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-on-surface font-headline">
              Voice Speech-to-Text & Clinical Dialogue
            </h3>
            <p className="text-[11px] text-outline font-medium">
              Real-time voice capture during Nurse (Student)-patient interaction ({patientName})
            </p>
          </div>
        </div>

        {/* Microphone Toggle Button */}
        <button
          type="button"
          onClick={toggleListening}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs ${
            isListening
              ? 'bg-red-600 text-white animate-pulse'
              : 'bg-primary text-on-primary hover:bg-primary-hover'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-3.5 h-3.5" />
              <span>Recording... (Click to Stop)</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5" />
              <span>Start Voice Capture</span>
            </>
          )}
        </button>
      </div>

      {/* Interim Live Speech Bar */}
      {isListening && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping shrink-0" />
          <span>Listening: </span>
          <span className="font-semibold italic text-red-900">
            {interimText || 'Speak into your microphone...'}
          </span>
        </div>
      )}

      {/* Transcript Log Window */}
      <div className="bg-surface-container-low/60 border border-surface-container/80 rounded-xl p-4 max-h-64 overflow-y-auto flex flex-col gap-3">
        {transcripts.length === 0 ? (
          <p className="text-xs text-outline text-center py-6">
            No dialogue recorded yet. Click "Start Voice Capture" or use quick prompts.
          </p>
        ) : (
          transcripts.map((t) => (
            <div
              key={t.id}
              className={`flex flex-col gap-1 p-3 rounded-xl text-xs ${
                t.sender === 'Nurse (Student)'
                  ? 'bg-primary-container/40 text-on-primary-container border border-primary-container/60 self-start max-w-[85%]'
                  : 'bg-teal-50 border border-teal-200 text-teal-900 self-end max-w-[85%]'
              }`}
            >
              <div className="flex items-center justify-between gap-4 font-bold text-[11px] text-outline">
                <span className="flex items-center gap-1.5">
                  {t.sender === 'Nurse (Student)' ? (
                    <MessageSquare className="w-3 h-3 text-primary" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-teal-600" />
                  )}
                  {t.sender}
                </span>
                <span className="text-[10px] font-mono">{t.timestamp}</span>
              </div>
              <p className="text-xs leading-relaxed font-medium mt-0.5">{t.text}</p>
            </div>
          ))
        )}
      </div>

      {/* Quick Interactive Speech Simulation Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-[11px] font-semibold text-outline uppercase tracking-wider">
          Quick Dialogue Options:
        </span>
        <button
          onClick={() => addManualPrompt('Can you describe the location and radiation of your chest pain?')}
          className="px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-medium border border-surface-container transition-colors"
        >
          "Describe pain location"
        </button>
        <button
          onClick={() => addManualPrompt('Do you have a history of diabetes or high blood pressure?')}
          className="px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-medium border border-surface-container transition-colors"
        >
          "Ask medical history"
        </button>
        <button
          onClick={() => addManualPrompt('Let us check your vital signs right now.')}
          className="px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-medium border border-surface-container transition-colors"
        >
          "Check vital signs"
        </button>
      </div>
    </div>
  );
};
