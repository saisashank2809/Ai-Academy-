import React from 'react';
import { Bot, Clock, Target, CheckCircle2 } from 'lucide-react';
import './AssessmentLanding.css';

interface Props {
  onStart: () => void;
  onSkipToChat?: () => void;
  onSkipToSummary?: () => void;
}

export const AssessmentLanding: React.FC<Props> = ({ onStart, onSkipToChat, onSkipToSummary }) => {
  return (
    <div className="landing-container fade-in">
      <div className="landing-card">
        <h1 className="title">Ottobon AI Readiness Assessment</h1>
        <p className="subtitle">Understand how AI will transform your career and discover your personalized path forward.</p>
        
        <div className="features-grid">
          <div className="feature-item">
            <Clock size={20} className="feature-icon" />
            <span>15-20 Minutes</span>
          </div>
          <div className="feature-item">
            <CheckCircle2 size={20} className="feature-icon" />
            <span>Personalized</span>
          </div>
          <div className="feature-item">
            <Target size={20} className="feature-icon" />
            <span>Role Specific</span>
          </div>
          <div className="feature-item">
            <Bot size={20} className="feature-icon" />
            <span>AI Evaluated</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <button className="btn btn-primary start-btn" onClick={onStart}>
            Start Assessment
          </button>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            {onSkipToChat && (
              <button 
                className="btn" 
                onClick={onSkipToChat}
                style={{ fontSize: '0.9rem', padding: '0.5rem 1rem', background: '#e2e8f0', color: '#475569', border: 'none' }}
              >
                [DEV] Skip to Chat
              </button>
            )}
            {onSkipToSummary && (
              <button 
                className="btn" 
                onClick={onSkipToSummary}
                style={{ fontSize: '0.9rem', padding: '0.5rem 1rem', background: '#e2e8f0', color: '#475569', border: 'none' }}
              >
                [DEV] Skip to Summary
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
