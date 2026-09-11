import React, { useState } from 'react';
import { Send, Mic, Loader2 } from 'lucide-react';

interface DialogueInputProps {
  placeholder?: string;
  isProcessing: boolean;
  onSend: (text: string) => void;
  onVoiceRecordClick?: () => void;
  disabled?: boolean;
}

export const DialogueInput: React.FC<DialogueInputProps> = ({
  placeholder = 'Type your clinical question...',
  isProcessing,
  onSend,
  onVoiceRecordClick,
  disabled = false
}) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isProcessing || disabled) return;

    onSend(trimmed);
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Loading state indicator above input bar */}
      {isProcessing && (
        <div className="flex items-center gap-2 px-3 py-1 text-xs text-primary font-medium animate-pulse">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Patient is responding...</span>
        </div>
      )}

      {/* Input controls form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 pt-2 border-t border-surface-container"
      >
        {/* Future STT Voice Input Button */}
        <button
          type="button"
          onClick={onVoiceRecordClick}
          disabled={isProcessing || disabled}
          title="Dictate with voice (Voice STT preparation)"
          className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          <Mic className="w-4 h-4 text-primary" />
        </button>

        {/* Question Text Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing || disabled}
            placeholder={isProcessing ? 'Patient is responding...' : placeholder}
            className="w-full px-4 py-2.5 bg-surface-container-low/70 border border-surface-container rounded-xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!text.trim() || isProcessing || disabled}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs transition-colors shrink-0 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          title={isProcessing ? 'Processing...' : 'Send question'}
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};

export default DialogueInput;
