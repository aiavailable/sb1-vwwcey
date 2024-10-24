import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useMessageStore } from '../store/messageStore';
import { useApp } from '../context/AppContext';

interface MessageInputProps {
  recipientId: string;
  onMessageSent?: () => void;
}

export default function MessageInput({ recipientId, onMessageSent }: MessageInputProps) {
  const { user } = useApp();
  const { sendMessage } = useMessageStore();
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    sendMessage(user.id, recipientId, message.trim());
    setMessage('');
    onMessageSent?.();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!user}
        />
        <button
          type="submit"
          disabled={!message.trim() || !user}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}