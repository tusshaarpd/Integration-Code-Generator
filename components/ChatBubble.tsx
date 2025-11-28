import React from 'react';
import { ChatMessage } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { Icons } from './Icon';

interface ChatBubbleProps {
  message: ChatMessage;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isThinking = message.isThinking;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-600' : 'bg-emerald-600'}`}>
          {isUser ? (
            <Icons.User className="h-5 w-5 text-white" />
          ) : (
            <Icons.Bot className="h-5 w-5 text-white" />
          )}
        </div>

        {/* Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-4 py-3 rounded-2xl shadow-sm ${
            isUser 
              ? 'bg-blue-600 text-white rounded-tr-none' 
              : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
          }`}>
            
            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {message.attachments.map((att, idx) => (
                  <div key={idx} className="relative rounded-lg overflow-hidden border border-gray-200">
                    <img 
                      src={`data:${att.mimeType};base64,${att.data}`} 
                      alt="Attachment" 
                      className="max-h-48 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Thinking Indicator */}
            {isThinking && (
               <div className="flex items-center gap-2 text-emerald-600 italic text-sm mb-2 animate-pulse">
                 <Icons.BrainCircuit className="h-4 w-4" />
                 <span>Deep thinking in progress...</span>
               </div>
            )}

            {/* Text Content */}
            <div className={isUser ? 'text-white' : ''}>
              {isUser ? (
                <p className="whitespace-pre-wrap">{message.text}</p>
              ) : (
                <MarkdownRenderer content={message.text} />
              )}
            </div>
          </div>
          <span className="text-xs text-gray-400 mt-1 px-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
