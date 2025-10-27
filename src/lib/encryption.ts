import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

/**
 * Encrypts data using AES-256-GCM with a random IV
 * @param text The plaintext to encrypt
 * @param secretKey The encryption key (will be hashed to 32 bytes)
 * @returns Base64 encoded string of format: iv:tag:encryptedData
 */
export function encrypt(text: string, secretKey: string): string {
  const key = crypto.scryptSync(secretKey, 'salt', KEY_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  const tag = cipher.getAuthTag();
  
  // Format: iv:authTag:encryptedData
  return `${iv.toString('base64')}:${tag.toString('base64')}:${encrypted.toString('base64')}`;
}

/**
 * Decrypts AES-256-GCM encrypted data
 * @param encryptedText The encrypted text in format iv:tag:encryptedData
 * @param secretKey The encryption key (will be hashed to 32 bytes)
 * @returns The decrypted plaintext
 */
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

