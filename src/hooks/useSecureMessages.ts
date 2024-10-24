import { useState, useCallback, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MessageEncryption } from '../utils/encryption';
import { storage } from '../utils/storage';

interface SecureMessage {
  id: string;
  senderId: string;
  receiverId: string;
  encryptedContent: {
    encrypted: string;
    iv: string;
  };
  timestamp: string;
}

interface DecryptedMessage extends Omit<SecureMessage, 'encryptedContent'> {
  content: string;
}

export function useSecureMessages() {
  const { user } = useApp();
  const [messages, setMessages] = useState<DecryptedMessage[]>([]);
  const [keyPair, setKeyPair] = useState<CryptoKeyPair | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize user's keys
  useEffect(() => {
    const initializeKeys = async () => {
      if (!user) return;

      try {
        // Try to load existing keys from storage
        const storedKeyPair = storage.get(`keyPair_${user.id}`);
        
        if (!storedKeyPair) {
          // Generate new key pair if none exists
          const newKeyPair = await MessageEncryption.generateKeyPair();
          setKeyPair(newKeyPair);
          
          // Store public key on the server
          const publicKey = await MessageEncryption.exportPublicKey(newKeyPair);
          // TODO: Send publicKey to server
          
          // Store key pair securely
          storage.set(`keyPair_${user.id}`, newKeyPair);
        } else {
          setKeyPair(storedKeyPair);
        }
      } catch (err) {
        setError('Failed to initialize encryption keys');
      } finally {
        setLoading(false);
      }
    };

    initializeKeys();
  }, [user]);

  const sendMessage = useCallback(async (
    receiverId: string,
    content: string
  ): Promise<boolean> => {
    if (!user || !keyPair) return false;

    try {
      // Get receiver's public key from server
      // TODO: Fetch receiver's public key
      const receiverPublicKey = await MessageEncryption.importPublicKey('...');

      // Derive shared key
      const sharedKey = await MessageEncryption.deriveSharedKey(
        keyPair.privateKey,
        receiverPublicKey
      );

      // Encrypt message
      const encryptedContent = await MessageEncryption.encryptMessage(
        content,
        sharedKey
      );

      // Create message object
      const message: SecureMessage = {
        id: `msg_${Date.now()}`,
        senderId: user.id,
        receiverId,
        encryptedContent,
        timestamp: new Date().toISOString()
      };

      // TODO: Send encrypted message to server
      
      return true;
    } catch (err) {
      setError('Failed to send message');
      return false;
    }
  }, [user, keyPair]);

  const decryptMessage = useCallback(async (
    message: SecureMessage
  ): Promise<DecryptedMessage | null> => {
    if (!keyPair) return null;

    try {
      // Get sender's public key from server
      // TODO: Fetch sender's public key
      const senderPublicKey = await MessageEncryption.importPublicKey('...');

      // Derive shared key
      const sharedKey = await MessageEncryption.deriveSharedKey(
        keyPair.privateKey,
        senderPublicKey
      );

      // Decrypt message
      const content = await MessageEncryption.decryptMessage(
        message.encryptedContent,
        sharedKey
      );

      return {
        ...message,
        content
      };
    } catch (err) {
      console.error('Failed to decrypt message:', err);
      return null;
    }
  }, [keyPair]);

  return {
    messages,
    sendMessage,
    decryptMessage,
    loading,
    error
  };
}