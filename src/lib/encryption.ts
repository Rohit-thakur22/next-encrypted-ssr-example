import crypto from 'crypto';

// AES-256-GCM configuration constants
const ALGORITHM = 'aes-256-gcm'; // Authenticated encryption (prevents tampering)
const IV_LENGTH = 16;              // Initialization vector length in bytes
const TAG_LENGTH = 16;             // Authentication tag length in bytes
const KEY_LENGTH = 32;             // 256-bit key length in bytes

// Encrypts data using AES-256-GCM (authenticated encryption)
export function encrypt(text: string, secretKey: string): string {
  const key = crypto.scryptSync(secretKey, 'salt', KEY_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const tag = cipher.getAuthTag();
  
  return `${iv.toString('base64')}:${tag.toString('base64')}:${encrypted.toString('base64')}`;
}

// Decrypts AES-256-GCM data with authentication tag verification
export function decrypt(encryptedText: string, secretKey: string): string {
  const key = crypto.scryptSync(secretKey, 'salt', KEY_LENGTH);
  const parts = encryptedText.split(':');
  
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted format. Expected iv:tag:data');
  }
  
  const [ivBase64, tagBase64, encryptedBase64] = parts;
  const iv = Buffer.from(ivBase64, 'base64');
  const tag = Buffer.from(tagBase64, 'base64');
  const encrypted = Buffer.from(encryptedBase64, 'base64');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString('utf8');
}

