import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { socketService } from '../utils/socket';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface MessageState {
  messages: Message[];
  sendMessage: (senderId: string, receiverId: string, content: string) => void;
  markAsRead: (messageId: string) => void;
  getConversation: (userId: string, otherId: string) => Message[];
  getConversations: (userId: string) => {
    userId: string;
    lastMessage: Message;
    unreadCount: number;
  }[];
  clearUserMessages: (userId: string) => void;
  initializeSocket: (userId: string) => void;
  disconnectSocket: () => void;
}

export const useMessageStore = create<MessageState>()(
  persist(
    (set, get) => ({
      messages: [],

      initializeSocket: (userId: string) => {
        socketService.connect(userId);

        socketService.on('new_message', (message: Message) => {
          set(state => ({
            messages: [...state.messages, message]
          }));
        });

        socketService.on('message_read', (messageId: string) => {
          set(state => ({
            messages: state.messages.map(msg =>
              msg.id === messageId ? { ...msg, read: true } : msg
            )
          }));
        });
      },

      disconnectSocket: () => {
        socketService.disconnect();
      },

      sendMessage: (senderId, receiverId, content) => {
        const message: Message = {
          id: `msg_${Date.now()}`,
          senderId,
          receiverId,
          content,
          timestamp: new Date().toISOString(),
          read: false
        };

        // Emit message through WebSocket
        socketService.emit('send_message', message);

        // Add to local state
        set(state => ({
          messages: [...state.messages, message]
        }));
      },

      markAsRead: (messageId: string) => {
        set(state => ({
          messages: state.messages.map(msg =>
            msg.id === messageId ? { ...msg, read: true } : msg
          )
        }));
        socketService.emit('mark_read', messageId);
      },

      getConversation: (userId, otherId) => {
        return get().messages
          .filter(msg =>
            (msg.senderId === userId && msg.receiverId === otherId) ||
            (msg.senderId === otherId && msg.receiverId === userId)
          )
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      },

      getConversations: (userId) => {
        const conversations = new Map();
        
        get().messages.forEach(message => {
          if (message.senderId !== userId && message.receiverId !== userId) return;

          const otherId = message.senderId === userId ? message.receiverId : message.senderId;
          const existing = conversations.get(otherId);

          if (!existing || new Date(message.timestamp) > new Date(existing.lastMessage.timestamp)) {
            conversations.set(otherId, {
              userId: otherId,
              lastMessage: message,
              unreadCount: get().messages.filter(m => 
                m.receiverId === userId && 
                m.senderId === otherId && 
                !m.read
              ).length
            });
          }
        });

        return Array.from(conversations.values());
      },

      clearUserMessages: (userId: string) => {
        socketService.disconnect();
        set(state => ({
          messages: state.messages.filter(msg => 
            msg.senderId !== userId && msg.receiverId !== userId
          )
        }));
      }
    }),
    {
      name: 'messages',
      partialize: (state) => ({ messages: state.messages })
    }
  )
);