import React, { useState, useEffect, useRef } from 'react';
import { Shield } from 'lucide-react';
import { useMessageStore } from '../store/messageStore';
import { useUserStore } from '../store/userStore';
import { useApp } from '../context/AppContext';
import MessageInput from './MessageInput';

interface ChatProps {
  recipientId: string;
}

export default function Chat({ recipientId }: ChatProps) {
  const { user } = useApp();
  const { getProfile } = useUserStore();
  const { getConversation, markAsRead } = useMessageStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<any[]>([]);

  const recipientProfile = getProfile(recipientId);

  useEffect(() => {
    if (!user) return;

    const loadMessages = () => {
      const conversation = getConversation(user.id, recipientId);
      setMessages(conversation);

      // Mark unread messages as read
      conversation
        .filter(msg => msg.receiverId === user.id && !msg.read)
        .forEach(msg => markAsRead(msg.id));

      // Scroll to bottom
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    loadMessages();
    const interval = setInterval(loadMessages, 1000);
    return () => clearInterval(interval);
  }, [user, recipientId, getConversation, markAsRead]);

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (hours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {recipientProfile.avatar ? (
              <img
                src={recipientProfile.avatar}
                alt={recipientProfile.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-600 font-medium">
                {recipientProfile.username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{recipientProfile.username}</h3>
            <div className="text-sm text-gray-500">
              {recipientProfile.isVerified && (
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-1 text-blue-500" />
                  Verified User
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message, index) => {
          const showDate = index === 0 || 
            new Date(message.timestamp).toDateString() !== 
            new Date(messages[index - 1].timestamp).toDateString();

          return (
            <React.Fragment key={message.id}>
              {showDate && (
                <div className="flex justify-center my-4">
                  <span className="px-3 py-1 text-xs text-gray-500 bg-white rounded-full shadow-sm">
                    {new Date(message.timestamp).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className={`flex ${
                message.senderId === user?.id ? 'justify-end' : 'justify-start'
              }`}>
                <div className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.senderId === user?.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900'
                }`}>
                  <p className="break-words">{message.content}</p>
                  <div className={`flex items-center justify-end text-xs mt-1 ${
                    message.senderId === user?.id
                      ? 'text-blue-100'
                      : 'text-gray-500'
                  }`}>
                    <span>{formatMessageTime(message.timestamp)}</span>
                    {message.senderId === user?.id && message.read && (
                      <span className="ml-1">✓✓</span>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        recipientId={recipientId}
        onMessageSent={() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
      />
    </div>
  );
}