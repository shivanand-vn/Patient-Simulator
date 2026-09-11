import React from 'react';
import { 
  Volume2, 
  VolumeX, 
  Pause, 
  Play, 
  Square, 
  RotateCcw, 
  AlertCircle,
  User,
  Stethoscope
} from 'lucide-react';
import { ConversationMessage } from '../../services/conversation/types';

interface DialogueBubbleProps {
  message: ConversationMessage;
  isSpeaking: boolean;
  isPaused: boolean;
  isMuted: boolean;
  onPlay: (messageId: string) => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export const DialogueBubble: React.FC<DialogueBubbleProps> = ({
  message,
  isSpeaking,
  isPaused,
  isMuted,
  onPlay,
  onPause,
  onResume,
  onStop
}) => {
  // System messages (language change, scenario status, alerts)
  if (message.role === 'system') {
    return (
      <div className="flex justify-center my-1.5 animate-fadeIn">
        <div className="p-2.5 px-3.5 bg-surface-container-low border border-surface-container rounded-xl text-[11px] text-outline max-w-lg flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-3.5 h-3.5 text-primary shrink-0" />
          <span>{message.text}</span>
        </div>
      </div>
    );
  }

  // Student (Doctor) message - Right aligned
  if (message.role === 'student') {
    return (
      <div className="flex flex-col items-end my-1 animate-fadeIn">
        <div className="max-w-[85%] sm:max-w-md rounded-2xl rounded-br-xs px-4 py-3 bg-primary text-on-primary text-xs leading-relaxed shadow-sm">
          <div className="flex items-center justify-between gap-3 text-[10px] text-on-primary/80 font-semibold mb-1">
            <span className="flex items-center gap-1">
              <Stethoscope className="w-3 h-3" />
              STUDENT (You)
            </span>
            <span className="font-mono text-[9px] opacity-70">{message.timestamp}</span>
          </div>
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>
      </div>
    );
  }

  // Patient message - Left aligned with speech controls
  return (
    <div className="flex flex-col items-start my-1.5 animate-fadeIn">
      <div className="max-w-[88%] sm:max-w-lg rounded-2xl rounded-bl-xs px-4 py-3.5 bg-surface-container-lowest border border-surface-container/90 text-on-surface text-xs leading-relaxed shadow-sm transition-all hover:border-primary/30">
        
        {/* Header: Identity, Time, and Live Speaking Telemetry */}
        <div className="flex items-center justify-between gap-2 text-[10px] pb-2 mb-2 border-b border-surface-container/60">
          <div className="flex items-center gap-1.5 font-bold text-on-surface">
            <div className="w-4 h-4 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-primary">
              <User className="w-2.5 h-2.5" />
            </div>
            <span>PATIENT</span>
            <span className="text-outline font-normal">• Robert Henderson</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Speaking State Indicator */}
            {isSpeaking && !isPaused && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold animate-pulse">
                <Volume2 className="w-3 h-3 text-emerald-600 animate-bounce" />
                <span>Speaking...</span>
              </span>
            )}

            {isSpeaking && isPaused && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-semibold">
                <Pause className="w-2.5 h-2.5" />
                <span>Paused</span>
              </span>
            )}

            <span className="font-mono text-[9px] text-outline">{message.timestamp}</span>
          </div>
        </div>

        {/* Spoken Text (Always remains visible!) */}
        <p className="text-on-surface text-xs leading-relaxed mb-3 whitespace-pre-wrap">
          {message.text}
        </p>

        {/* Patient Audio / Speaking Controls */}
        <div className="pt-2 border-t border-surface-container/40 flex items-center justify-between gap-2 text-[11px]">
          {isSpeaking ? (
            /* Active Speech Controls: Pause/Resume + Stop */
            <div className="flex items-center gap-1.5">
              {isPaused ? (
                <button
                  type="button"
                  onClick={onResume}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-primary border border-teal-200 font-semibold transition-colors"
                  title="Resume patient speech"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Resume</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onPause}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold transition-colors"
                  title="Pause patient speech"
                >
                  <Pause className="w-3 h-3" />
                  <span>Pause</span>
                </button>
              )}

              <button
                type="button"
                onClick={onStop}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold transition-colors"
                title="Stop patient speech"
              >
                <Square className="w-2.5 h-2.5 fill-current" />
                <span>Stop</span>
              </button>
            </div>
          ) : (
            /* Inactive / Finished Speech: Replay Button */
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onPlay(message.id)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-teal-50 hover:text-primary hover:border-teal-200 text-outline border border-surface-container font-medium transition-all"
                title={isMuted ? 'Patient voice is muted (click to unmute and play)' : 'Replay patient response'}
              >
                {message.speechStatus === 'played' ? (
                  <RotateCcw className="w-3 h-3" />
                ) : (
                  <Volume2 className="w-3 h-3" />
                )}
                <span>{message.speechStatus === 'played' ? 'Replay' : 'Play Voice'}</span>
              </button>

              {isMuted && (
                <span className="text-[10px] text-outline flex items-center gap-0.5">
                  <VolumeX className="w-3 h-3 text-outline/70" />
                  Muted
                </span>
              )}
            </div>
          )}

          {/* Audio Wave Visualizer Animation during speech */}
          {isSpeaking && !isPaused && (
            <div className="flex items-center gap-0.5 h-3 pr-1" title="Voice waveform active">
              <span className="w-0.5 h-2.5 bg-primary animate-[pulse_0.6s_ease-in-out_infinite]"></span>
              <span className="w-0.5 h-3.5 bg-primary animate-[pulse_0.4s_ease-in-out_infinite_0.1s]"></span>
              <span className="w-0.5 h-2 bg-primary animate-[pulse_0.7s_ease-in-out_infinite_0.2s]"></span>
              <span className="w-0.5 h-3 bg-primary animate-[pulse_0.5s_ease-in-out_infinite_0.15s]"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DialogueBubble;
