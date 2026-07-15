import type { ChatMessage } from '../types/academy';

const API_BASE = 'http://localhost:8001'; // Default backend url, can be updated via env later

export const academyApi = {
  async parseResume(file: File): Promise<{ text: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Fallback/Mock behavior if backend endpoint is not yet ready
    // We will use actual fetch if the backend is configured, but let's 
    // keep a simple mock for now since the prompt implied building the frontend
    // without changing the backend yet. Wait, we can point to local backend if it's there.
    try {
      const response = await fetch(`${API_BASE}/academy/parse-resume`, {
        method: 'POST',
        headers: {
          'x-academy-key': 'ottobon_academy_live_992'
        },
        body: formData,
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn("Failed to reach parse-resume endpoint. Falling back to mock.");
    }
    
    // Mock response
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ text: "Mock Resume Text content parsed successfully." });
      }, 1500);
    });
  },

  async sendChatMessage(messages: ChatMessage[]): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/academy/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-academy-key': 'ottobon_academy_live_992'
        },
        body: JSON.stringify({ messages })
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
       console.warn("Failed to reach chat endpoint. Falling back to mock.");
    }

    // Mock response based on the conversation length
    return new Promise(resolve => {
      setTimeout(() => {
        
        if (messages.length === 1) { // User just started
           resolve({
             message: "Which best describes your current profession?",
             metadata: {
               type: "single-select",
               options: ["Oracle Professional", "Salesforce Professional", "Software Developer", "QA Engineer", "Project Manager", "Business Analyst"],
               allowOther: true
             }
           });
        } else if (messages.length === 3) { // User answered first Q
           resolve({
             message: "How many years of experience do you have?",
             metadata: {
               type: "single-select",
               options: ["0-2", "3-5", "5-8", "8+"],
               allowOther: true
             }
           });
        } else if (messages.length === 5) {
           resolve({
             message: "Which AI tools do you currently use?",
             metadata: {
               type: "multi-select",
               options: ["ChatGPT", "Claude", "Gemini", "Cursor", "GitHub Copilot", "None"],
               allowOther: true
             }
           });
        } else if (messages.length === 7) {
           resolve({
             message: "Describe one task where you recently used AI.",
             metadata: {
               type: "textarea",
               placeholder: "I used AI to..."
             }
           });
        } else {
           // Provide final assessment summary trigger
           resolve({
             finalAssessment: {
               candidate: {
                 assessmentId: "AIA-2026-000123",
                 name: "Mock User",
                 email: "mock@example.com",
                 currentProfession: "Software Developer",
                 currentSpecialization: "Backend",
                 industry: "Tech",
                 yearsOfExperience: "5",
                 assessmentDate: "14 July 2026",
                 resumeUploaded: "No"
               },
               executiveSummary: "This is a mock executive summary.",
               professionalProfile: {
                 currentRole: "Dev",
                 specialization: "Backend",
                 industry: "Tech",
                 yearsOfExperience: "5",
                 currentResponsibilities: ["Coding"]
               },
               readinessScore: {
                 overall: 74, technical: 80, adoption: 70, promptEngineering: 60, workflowAutomation: 50, agenticAi: 40, governance: 30, verification: 20
               },
               maturityLevel: "Developing",
               assessmentSummary: {
                 profession: "Developer", aiUsageFrequency: "Daily", aiToolsUsed: ["ChatGPT"], confidenceLevel: "Intermediate", preferredLearningStyle: "Visual", weeklyAvailability: "10 hours"
               },
               technicalEvaluation: [],
               scenarioEvaluations: [],
               strengths: ["Coding"],
               improvementAreas: ["AI"],
               skillGapAnalysis: [],
               careerTransition: {
                 currentRole: "Dev", recommendedFutureRole: "AI Dev", aiReadiness: "74%", transitionDifficulty: "Medium", estimatedLearningDuration: "3 months"
               },
               recommendedLearningPath: [],
               personalizedRecommendations: [],
               metadata: {
                 assessmentVersion: "1.0", assessmentType: "Mock", totalQuestions: 10, questionsAttempted: 10, completionTime: "5 mins", resumeParsed: "No", aiModel: "Mock", generatedOn: "Today"
               },
               disclaimer: "Mock data."
             }
           });
        }
      }, 1000);
    });
  },

  async generateReport(data: any): Promise<Blob> {
    const response = await fetch(`${API_BASE}/academy/generate-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-academy-key': 'ottobon_academy_live_992'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate report');
    }
    
    return await response.blob();
  }
};
