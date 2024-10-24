import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { socket } from '../utils/socket';

interface Notification {
  id: string;
  type: 'message' | 'like' | 'match' | 'system';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  data?: Record<string, any>;
}

export function useNotifications() {
  const { user } = useApp();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    socket.on('notification', (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      socket.off('notification');
    };
  }, [user]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const clearNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification
  };
}