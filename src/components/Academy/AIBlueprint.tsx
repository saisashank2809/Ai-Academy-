import React from 'react';
import './AIBlueprint.css';
import { Target, CheckCircle, Code, Layers, ShieldCheck, Briefcase, ChevronRight, Zap } from 'lucide-react';

export interface AIBlueprintData {
  summary: {
    trackTitle: string;
    strengths: string[];
    learningPriorities: string[];
    projectFocus: string;
    transitionStrategy: string;
    closingStatement: string;
  };
  phases: {
    phaseNumber: number;
    title: string;
    objective: string;
    whyItMatters: string;
    topics: string[];
    deliverables: string[];
    milestone: string;
    expectedOutcome: string;
  }[];
  optionalTopics: string[];
}

interface Props {
  data: AIBlueprintData;
}

export const AIBlueprint: React.FC<Props> = ({ data }) => {
  const getPhaseIcon = (num: number) => {
    switch (num) {
      case 1: return <Layers size={24} />;
      case 2: return <Code size={24} />;
      case 3: return <Zap size={24} />;
      case 4: return <ShieldCheck size={24} />;
      case 5: return <Briefcase size={24} />;
      case 6: return <Target size={24} />;
      default: return <ChevronRight size={24} />;
    }
  };

  return (
    <div className="blueprint-container fade-in">
      {/* Header / Top Level Summary */}
      <div className="blueprint-header">
        <h1>Your Personalized AI Blueprint</h1>
        <div className="blueprint-badge">{data.summary.trackTitle}</div>
      </div>

      <div className="blueprint-summary-card">
        <div className="summary-section">
          <h3>Your Transition Strategy</h3>
          <p>{data.summary.transitionStrategy}</p>
        </div>
        <div className="summary-grid">
          <div>
            <h4>Existing Strengths</h4>
            <ul>
              {data.summary.strengths.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div>
            <h4>Learning Priorities</h4>
            <ul>
              {data.summary.learningPriorities.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
        </div>
        <div className="summary-section">
          <h4>Project Focus</h4>
          <p>{data.summary.projectFocus}</p>
        </div>
      </div>

      {/* The 6 Phases Timeline */}
      <div className="blueprint-timeline">
        {data.phases.map((phase, idx) => (
          <div key={idx} className="phase-card">
            <div className="phase-indicator">
              <div className="phase-number">{phase.phaseNumber}</div>
              {idx !== data.phases.length - 1 && <div className="phase-line"></div>}
            </div>
            
            <div className="phase-content">
              <div className="phase-header">
                <div className="phase-icon">{getPhaseIcon(phase.phaseNumber)}</div>
                <div>
                  <span className="phase-label">Phase {phase.phaseNumber}</span>
                  <h2>{phase.title}</h2>
                </div>
              </div>

              <div className="phase-objective">
                <strong>Objective:</strong> {phase.objective}
              </div>
              
              <div className="phase-matters">
                <strong>Why this matters:</strong> {phase.whyItMatters}
              </div>

              <div className="phase-details-grid">
                <div className="details-col">
                  <h4>Topics to Learn</h4>
                  <div className="tag-cloud">
                    {phase.topics.map((topic, i) => (
                      <span key={i} className="bp-tag">{topic}</span>
                    ))}
                  </div>
                </div>
                <div className="details-col">
                  <h4>Hands-on Deliverables</h4>
                  <ul className="deliverables-list">
                    {phase.deliverables.map((del, i) => (
                      <li key={i}><CheckCircle size={14} className="check-icon" /> {del}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="phase-footer">
                <div className="milestone">
                  <strong>Milestone:</strong> {phase.milestone}
                </div>
                <div className="outcome">
                  <strong>Outcome:</strong> {phase.expectedOutcome}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Optional Learning */}
      {data.optionalTopics && data.optionalTopics.length > 0 && (
        <div className="optional-learning-card">
          <h3>Optional Advanced Topics</h3>
          <p>These are powerful concepts, but they should not block your employability. Explore these only after securing your foundation.</p>
          <div className="tag-cloud">
            {data.optionalTopics.map((topic, i) => (
              <span key={i} className="bp-tag optional">{topic}</span>
            ))}
          </div>
        </div>
      )}

      {/* Final Summary Closing */}
      <div className="blueprint-closing">
        <p>{data.summary.closingStatement}</p>
      </div>

    </div>
  );
};
