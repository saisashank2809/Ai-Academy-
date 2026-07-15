import React, { useState } from 'react';
import { Send } from 'lucide-react';
import type { QuestionMetadata } from '../../../types/academy';
import './DynamicQuestionInput.css';

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
      <div className="options-grid fade-in">
        {options.map((opt, idx) => (
          <button 
            type="button"
            key={idx} 
            className="btn option-btn" 
            onClick={() => handleSingleSelect(opt)}
            disabled={disabled}
          >
            {opt}
          </button>
        ))}
        {allowOther && (
          <button 
            type="button"
            className="btn option-btn other-btn" 
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
      <div className="multi-select-container fade-in">
        <div className="chips-container">
          {options.map((opt, idx) => (
            <button 
              type="button"
              key={idx} 
              className={`chip ${selectedMulti.includes(opt) ? 'selected' : ''}`}
              onClick={() => toggleMultiSelect(opt)}
              disabled={disabled}
            >
              {opt}
            </button>
          ))}
          {allowOther && (
            <button 
              type="button"
              className="chip other-chip" 
              onClick={() => toggleMultiSelect('Other')}
              disabled={disabled}
            >
              Other
            </button>
          )}
        </div>
        {selectedMulti.length > 0 && (
          <button type="button" className="btn btn-primary submit-multi-btn" onClick={submitMultiSelect}>
            Submit Selected
          </button>
        )}
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <form className="input-form fade-in" onSubmit={submitText}>
        <textarea 
          className="input-field textarea-field" 
          value={textValue}
          onChange={e => setTextValue(e.target.value)}
          placeholder={metadata?.placeholder || "Type your answer..."}
          disabled={disabled}
          rows={3}
        />
        <button type="submit" className="btn btn-primary send-btn" disabled={!textValue.trim() || disabled}>
          <Send size={18} />
        </button>
      </form>
    );
  }

  // Fallback / Text input / "Other" input
  return (
    <form className="input-form fade-in" onSubmit={submitText}>
      <input 
        type="text" 
        className="input-field" 
        value={textValue}
        onChange={e => setTextValue(e.target.value)}
        placeholder={metadata?.placeholder || (showOtherInput ? "Please specify..." : "Type your answer...")}
        disabled={disabled}
        autoFocus={showOtherInput}
      />
      <button type="submit" className="btn btn-primary send-btn" disabled={!textValue.trim() || disabled}>
        <Send size={18} />
      </button>
      {showOtherInput && (
        <button type="button" className="btn cancel-btn" onClick={() => setShowOtherInput(false)}>
          Cancel
        </button>
      )}
    </form>
  );
};
