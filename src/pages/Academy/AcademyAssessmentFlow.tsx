import React, { useState } from 'react';
import { AssessmentLanding } from '../../components/Academy/AssessmentLanding';
import { ResumeUploadCard } from '../../components/Academy/ResumeUploadCard';
import { AssessmentChat } from '../../components/Academy/Chat/AssessmentChat';
import { AssessmentSummary } from '../../components/Academy/AssessmentSummary';
import type { FinalAssessment } from '../../types/academy';

type AssessmentStep = 'landing' | 'resume' | 'chat' | 'summary';

export const AcademyAssessmentFlow: React.FC = () => {
  const [step, setStep] = useState<AssessmentStep>('landing');
  const [resumeText, setResumeText] = useState<string | undefined>();
  const [summaryData, setSummaryData] = useState<FinalAssessment | null>(null);

  const handleStart = () => {
    setStep('resume');
  };

  const handleResumeNext = (text?: string) => {
    if (text) {
      setResumeText(text);
    }
    setStep('chat');
  };

  const handleChatComplete = (data: FinalAssessment) => {
    setSummaryData(data);
    setStep('summary');
  };

  const handleSkipToSummary = () => {
    const mockData: FinalAssessment = {
      candidate: {
        assessmentId: "DEV-123",
        name: "Dev User",
        email: "dev@example.com",
        currentProfession: "Software Engineer",
        currentSpecialization: "Frontend",
        industry: "Tech",
        yearsOfExperience: "5",
        assessmentDate: new Date().toISOString().split('T')[0],
        resumeUploaded: "Yes"
      },
      executiveSummary: "This is a mock summary for dev purposes.",
      professionalProfile: {
        currentRole: "Software Engineer",
        specialization: "Frontend",
        industry: "Tech",
        yearsOfExperience: "5",
        currentResponsibilities: ["Coding", "Testing"]
      },
      readinessScore: {
        overall: 85,
        technical: 90,
        adoption: 80,
        promptEngineering: 85,
        workflowAutomation: 75,
        agenticAi: 80,
        governance: 90,
        verification: 85
      },
      maturityLevel: "Advanced",
      assessmentSummary: {
        profession: "Software Engineer",
        aiUsageFrequency: "Daily",
        aiToolsUsed: ["ChatGPT", "Copilot"],
        confidenceLevel: "High",
        preferredLearningStyle: "Visual",
        weeklyAvailability: "5-10 hours"
      },
      technicalEvaluation: [
        { skillArea: "React", rating: "Expert", comments: "Great" }
      ],
      scenarioEvaluations: [
        {
          scenario: "Automate code review",
          question: "How?",
          candidateResponse: "Use CI/CD",
          aiEvaluation: ["Good"],
          score: "4/5"
        }
      ],
      strengths: ["Coding"],
      improvementAreas: ["DevOps"],
      skillGapAnalysis: [
        { skill: "DevOps", current: 2, target: 4 }
      ],
      careerTransition: {
        currentRole: "Software Engineer",
        recommendedFutureRole: "AI Engineer",
        aiReadiness: "High",
        transitionDifficulty: "Medium",
        estimatedLearningDuration: "3 Months"
      },
      recommendedLearningPath: [
        { priority: 1, module: "LLMs" }
      ],
      personalizedRecommendations: ["Learn Python"],
      metadata: {
        assessmentVersion: "1.0",
        assessmentType: "Dev",
        totalQuestions: 5,
        questionsAttempted: 5,
        completionTime: "5m",
        resumeParsed: "Yes",
        aiModel: "Mock",
        generatedOn: new Date().toISOString()
      },
      disclaimer: "Mock Data"
    };
    setSummaryData(mockData);
    setStep('summary');
  };

  return (
    <div className="academy-flow-container">
      {step === 'landing' && (
        <AssessmentLanding 
          onStart={handleStart} 
          onSkipToChat={() => setStep('chat')}
          onSkipToSummary={handleSkipToSummary}
        />
      )}
      {step === 'resume' && <ResumeUploadCard onNext={handleResumeNext} />}
      {step === 'chat' && <AssessmentChat initialResumeText={resumeText} onComplete={handleChatComplete} />}
      {step === 'summary' && summaryData && <AssessmentSummary data={summaryData} />}
    </div>
  );
};
