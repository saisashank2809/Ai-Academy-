import React, { useState, useEffect } from 'react';
import AssessmentLanding from '../../components/Academy/AssessmentLanding';
import { ResumeUploadCard } from '../../components/Academy/ResumeUploadCard';
import { AssessmentChat } from '../../components/Academy/Chat/AssessmentChat';
import { OtpModal } from '../../components/Academy/OtpModal';
import { TrackSelection } from '../../components/Academy/TrackSelection';
import type { RecommendedTrack } from '../../components/Academy/TrackSelection';
import { SkillGapNarrative } from '../../components/Academy/SkillGapNarrative';
import type { SkillGapData } from '../../components/Academy/SkillGapNarrative';
import { AIBlueprint } from '../../components/Academy/AIBlueprint';
import type { AIBlueprintData } from '../../components/Academy/AIBlueprint';
import { academyApi } from '../../api/academyApi';

type AssessmentStep = 'landing' | 'resume' | 'otp' | 'chat' | 'tracks' | 'skill-gap' | 'summary';

export const AcademyAssessmentFlow: React.FC = () => {
  const [step, setStep] = useState<AssessmentStep>('landing');
  const [resumeText, setResumeText] = useState<string | undefined>();
  const [summaryData, setSummaryData] = useState<AIBlueprintData | null>(null);
  const [sessionId, setSessionId] = useState<string | null>('test_session_123');
  const [recommendedTracks, setRecommendedTracks] = useState<RecommendedTrack[]>([]);
  const [wizardData, setWizardData] = useState<any>(null);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [skillGapData, setSkillGapData] = useState<SkillGapData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Sync state with URL so back button works
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '') || 'landing';
      setStep(hash as AssessmentStep);
    };

    window.addEventListener('popstate', handlePopState);
    
    // Initial load: read from hash or set default
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash) {
      setStep(initialHash as AssessmentStep);
    } else {
      window.history.replaceState(null, '', '#landing');
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToStep = (newStep: AssessmentStep) => {
    setStep(newStep);
    window.history.pushState(null, '', `#${newStep}`);
  };

  const handleStart = () => {
    // TESTING MODE: Skip OTP and go straight to Resume Upload
    setSessionId('test_session_123');
    navigateToStep('resume');
  };

  const handleResumeNext = (text?: string) => {
    if (text) {
      setResumeText(text);
    }
    navigateToStep('chat');
  };

  const handleOtpVerified = (verifiedSessionId: string, finalReportData?: any) => {
    setSessionId(verifiedSessionId);
    if (finalReportData) {
      setSummaryData(finalReportData);
      navigateToStep('summary');
    } else {
      navigateToStep('resume');
    }
  };

  const handleOtpCancel = () => {
    navigateToStep('landing');
  };

  const handleTracksGenerated = (tracks: RecommendedTrack[], data: any) => {
    setRecommendedTracks(tracks);
    setWizardData(data);
    navigateToStep('tracks');
  };

  const handleTrackSelected = async (trackId: string) => {
    if (!sessionId) return;
    setSelectedTrackId(trackId);
    setIsGenerating(true);
    try {
      const response = await academyApi.generateSkillGapNarrative(sessionId, wizardData, trackId);
      if (response.skillGapData) {
        setSkillGapData(response.skillGapData);
        navigateToStep('skill-gap');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };


  const handleBuildRoadmap = async () => {
    if (!sessionId || !selectedTrackId) return;
    setIsGenerating(true);
    try {
      const response = await academyApi.generateDashboardForTrack(sessionId, wizardData, selectedTrackId);
      if (response.finalAssessment) {
        setSummaryData(response.finalAssessment);
        navigateToStep('summary');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSkipToSummary = () => {
    const mockData: AIBlueprintData = {
      summary: {
        trackTitle: "Mock Track Developer",
        strengths: ["Coding"],
        learningPriorities: ["LLMs"],
        projectFocus: "Building stuff",
        transitionStrategy: "Go fast",
        closingStatement: "Good luck"
      },
      phases: [
        {
          phaseNumber: 1,
          title: "Foundation",
          objective: "Learn",
          whyItMatters: "Important",
          topics: ["Basics"],
          deliverables: ["Script"],
          milestone: "Done",
          expectedOutcome: "Knowledge"
        }
      ],
      optionalTopics: []
    };
    setSummaryData(mockData);
    navigateToStep('summary');
  };

  return (
    <div className="academy-flow-container">
      {step === 'landing' && (
        <AssessmentLanding 
          onStart={handleStart} 
        />
      )}
      {step === 'resume' && <ResumeUploadCard onNext={handleResumeNext} />}
      {step === 'otp' && <OtpModal onVerified={handleOtpVerified} onCancel={handleOtpCancel} />}
      {step === 'chat' && sessionId && <AssessmentChat sessionId={sessionId} initialResumeText={resumeText} onTracksGenerated={handleTracksGenerated} />}
      {step === 'tracks' && (
        isGenerating ? (
          <div className="spinner-container" style={{ padding: '5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="spinner"></div>
            <p className="spinner-text" style={{ marginTop: '1.5rem', textAlign: 'center', color: 'white' }}>Analyzing your skill gap...</p>
          </div>
        ) : (
          <TrackSelection tracks={recommendedTracks} onSelectTrack={handleTrackSelected} />
        )
      )}
      {step === 'skill-gap' && skillGapData && (
        isGenerating ? (
          <div className="spinner-container" style={{ padding: '5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="spinner"></div>
            <p className="spinner-text" style={{ marginTop: '1.5rem', textAlign: 'center', color: 'white' }}>Generating your detailed dashboard...</p>
          </div>
        ) : (
          <SkillGapNarrative data={skillGapData} onContinue={handleBuildRoadmap} />
        )
      )}
      {step === 'summary' && summaryData && <AIBlueprint data={summaryData} />}
    </div>
  );
};
