import { Message } from '../types';

export const useInitialMessages = (): Message[] => {
  return [
    {
      role: 'assistant',
      content: 'Hi there! 👋 I\'m an AI assistant. How can I help you today?',
    }
  ];
}; 