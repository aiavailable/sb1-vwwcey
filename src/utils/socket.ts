import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 10;
  private readonly RECONNECT_INTERVAL = 3000;
  private readonly SOCKET_OPTIONS = {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 3000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    transports: ['polling', 'websocket'],
    upgrade: true,
    forceNew: true,
    path: '/socket.io/',
    withCredentials: true,
    parser: {
      protocol: 4,
      encode: (packet: any) => JSON.stringify(packet),
      decode: (data: string) => JSON.parse(data)
    }
  };

  private getSocketUrl(): string {
    const isSecure = window.location.protocol === 'https:';
    const host = window.location.hostname;
    const port = '3001';
    return `${isSecure ? 'wss' : 'ws'}://${host}:${port}`;
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('connect_error', (error) => {
      console.warn('Socket connect error:', error);
      this.handleReconnect();
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('Socket disconnected:', reason);
      if (reason === 'io server disconnect' || reason === 'transport close') {
        this.handleReconnect();
      }
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      if (error.type === 'TransportError') {
        this.handleTransportError();
      }
    });

    // Message events
    this.socket.on('new_message', (message) => {
      window.dispatchEvent(new CustomEvent('new_message', { detail: message }));
    });

    this.socket.on('message_sent', (messageId) => {
      window.dispatchEvent(new CustomEvent('message_sent', { detail: messageId }));
    });

    this.socket.on('message_read', (messageId) => {
      window.dispatchEvent(new CustomEvent('message_read', { detail: messageId }));
    });

    // Typing events
    this.socket.on('typing_start', ({ userId, conversationId }) => {
      window.dispatchEvent(new CustomEvent('typing_start', { 
        detail: { userId, conversationId }
      }));
    });

    this.socket.on('typing_end', ({ userId, conversationId }) => {
      window.dispatchEvent(new CustomEvent('typing_end', { 
        detail: { userId, conversationId }
      }));
    });

    // Presence events
    this.socket.on('user_online', (userId) => {
      window.dispatchEvent(new CustomEvent('user_online', { detail: userId }));
    });

    this.socket.on('user_offline', (userId) => {
      window.dispatchEvent(new CustomEvent('user_offline', { detail: userId }));
    });
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
      this.reconnectAttempts++;
      console.log(`Reconnecting (${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS})...`);
      
      setTimeout(() => {
        if (this.socket) {
          this.socket.connect();
        } else {
          this.connect();
        }
      }, this.RECONNECT_INTERVAL);
    } else {
      console.error('Max reconnection attempts reached');
      this.disconnect();
      window.dispatchEvent(new CustomEvent('socket_connection_failed'));
    }
  }

  private handleTransportError(): void {
    if (this.socket) {
      const currentTransports = [...this.socket.io.opts.transports];
      if (currentTransports.includes('websocket')) {
        console.log('Falling back to polling transport');
        this.socket.io.opts.transports = ['polling'];
      }
      this.handleReconnect();
    }
  }

  connect(userId?: string): void {
    if (this.socket?.connected) return;

    try {
      const options = {
        ...this.SOCKET_OPTIONS,
        auth: userId ? { userId } : undefined
      };

      this.socket = io(this.getSocketUrl(), options);
      this.setupEventListeners();
      this.socket.connect();

      if (userId) {
        this.socket.emit('authenticate', userId);
      }
    } catch (error) {
      console.error('Socket initialization failed:', error);
      this.handleReconnect();
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.close();
      this.socket = null;
    }
    this.reconnectAttempts = 0;
  }

  emit(event: string, data: any): void {
    if (!this.socket?.connected) {
      console.warn('Socket not connected, queueing event');
      setTimeout(() => this.emit(event, data), 1000);
      return;
    }

    try {
      this.socket.emit(event, data);
    } catch (error) {
      console.error('Failed to emit event:', error);
      if (error instanceof Error && error.message.includes('parser error')) {
        const sanitizedData = JSON.parse(JSON.stringify(data));
        this.socket.emit(event, sanitizedData);
      }
    }
  }

  on(event: string, callback: (data: any) => void): void {
    if (!this.socket) {
      console.warn('Socket not initialized');
      return;
    }
    this.socket.on(event, callback);
  }

  off(event: string, callback?: (data: any) => void): void {
    if (!this.socket) return;
    if (callback) {
      this.socket.off(event, callback);
    } else {
      this.socket.off(event);
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();