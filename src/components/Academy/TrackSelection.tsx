import React, { useState } from 'react';
import './TrackSelection.css';
import { Target, Clock, ArrowRight } from 'lucide-react';

export interface RecommendedTrack {
  id: string;
  title: string;
  recommendationLevel?: 'High' | 'Medium' | 'Low';
  description: string;
  matchReason: string;
  learningEffort: 'Very Short' | 'Short' | 'Moderate' | 'Significant';
  keySkills: string[];
  hiringCompanies: string;
}

interface Props {
  tracks: RecommendedTrack[];
  onSelectTrack: (trackId: string) => void;
}

export const TrackSelection: React.FC<Props> = ({ tracks, onSelectTrack }) => {
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);

  return (
    <div className="track-container fade-in">
      <div className="track-header">
        <h2>Your Recommended AI Tracks</h2>
        <p>Based on your profile, we have curated the following paths for you. Select the one that aligns best with your goals.</p>
      </div>

      <div className="track-grid">
        {tracks.map(track => (
          <div 
            key={track.id} 
            className={`track-card ${selectedTrack === track.id ? 'selected' : ''}`}
            onClick={() => setSelectedTrack(track.id)}
          >
            <div className="track-card-header">
              {track.recommendationLevel && (
                <span className={`recommendation-badge badge-${track.recommendationLevel.toLowerCase()}`}>
                  {track.recommendationLevel === 'High' && 'Highly Recommended'}
                  {track.recommendationLevel === 'Medium' && 'Recommended'}
                  {track.recommendationLevel === 'Low' && 'Possible Path'}
                </span>
              )}
              <h3>{track.title}</h3>
            </div>
            
            <p className="track-desc">{track.description}</p>
            
            <div className="track-details">
              <div className="detail-item">
                <Target size={16} className="detail-icon" />
                <p><strong>Why it fits:</strong> {track.matchReason}</p>
              </div>
              <div className="detail-item">
                <Clock size={16} className="detail-icon" />
                <p><strong>Learning Effort:</strong> {track.learningEffort}</p>
              </div>
            </div>

            <div className="track-skills">
              <strong>Key Skills to Learn:</strong>
              <div className="skill-tags">
                {track.keySkills.map(skill => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>

            <div className="track-companies">
              <p><strong>Who hires for this:</strong> {track.hiringCompanies}</p>
            </div>
            
            <button 
              className={`btn ${selectedTrack === track.id ? 'btn-primary' : 'btn-secondary'} select-btn`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectTrack(track.id);
              }}
            >
              Select Path <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
