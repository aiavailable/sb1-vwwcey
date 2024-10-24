import { storage } from './storage';

export class MessageEncryption {
  private static readonly ALGORITHM = 'AES-GCM';
  private static readonly KEY_ALGORITHM = 'ECDH';
  private static readonly KEY_NAMED_CURVE = 'P-256';
  private static readonly SALT_LENGTH = 16;
  private static readonly IV_LENGTH = 12;

  // Generate a key pair for a user
  static async generateKeyPair(): Promise<CryptoKeyPair> {
    return await window.crypto.subtle.generateKey(
      {
        name: this.KEY_ALGORITHM,
        namedCurve: this.KEY_NAMED_CURVE
      },
      true,
      ['deriveKey']
    );
  }

  // Export public key to share with other users
  static async exportPublicKey(keyPair: CryptoKeyPair): Promise<string> {
    const exported = await window.crypto.subtle.exportKey(
      'spki',
      keyPair.publicKey
    );
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
  }

  // Import another user's public key
  static async importPublicKey(publicKeyString: string): Promise<CryptoKey> {
    const binaryString = atob(publicKeyString);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return await window.crypto.subtle.importKey(
      'spki',
      bytes,
      {
        name: this.KEY_ALGORITHM,
        namedCurve: this.KEY_NAMED_CURVE
      },
      true,
      []
    );
  }

  // Derive a shared secret key for two users
  static async deriveSharedKey(
    privateKey: CryptoKey,
    publicKey: CryptoKey
  ): Promise<CryptoKey> {
    return await window.crypto.subtle.deriveKey(
      {
        name: this.KEY_ALGORITHM,
        public: publicKey
      },
      privateKey,
      {
        name: this.ALGORITHM,
        length: 256
      },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Encrypt a message
  static async encryptMessage(
    message: string,
    sharedKey: CryptoKey
  ): Promise<{ encrypted: string; iv: string }> {
    const encoder = new TextEncoder();
    const encodedMessage = encoder.encode(message);
    
    const iv = window.crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: this.ALGORITHM,
        iv
      },
      sharedKey,
      encodedMessage
    );

    return {
      encrypted: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
      iv: btoa(String.fromCharCode(...iv))
    };
  }

  // Decrypt a message
  static async decryptMessage(
    encryptedData: { encrypted: string; iv: string },
    sharedKey: CryptoKey
  ): Promise<string> {
    const decoder = new TextDecoder();
    
    const encryptedBytes = Uint8Array.from(atob(encryptedData.encrypted), c => c.charCodeAt(0));
    const iv = Uint8Array.from(atob(encryptedData.iv), c => c.charCodeAt(0));
    
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: this.ALGORITHM,
        iv
      },
      sharedKey,
      encryptedBytes
    );

    return decoder.decode(decrypted);
  }
}