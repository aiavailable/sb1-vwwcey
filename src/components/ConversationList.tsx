import React from 'react';
import { useMessageStore } from '../store/messageStore';
import { useApp } from '../context/AppContext';
import { useUserStore } from '../store/userStore';
import { Shield } from 'lucide-react';

interface ConversationListProps {
  onSelect: (userId: string) => void;
  selectedUserId: string | null;
}

export default function ConversationList({ onSelect, selectedUserId }: ConversationListProps) {
  const { user } = useApp();
  const { getConversations } = useMessageStore();
  const { getProfile } = useUserStore();

  if (!user) return null;

  // Filter out conversations with self
  const conversations = getConversations(user.id).filter(
    conversation => conversation.userId !== user.id
  );

  const formatLastMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) {
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else if (days < 7) {
      return `${days}d`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="divide-y divide-gray-200">
      {conversations.map(({ userId, lastMessage, unreadCount }) => {
        const profile = getProfile(userId);
        return (
          <button
            key={userId}
            onClick={() => onSelect(userId)}
            className={`w-full p-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors ${
              selectedUserId === userId ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 font-medium">
                    {profile.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {profile.username}
                  </p>
                  {profile.isVerified && (
                    <Shield className="w-4 h-4 ml-1 text-blue-600" />
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {formatLastMessageTime(lastMessage.timestamp)}
                </p>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-gray-500 truncate">
                  {lastMessage.senderId === user.id && '↗ '}
                  {lastMessage.content}
                </p>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
      {conversations.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          No conversations yet
        </div>
      )}
    </div>
  );
}