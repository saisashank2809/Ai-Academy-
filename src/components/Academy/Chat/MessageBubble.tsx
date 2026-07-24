import React from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { ChatMessage } from '../../../types/academy';

interface Props {
  message: ChatMessage;
}

export const MessageBubble: React.FC<Props> = ({ message }) => {
  const isAI = message.role === 'assistant' || message.role === 'system';

  return (
    <div
      className={`flex gap-4 w-full mb-10 opacity-0 animate-slide-up-fade ${
        isAI ? 'flex-row' : 'flex-row-reverse'
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm border ${
          isAI
            ? 'bg-slate-800 text-indigo-400 border-slate-700'
            : 'bg-indigo-600 text-white border-indigo-500'
        }`}
      >
        {isAI ? <Bot size={20} /> : <User size={20} />}
      </div>
      <div
        className={`flex flex-col max-w-[80%] ${
          isAI ? 'items-start' : 'items-end'
        }`}
      >
        <div className="text-sm text-slate-400 mb-2 font-medium tracking-wide">
          {isAI ? 'Ottobon AI' : 'You'}
        </div>
        <div
          className={`px-6 py-4 shadow-md text-[0.95rem] leading-relaxed rounded-2xl ${
            isAI
              ? 'bg-slate-800/80 border border-slate-700/50 rounded-tl-sm text-slate-200'
              : 'bg-indigo-600 text-white border border-indigo-500 rounded-tr-sm whitespace-pre-wrap'
          }`}
        >
          {isAI ? (
            <div className="prose prose-invert prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 max-w-none">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          ) : (
            message.content
          )}
        </div>
      </div>
    </div>
  );
};
