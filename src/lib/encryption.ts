import crypto from 'crypto';

// AES-256-GCM configuration constants
const ALGORITHM = 'aes-256-gcm'; // Authenticated encryption (prevents tampering)
const IV_LENGTH = 16;              // Initialization vector length in bytes
const TAG_LENGTH = 16;             // Authentication tag length in bytes
const KEY_LENGTH = 32;             // 256-bit key length in bytes

/**
 * Encrypts plaintext data using AES-256-GCM authenticated encryption.
 * 
 * Why AES-256-GCM?
 * - Provides confidentiality (data is encrypted)
 * - Provides integrity (authentication tag prevents tampering)
 * - Industry standard for sensitive data
 * 
 * @param text - The plaintext string to encrypt
 * @param secretKey - The encryption key (derived to 256 bits using scrypt)
 * @returns Base64 encoded string in format: iv:authTag:encryptedData
 */
export function encrypt(text: string, secretKey: string): string {
  // Derive a 256-bit key from the secret using scrypt (prevent brute force)
  const key = crypto.scryptSync(secretKey, 'salt', KEY_LENGTH);
  
  // Generate a random IV for each encryption (never reuse IVs!)
  const iv = crypto.randomBytes(IV_LENGTH);
  
  // Create the cipher with the key and IV
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  // Encrypt the data
  let encrypted = cipher.update(text, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  // Get the authentication tag (proves data wasn't tampered with)
  const tag = cipher.getAuthTag();
  
  // Return format: iv:authTag:encryptedData (all base64 encoded)
  return `${iv.toString('base64')}:${tag.toString('base64')}:${encrypted.toString('base64')}`;
}

/**
 * Decrypts AES-256-GCM encrypted data.
 * 
 * @param encryptedText - The encrypted string in format: iv:tag:encryptedData
 * @param secretKey - The same encryption key used during encryption
 * @returns The decrypted plaintext string
 * @throws Error if format is invalid or decryption fails (e.g., tampered data)
 */
export function decrypt(encryptedText: string, secretKey: string): string {
  // Derive the same 256-bit key from the secret
  const key = crypto.scryptSync(secretKey, 'salt', KEY_LENGTH);
  
  // Parse the encrypted format: iv:tag:data
  const parts = encryptedText.split(':');
  
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted format. Expected iv:tag:data');
  }
  
  const [ivBase64, tagBase64, encryptedBase64] = parts;
  
  // Decode the base64 components
  const iv = Buffer.from(ivBase64, 'base64');
  const tag = Buffer.from(tagBase64, 'base64');
  const encrypted = Buffer.from(encryptedBase64, 'base64');
  
  // Create the decipher and set the authentication tag
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag); // This will throw if data was tampered with
  
  // Decrypt the data
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString('utf8');
}

