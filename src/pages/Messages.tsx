import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useMessageStore } from '../store/messageStore';
import { useApp } from '../context/AppContext';
import { useLocation } from 'react-router-dom';
import Chat from '../components/Chat';
import ConversationList from '../components/ConversationList';

export default function Messages() {
  const location = useLocation();
  const { user } = useApp();
  const { messages } = useMessageStore();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    location.state?.recipientId || null
  );
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Please log in to view messages</p>
      </div>
    );
  }

  const handleSelectUser = (userId: string) => {
    if (userId !== user.id) {
      setSelectedUserId(userId);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <div className="bg-white rounded-lg shadow-sm mt-6 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-8rem)]">
          {/* Conversations List */}
          <div className="border-r border-gray-200">
            <div className="p-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="overflow-y-auto h-[calc(100vh-16rem)]">
              <ConversationList
                onSelect={handleSelectUser}
                selectedUserId={selectedUserId}
              />
            </div>
          </div>

          {/* Chat Area */}
          <div className="col-span-2 flex flex-col">
            {selectedUserId ? (
              <Chat
                key={`${selectedUserId}-${messages.length}`}
                recipientId={selectedUserId}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}