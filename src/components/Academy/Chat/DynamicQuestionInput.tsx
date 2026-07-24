import React, { useState } from 'react';
import { Send } from 'lucide-react';
import type { QuestionMetadata } from '../../../types/academy';

interface Props {
  metadata?: QuestionMetadata;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

export const DynamicQuestionInput: React.FC<Props> = ({ metadata, onSubmit, disabled }) => {
  const [textValue, setTextValue] = useState('');
  const [selectedMulti, setSelectedMulti] = useState<string[]>([]);
  const [showOtherInput, setShowOtherInput] = useState(false);

  // If no metadata, fallback to a standard text input
  const type = metadata?.type || 'text';
  let options: string[] = [];
  if (Array.isArray(metadata?.options)) {
    options = metadata.options;
  } else if (typeof metadata?.options === 'string' && (metadata.options as any).trim()) {
    options = (metadata.options as any).split(',').map((o: string) => o.trim());
  }
  const allowOther = metadata?.allowOther || false;

  const handleSingleSelect = (option: string) => {
    if (option === 'Other') {
      setShowOtherInput(true);
    } else {
      onSubmit(option);
    }
  };

  const toggleMultiSelect = (option: string) => {
    if (option === 'Other') {
      setShowOtherInput(true);
      return;
    }
    
    setSelectedMulti(prev => 
      prev.includes(option) 
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  const submitMultiSelect = () => {
    if (selectedMulti.length > 0) {
      onSubmit(selectedMulti.join(', '));
    }
  };

  const submitText = (e: React.FormEvent) => {
    e.preventDefault();
    if (textValue.trim()) {
      onSubmit(textValue.trim());
      setTextValue('');
      setShowOtherInput(false);
    }
  };

  if (type === 'single-select' && !showOtherInput) {
    return (
      <div className="flex flex-wrap gap-3 mt-4 opacity-0 animate-slide-up-fade">
        {options.map((opt, idx) => (
          <button 
            type="button"
            key={idx} 
            className="bg-slate-800/80 border border-slate-700/50 rounded-lg py-2.5 px-5 transition-all text-slate-300 font-medium hover:not(:disabled):bg-indigo-600 hover:not(:disabled):border-indigo-500 hover:not(:disabled):text-white disabled:opacity-50" 
            onClick={() => handleSingleSelect(opt)}
            disabled={disabled}
          >
            {opt}
          </button>
        ))}
        {allowOther && (
          <button 
            type="button"
            className="bg-transparent border border-dashed border-slate-600 rounded-lg py-2.5 px-5 transition-all text-slate-400 font-medium hover:not(:disabled):bg-slate-800 hover:not(:disabled):border-slate-500 hover:not(:disabled):text-white disabled:opacity-50" 
            onClick={() => handleSingleSelect('Other')}
            disabled={disabled}
          >
            Other
          </button>
        )}
      </div>
    );
  }

  if (type === 'multi-select' && !showOtherInput) {
    return (
      <div className="flex flex-col items-start gap-4 mt-4 opacity-0 animate-slide-up-fade">
        <div className="flex flex-wrap gap-2.5">
          {options.map((opt, idx) => (
            <button 
              type="button"
              key={idx} 
              className={`border rounded-lg py-2 px-4 cursor-pointer transition-all text-[0.95rem] disabled:opacity-50 ${
                selectedMulti.includes(opt) 
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-medium' 
                  : 'bg-slate-800/80 border-slate-700/50 text-slate-300 hover:not(:disabled):border-slate-500'
              }`}
              onClick={() => toggleMultiSelect(opt)}
              disabled={disabled}
            >
              {opt}
            </button>
          ))}
          {allowOther && (
            <button 
              type="button"
              className="bg-transparent border border-dashed border-slate-600 rounded-lg py-2 px-4 transition-all text-[0.95rem] text-slate-400 hover:not(:disabled):border-slate-500 disabled:opacity-50" 
              onClick={() => toggleMultiSelect('Other')}
              disabled={disabled}
            >
              Other
            </button>
          )}
        </div>
        {selectedMulti.length > 0 && (
          <button 
            type="button" 
            className="self-end bg-indigo-600 text-white font-semibold py-2.5 px-5 rounded-lg border border-indigo-500 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20" 
            onClick={submitMultiSelect}
          >
            Submit Selected
          </button>
        )}
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <form className="flex gap-3 mt-4 items-end opacity-0 animate-slide-up-fade w-full" onSubmit={submitText}>
        <textarea 
          className="resize-none rounded-lg w-full bg-slate-900 border border-slate-700 px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/20 transition-all disabled:opacity-50 placeholder-slate-500" 
          value={textValue}
          onChange={e => setTextValue(e.target.value)}
          placeholder={metadata?.placeholder || "Type your answer..."}
          disabled={disabled}
          rows={3}
        />
        <button 
          type="submit" 
          className="flex items-center justify-center p-3 rounded-lg aspect-square bg-indigo-600 text-white hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:hover:bg-indigo-600" 
          disabled={!textValue.trim() || disabled}
        >
          <Send size={18} />
        </button>
      </form>
    );
  }

  // Fallback / Text input / "Other" input
  return (
    <form className="flex gap-3 mt-4 items-end opacity-0 animate-slide-up-fade w-full" onSubmit={submitText}>
      <input 
        type="text" 
        className="rounded-lg w-full bg-slate-900 border border-slate-700 px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/20 transition-all disabled:opacity-50 placeholder-slate-500" 
        value={textValue}
        onChange={e => setTextValue(e.target.value)}
        placeholder={metadata?.placeholder || (showOtherInput ? "Please specify..." : "Type your answer...")}
        disabled={disabled}
        autoFocus={showOtherInput}
      />
      <button 
        type="submit" 
        className="flex items-center justify-center p-3 rounded-lg aspect-square bg-indigo-600 text-white hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:hover:bg-indigo-600" 
        disabled={!textValue.trim() || disabled}
      >
        <Send size={18} />
      </button>
      {showOtherInput && (
        <button 
          type="button" 
          className="px-5 py-3 border-transparent hover:bg-slate-800 transition-all rounded-lg text-slate-400 font-medium" 
          onClick={() => setShowOtherInput(false)}
        >
          Cancel
        </button>
      )}
    </form>
  );
};
