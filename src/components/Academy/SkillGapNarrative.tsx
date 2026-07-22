import React from 'react';
import './SkillGapNarrative.css';
import { ShieldCheck, ArrowRight, Lightbulb, TrendingUp, CheckCircle, Clock, Info } from 'lucide-react';

export interface SkillGapData {
  reassurance: string;
  strengths: string[];
  transferable: { skill: string; reason: string }[];
  stages: {
    name: string;
    description: string;
    priority: 'Essential' | 'Can Wait' | 'Optional';
  }[];
  summary: string;
}

interface Props {
  data: SkillGapData;
  onContinue: () => void;
}

export const SkillGapNarrative: React.FC<Props> = ({ data, onContinue }) => {
  return (
    <div className="gap-container fade-in">
      <div className="gap-header">
        <h2>Your Transition Brief</h2>
        <p>Before we build your roadmap, let's look at exactly what it takes to get there.</p>
      </div>

      <div className="gap-content">
        {/* Section 1: Reassurance & Strengths */}
        <div className="gap-section highlight-section">
          <div className="section-title">
            <ShieldCheck size={24} className="icon-success" />
            <h3>You're Not Starting from Zero</h3>
          </div>
          <p className="narrative-text">{data.reassurance}</p>
          <div className="strengths-tags">
            {data.strengths.map((strength, i) => (
              <span key={i} className="strength-tag">{strength}</span>
            ))}
          </div>
        </div>

        {/* Section 2: What Transfers */}
        <div className="gap-section">
          <div className="section-title">
            <TrendingUp size={24} className="icon-primary" />
            <h3>What Already Transfers</h3>
          </div>
          <div className="transferable-list">
            {data.transferable.map((item, i) => (
              <div key={i} className="transfer-card">
                <h4>{item.skill}</h4>
                <p>{item.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3 & 4 & 5: The Skill Gap Stages & Prioritization */}
        <div className="gap-section">
          <div className="section-title">
            <Lightbulb size={24} className="icon-warning" />
            <h3>The Missing Pieces</h3>
          </div>
          <p className="narrative-text">Here is what we need to build, grouped by what matters most.</p>
          
          <div className="stages-timeline">
            {data.stages.map((stage, i) => (
              <div key={i} className={`stage-card priority-${stage.priority.toLowerCase().replace(' ', '-')}`}>
                <div className="stage-header">
                  <h4>{stage.name}</h4>
                  <span className={`priority-badge ${stage.priority.toLowerCase().replace(' ', '-')}`}>
                    {stage.priority === 'Essential' && <CheckCircle size={14} />}
                    {stage.priority === 'Can Wait' && <Clock size={14} />}
                    {stage.priority === 'Optional' && <Info size={14} />}
                    {stage.priority}
                  </span>
                </div>
                <p className="stage-desc">{stage.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Summary */}
        <div className="gap-section summary-section">
          <p className="narrative-text final-summary">{data.summary}</p>
        </div>

      </div>

      <div className="gap-footer">
        <button className="btn btn-primary cta-btn" onClick={onContinue}>
          Build My Personalized Roadmap <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};
