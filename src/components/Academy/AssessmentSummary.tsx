import React, { useRef, useState } from 'react';
import type { FinalAssessment } from '../../types/academy';
import { Link2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import html2canvas from 'html2canvas';
import { academyApi } from '../../api/academyApi';
import './AssessmentSummary.css';

const LinkedinIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const TwitterIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const FacebookIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const ImageIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

interface Props {
  data: FinalAssessment;
}

const VisualRoadmap = ({ path }: { path: FinalAssessment['recommendedLearningPath'] }) => {
  if (!path || path.length === 0) return null;
  return (
    <section className="report-section visual-roadmap-section">
      <h3 className="section-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>Your Recommended Learning Path</h3>
      <div className="roadmap-container">
        {path.map((mod, i) => (
          <React.Fragment key={i}>
            <div className="roadmap-node fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="node-icon-wrapper">
                <span className="node-number">{mod.priority}</span>
              </div>
              <div className="node-content">
                <p>{mod.module}</p>
              </div>
            </div>
            {i < path.length - 1 && <div className="roadmap-connector" />}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export const AssessmentSummary: React.FC<Props> = ({ data }) => {
  const scoreCardRef = useRef<HTMLDivElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  if (!data || !data.candidate) {
    return <div style={{ padding: '2rem', color: 'white' }}>Error: Invalid assessment data format received.</div>;
  }

  const handlePrint = async () => {
    try {
      setIsDownloadingPdf(true);
      const blob = await academyApi.generateReport(data);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Ottobon_AI_Assessment_${data.candidate.name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Failed to generate report", err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const shareUrl = 'https://jobs.ottobon.cloud/academy';
  const shareText = `I just scored a ${data.readinessScore.overall}% on the Ottobon AI Readiness Assessment! My level is ${data.maturityLevel}. See how you stack up!`;

  const handleLinkedInShare = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleTwitterShare = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    alert("Share text copied to clipboard!");
  };

  const handleDownloadImage = async () => {
    if (!scoreCardRef.current) return;
    
    const element = scoreCardRef.current;
    element.style.display = 'block';
    
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#F8F2E8',
        scale: 2,
        useCORS: true,
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `Ottobon_AI_Readiness_${data.candidate.name.replace(/\s+/g, '_')}.png`;
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
    } finally {
      element.style.display = 'none';
    }
  };

  return (
    <div className="report-container fade-in">
      <div className="report-actions no-print" style={{ gap: '0.8rem', display: 'flex', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-secondary)', marginRight: '0.5rem', fontWeight: 500 }}>Share Result:</span>
        <button className="btn-icon" onClick={handleDownloadImage} title="Download Score Image">
          <ImageIcon size={20} />
        </button>
        <button className="btn-icon" onClick={handleLinkedInShare} title="Share on LinkedIn">
          <LinkedinIcon size={20} />
        </button>
        <button className="btn-icon" onClick={handleTwitterShare} title="Share on Twitter (X)">
          <TwitterIcon size={20} />
        </button>
        <button className="btn-icon" onClick={handleFacebookShare} title="Share on Facebook">
          <FacebookIcon size={20} />
        </button>
        <button className="btn-icon" onClick={handleCopyLink} title="Copy text to clipboard">
          <Link2 size={20} />
        </button>
        <button 
          className="btn btn-primary" 
          onClick={handlePrint} 
          disabled={isDownloadingPdf}
          style={{ marginLeft: '1rem', position: 'relative', overflow: 'hidden' }}
        >
          {isDownloadingPdf ? (
            <>
              <span style={{ opacity: 0.8 }}>Generating PDF...</span>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '3px',
                background: 'rgba(255,255,255,0.8)',
                animation: 'loadingBar 2s infinite linear'
              }} className="download-progress-bar" />
            </>
          ) : (
            'Download PDF Report'
          )}
        </button>
        <button className="btn btn-secondary" onClick={() => window.open('https://learn.ottobon.in/our-courses/cohort', '_blank')} style={{ marginLeft: '0.5rem', background: '#334155', color: 'white', border: '1px solid #475569' }}>
          View Dashboard
        </button>
      </div>

      <div className="report-document" ref={documentRef}>
        <div className="report-cover">
          <h1 className="report-main-title">OTTOBON AI ACADEMY</h1>
          <h2 className="report-sub-title">Enterprise AI Readiness Assessment Report</h2>
        </div>

        <hr className="report-divider" />

        <section className="report-section">
          <h3 className="section-title" style={{ textAlign: 'center', justifyContent: 'center' }}>Career Transition Potential</h3>
          <div className="transition-flow">
            <div className="transition-role">{data.careerTransition.currentRole}</div>
            <div className="transition-arrow">↓</div>
            <div className="transition-role highlight">{data.careerTransition.recommendedFutureRole}</div>
          </div>
          <div className="profile-grid mt-4">
            <div className="profile-item"><span className="profile-label">AI Readiness</span><span className="profile-value">{data.careerTransition.aiReadiness}</span></div>
            <div className="profile-item"><span className="profile-label">Transition Difficulty</span><span className="profile-value">{data.careerTransition.transitionDifficulty}</span></div>
            <div className="profile-item"><span className="profile-label">Estimated Duration</span><span className="profile-value">{data.careerTransition.estimatedLearningDuration}</span></div>
          </div>
        </section>

        <hr className="report-divider" />

        <VisualRoadmap path={data.recommendedLearningPath} />

        <hr className="report-divider" />

        <section className="report-section">
          <h3 className="section-title">1. Candidate Information</h3>
          <table className="report-table">
            <tbody>
              <tr>
                <td>Assessment ID</td>
                <td>{data.candidate.assessmentId}</td>
              </tr>
              <tr>
                <td>Candidate Name</td>
                <td>{data.candidate.name}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td><a href={`mailto:${data.candidate.email}`}>{data.candidate.email}</a></td>
              </tr>
              <tr>
                <td>Current Profession</td>
                <td>{data.candidate.currentProfession}</td>
              </tr>
              <tr>
                <td>Current Specialization</td>
                <td>{data.candidate.currentSpecialization}</td>
              </tr>
              <tr>
                <td>Industry</td>
                <td>{data.candidate.industry}</td>
              </tr>
              <tr>
                <td>Years of Experience</td>
                <td>{data.candidate.yearsOfExperience}</td>
              </tr>
              <tr>
                <td>Assessment Date</td>
                <td>{data.candidate.assessmentDate}</td>
              </tr>
              <tr>
                <td>Resume Uploaded</td>
                <td>{data.candidate.resumeUploaded}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <hr className="report-divider" />

        <section className="report-section">
          <h3 className="section-title">2. Executive Summary</h3>
          <div className="report-text-content">
            <ReactMarkdown>{data.executiveSummary}</ReactMarkdown>
          </div>
        </section>

        <hr className="report-divider" />

        <section className="report-section page-break-after">
          <h3 className="section-title">3. Professional Profile</h3>
          <div className="profile-grid">
            <div className="profile-item">
              <span className="profile-label">Current Role</span>
              <span className="profile-value">{data.professionalProfile.currentRole}</span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Specialization</span>
              <span className="profile-value">{data.professionalProfile.specialization}</span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Industry</span>
              <span className="profile-value">{data.professionalProfile.industry}</span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Years of Experience</span>
              <span className="profile-value">{data.professionalProfile.yearsOfExperience}</span>
            </div>
          </div>
          
          <div className="responsibilities">
            <h4>Current Responsibilities</h4>
            <ul>
              {data.professionalProfile.currentResponsibilities.map((resp, i) => (
                <li key={i}>{resp}</li>
              ))}
            </ul>
          </div>
        </section>

        <hr className="report-divider" />

        <section className="report-section">
          <h3 className="section-title">4. AI Readiness Score</h3>
          <table className="report-table">
            <thead>
              <tr>
                <th>Category</th>
                <th className="align-right">Score</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Overall AI Readiness</td><td className="align-right">{data.readinessScore.overall}%</td></tr>
              <tr><td>Technical Readiness</td><td className="align-right">{data.readinessScore.technical}%</td></tr>
              <tr><td>AI Adoption</td><td className="align-right">{data.readinessScore.adoption}%</td></tr>
              <tr><td>Prompt Engineering</td><td className="align-right">{data.readinessScore.promptEngineering}%</td></tr>
              <tr><td>Workflow Automation</td><td className="align-right">{data.readinessScore.workflowAutomation}%</td></tr>
              <tr><td>Agentic AI Understanding</td><td className="align-right">{data.readinessScore.agenticAi}%</td></tr>
              <tr><td>AI Governance</td><td className="align-right">{data.readinessScore.governance}%</td></tr>
              <tr><td>AI Verification</td><td className="align-right">{data.readinessScore.verification}%</td></tr>
            </tbody>
          </table>
        </section>

        <hr className="report-divider" />

        <section className="report-section">
          <h3 className="section-title">5. AI Maturity Level</h3>
          <table className="report-table">
            <thead>
              <tr>
                <th>Score Range</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              <tr className={data.maturityLevel === 'Beginner' ? 'highlight-row' : ''}><td>0–20</td><td>Beginner</td></tr>
              <tr className={data.maturityLevel === 'Emerging' ? 'highlight-row' : ''}><td>21–40</td><td>Emerging</td></tr>
              <tr className={data.maturityLevel === 'Developing' ? 'highlight-row' : ''}><td>41–60</td><td>Developing</td></tr>
              <tr className={data.maturityLevel === 'Advanced' ? 'highlight-row' : ''}><td>61–80</td><td>Advanced</td></tr>
              <tr className={data.maturityLevel === 'AI Leader' ? 'highlight-row' : ''}><td>81–100</td><td>AI Leader</td></tr>
            </tbody>
          </table>
          <div className="maturity-highlight">
            <strong>Current Level:</strong> {data.maturityLevel}
          </div>
        </section>

        <hr className="report-divider" />

        <section className="report-section page-break-after">
          <h3 className="section-title">6. Assessment Summary</h3>
          <div className="profile-grid">
            <div className="profile-item"><span className="profile-label">Profession</span><span className="profile-value">{data.assessmentSummary.profession}</span></div>
            <div className="profile-item"><span className="profile-label">AI Usage Frequency</span><span className="profile-value">{data.assessmentSummary.aiUsageFrequency}</span></div>
            <div className="profile-item"><span className="profile-label">Confidence Level</span><span className="profile-value">{data.assessmentSummary.confidenceLevel}</span></div>
            <div className="profile-item"><span className="profile-label">Preferred Learning Style</span><span className="profile-value">{data.assessmentSummary.preferredLearningStyle}</span></div>
            <div className="profile-item"><span className="profile-label">Weekly Availability</span><span className="profile-value">{data.assessmentSummary.weeklyAvailability}</span></div>
          </div>
          <div className="responsibilities">
            <h4>AI Tools Used</h4>
            <ul>
              {data.assessmentSummary.aiToolsUsed.map((tool, i) => (
                <li key={i}>{tool}</li>
              ))}
            </ul>
          </div>
        </section>

        <hr className="report-divider" />

        <section className="report-section">
          <h3 className="section-title">7. Technical Competency Evaluation</h3>
          <p>This section summarizes responses from the role-specific questions.</p>
          <table className="report-table">
            <thead>
              <tr>
                <th>Skill Area</th>
                <th>Rating</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {data.technicalEvaluation.map((evalItem, i) => (
                <tr key={i}>
                  <td>{evalItem.skillArea}</td>
                  <td>{evalItem.rating}</td>
                  <td>{evalItem.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <hr className="report-divider" />

        <section className="report-section">
          <h3 className="section-title">8. Practical Scenario Evaluation</h3>
          {data.scenarioEvaluations.map((scenario, i) => (
            <div key={i} className="scenario-block">
              <h4>Scenario {i + 1}</h4>
              <p><strong>Question:</strong> {scenario.question}</p>
              <p><strong>Candidate Response:</strong> {scenario.candidateResponse}</p>
              <div className="ai-eval-box">
                <p><strong>AI Evaluation:</strong></p>
                <ul>
                  {scenario.aiEvaluation.map((point, j) => (
                    <li key={j}>{point}</li>
                  ))}
                </ul>
              </div>
              <p className="scenario-score"><strong>Score:</strong> {scenario.score}</p>
            </div>
          ))}
        </section>

        <hr className="report-divider" />

        <section className="report-section">
          <h3 className="section-title">9. Identified Strengths</h3>
          <ul>
            {data.strengths.map((str, i) => <li key={i}>{str}</li>)}
          </ul>
        </section>

        <hr className="report-divider" />

        <section className="report-section page-break-after">
          <h3 className="section-title">10. Areas for Improvement</h3>
          <ul>
            {data.improvementAreas.map((imp, i) => <li key={i}>{imp}</li>)}
          </ul>
        </section>

        <hr className="report-divider" />

        <section className="report-section">
          <h3 className="section-title">11. AI Skill Gap Analysis</h3>
          <table className="report-table">
            <thead>
              <tr>
                <th>Skill</th>
                <th className="align-right">Current</th>
                <th className="align-right">Target</th>
              </tr>
            </thead>
            <tbody>
              {data.skillGapAnalysis.map((gap, i) => (
                <tr key={i}>
                  <td>{gap.skill}</td>
                  <td className="align-right">{gap.current}/5</td>
                  <td className="align-right">{gap.target}/5</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <hr className="report-divider" />



        <section className="report-section">
          <h3 className="section-title">12. Personalized Recommendations</h3>
          <ul>
            {data.personalizedRecommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </section>



        <hr className="report-divider" />

        <section className="report-section disclaimer">
          <h3 className="section-title">13. Disclaimer</h3>
          <p>{data.disclaimer}</p>
        </section>
      </div>

      {/* Hidden Score Card for Image Generation */}
      <div 
        ref={scoreCardRef} 
        style={{ 
          display: 'none', 
          position: 'absolute', 
          left: '-9999px',
          top: 0,
          width: '800px',
          padding: '40px',
          background: '#FFFDFC',
          color: '#4F6672',
          fontFamily: "'Inter', sans-serif",
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(35,71,90,0.1)',
          border: '2px solid #E8DDD0'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 800, margin: 0, fontFamily: "'DM Sans', sans-serif", color: '#E95A38' }}>
            OTTOBON AI ACADEMY
          </h1>
          <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '10px 0 0 0', fontFamily: "'DM Sans', sans-serif", color: '#23475A' }}>
            Enterprise AI Readiness Assessment
          </h2>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', padding: '30px', borderRadius: '15px', border: '1px solid #ECE5DB', boxShadow: '0 4px 12px rgba(35,71,90,0.05)' }}>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: '18px', color: '#7A8792', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>Candidate</p>
            <p style={{ margin: '5px 0 20px 0', fontSize: '28px', fontWeight: 700, color: '#23475A', fontFamily: "'DM Sans', sans-serif" }}>{data.candidate.name}</p>
            
            <p style={{ margin: 0, fontSize: '18px', color: '#7A8792', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>Profession</p>
            <p style={{ margin: '5px 0 20px 0', fontSize: '24px', fontWeight: 600, color: '#4F6672' }}>{data.candidate.currentProfession}</p>

            <p style={{ margin: 0, fontSize: '18px', color: '#7A8792', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>AI Maturity Level</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '28px', fontWeight: 800, color: '#E95A38', fontFamily: "'DM Sans', sans-serif" }}>{data.maturityLevel}</p>
          </div>
          
          <div style={{ width: '250px', height: '250px', borderRadius: '50%', background: 'conic-gradient(#E95A38 0%, #D94A2D 50%, #D2A85B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(233,90,56,0.15)' }}>
            <div style={{ width: '220px', height: '220px', borderRadius: '50%', background: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '64px', fontWeight: 800, color: '#23475A', fontFamily: "'DM Sans', sans-serif" }}>{data.readinessScore.overall}%</span>
              <span style={{ fontSize: '16px', color: '#7A8792', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Overall Score</span>
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '16px', color: '#7A8792', fontWeight: 500 }}>
          Take the assessment at <strong style={{ color: '#E95A38' }}>jobs.ottobon.cloud/academy</strong>
        </div>
      </div>
    </div>
  );
};
