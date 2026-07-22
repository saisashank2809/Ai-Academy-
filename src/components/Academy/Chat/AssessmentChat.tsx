import React, { useEffect, useRef, useState } from 'react';
import type { ChatMessage } from '../../../types/academy';
import { academyApi } from '../../../api/academyApi';
import { MessageBubble } from './MessageBubble';
import { DynamicQuestionInput } from './DynamicQuestionInput';
import type { RecommendedTrack } from '../TrackSelection';
import './AssessmentChat.css';

interface Props {
  sessionId: string;
  initialResumeText?: string;
  onTracksGenerated: (tracks: RecommendedTrack[], chatData: any) => void;
}

export const AssessmentChat: React.FC<Props> = ({ sessionId, initialResumeText, onTracksGenerated }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const [recommendedTracks, setRecommendedTracks] = useState<RecommendedTrack[] | null>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    // Initial fetch to start the conversation
    const startConversation = async () => {
      setIsLoading(true);
      const initialMessages: ChatMessage[] = [];
      if (initialResumeText) {
        initialMessages.push({
          role: 'system',
          content: `Resume:\n${initialResumeText}`
        });
      }
      
      const response = await academyApi.sendChatMessage(sessionId, initialMessages);
      handleBackendResponse(response);
    };

    startConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBackendResponse = (response: any) => {
    setIsLoading(false);
    
    if (response.recommendedTracks) {
      setRecommendedTracks(response.recommendedTracks);
    }

const inferMetadata = (message: string, backendMeta: any) => {
  // If backend provided valid options array with items, use it
  if (backendMeta?.options && Array.isArray(backendMeta.options) && backendMeta.options.length > 0) {
    return backendMeta;
  }

  const msgLower = message.toLowerCase();
  
  // Use stricter regex to match the actual question at the end of the message
  if (/(which|what).*(profession|role)/i.test(msgLower) && msgLower.includes('best describes')) {
    return { type: 'single-select', options: ["Oracle Professional", "Salesforce Professional", "Software Developer", "QA Engineer", "Project Manager", "Business Analyst"], allowOther: true };
  }
  if (/(how many years|what is your).*experience/i.test(msgLower)) {
    return { type: 'single-select', options: ["0-2", "3-5", "5-8", "8+"], allowOther: true };
  }
  if (/(which|what) technologies/i.test(msgLower)) {
    return { type: 'single-select', options: ["Java", ".NET", "Python", "Node", "React", "Angular"], allowOther: true };
  }
  if (/(what kind of|which).*projects/i.test(msgLower)) {
    return { type: 'single-select', options: ["Enterprise Apps", "CRM", "ERP", "Cloud", "Embedded", "Data"], allowOther: true };
  }
  if (/how often.*use ai/i.test(msgLower)) {
    return { type: 'single-select', options: ["Never", "Sometimes", "Daily", "Every Task"], allowOther: false };
  }
  if (/(which|what) ai tools/i.test(msgLower)) {
    return { type: 'multi-select', options: ["ChatGPT", "Claude", "Gemini", "Cursor", "GitHub Copilot", "None"], allowOther: true };
  }

  // Default to what backend provided or text
  return {
    type: backendMeta?.type || 'textarea',
    options: [],
    allowMultiple: backendMeta?.allowMultiple || false,
    allowOther: backendMeta?.allowOther || false,
    placeholder: backendMeta?.placeholder || "Type your answer..."
  };
};

    if (response.message) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: response.message,
          metadata: inferMetadata(response.message, response.metadata || {
            type: response.type,
            options: response.options,
            allowMultiple: response.allowMultiple,
            allowOther: response.allowOther,
            placeholder: response.placeholder
          })
        }
      ]);
    }
  };

  const handleUserSubmit = async (answer: string) => {
    try {
      const newUserMsg: ChatMessage = {
        role: 'user',
        content: answer
      };
      
      const updatedMessages = [...messages, newUserMsg];
      setMessages(updatedMessages);
      setIsLoading(true);
      setError(null);
      
      const response = await academyApi.sendChatMessage(sessionId, updatedMessages);
      handleBackendResponse(response);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during submission');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const lastMessage = messages[messages.length - 1];
  const isWaitingForUser = !isLoading && lastMessage?.role === 'assistant';

  return (
    <div className="chat-container fade-in">
      <div className="glass-panel chat-panel">
        <div className="chat-header">
          <h2>AI Career Coach</h2>
          <div className="status-indicator">
            <span className="dot online"></span> Online
          </div>
        </div>
        {error && (
          <div style={{ padding: '1rem', background: '#ffebee', color: '#c62828', textAlign: 'center' }}>
            Error: {error}
          </div>
        )}
        
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            // Skip rendering system messages in the UI
            msg.role !== 'system' && <MessageBubble key={idx} message={msg} />
          ))}
          
          {isLoading && (
            <div className="message-wrapper ai fade-in">
              <div className="avatar bot-avatar-loading"></div>
              <div className="message-content">
                <div className="sender-name">Ottobon AI</div>
                <div className="text-content typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>

        <div className="chat-input-area">
          {recommendedTracks ? (
            <button 
              className="btn btn-primary fade-in" 
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
              onClick={() => onTracksGenerated(recommendedTracks, { chatHistory: messages })}
            >
              View Recommended Tracks
            </button>
          ) : isWaitingForUser ? (
            <DynamicQuestionInput 
              metadata={lastMessage.metadata} 
              onSubmit={handleUserSubmit} 
              disabled={isLoading}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};
