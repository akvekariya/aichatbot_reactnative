import React, { memo } from 'react';
import { Message } from '../../types';
import MessageBubble from './MessageBubble';

interface TypingIndicatorProps {
  isVisible: boolean;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  const typingMessage: Message = {
    messageId: 'typing',
    text: '',
    sender: 'ai',
    timestamp: new Date().toISOString(),
  };

  return <MessageBubble message={typingMessage} isTyping />;
};

export default memo(TypingIndicator);
