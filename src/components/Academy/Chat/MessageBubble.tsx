import React from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { ChatMessage } from '../../../types/academy';
import './MessageBubble.css';

interface Props {
  message: ChatMessage;
}

export const MessageBubble: React.FC<Props> = ({ message }) => {
  const isAI = message.role === 'assistant' || message.role === 'system';

  return (
    <div className={`message-wrapper ${isAI ? 'ai' : 'user'} fade-in`}>
      <div className="avatar">
        {isAI ? <Bot size={20} /> : <User size={20} />}
      </div>
      <div className="message-content">
        <div className="sender-name">{isAI ? 'Ottobon AI' : 'You'}</div>
        <div className="text-content markdown-body">
          {isAI ? (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          ) : (
            message.content
          )}
        </div>
      </div>
    </div>
  );
};
