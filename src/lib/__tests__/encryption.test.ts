import { encrypt, decrypt } from '../encryption';

describe('Encryption Utilities', () => {
  const testKey = 'test-encryption-key-for-unit-tests';
  const testData = JSON.stringify({
    id: '123',
    title: 'Test Record',
    sensitive: 'This is secret data',
  });

  describe('encrypt', () => {
    it('should encrypt data and return base64 string', () => {
      const encrypted = encrypt(testData, testKey);
      
      expect(encrypted).toBeTruthy();
      expect(typeof encrypted).toBe('string');
      
      // Should be in format: iv:tag:encryptedData
      const parts = encrypted.split(':');
      expect(parts).toHaveLength(3);
    });

    it('should produce different encrypted output each time', () => {
      const encrypted1 = encrypt(testData, testKey);
      const encrypted2 = encrypt(testData, testKey);
      
      // Different IV should produce different encrypted output
      expect(encrypted1).not.toBe(encrypted2);
    });

    it('should handle empty data', () => {
      const encrypted = encrypt('', testKey);
      const decrypted = decrypt(encrypted, testKey);
      expect(decrypted).toBe('');
    });
  });

  describe('decrypt', () => {
    it('should decrypt encrypted data correctly', () => {
      const encrypted = encrypt(testData, testKey);
      const decrypted = decrypt(encrypted, testKey);
      
      expect(decrypted).toBe(testData);
      const parsed = JSON.parse(decrypted);
      expect(parsed.title).toBe('Test Record');
    });

    it('should decrypt to original JSON structure', () => {
      const originalData = { id: '1', title: 'Survey #1', type: 'Survey' };
      const encrypted = encrypt(JSON.stringify(originalData), testKey);
      const decrypted = decrypt(encrypted, testKey);
      
      const result = JSON.parse(decrypted);
      expect(result).toEqual(originalData);
    });

    it('should throw error with wrong key', () => {
      const encrypted = encrypt(testData, testKey);
      
      expect(() => decrypt(encrypted, 'wrong-key')).toThrow();
    });

    it('should throw error with invalid format', () => {
      expect(() => decrypt('invalid-format', testKey)).toThrow('Invalid encrypted format');
    });

    it('should throw error with tampered data', () => {
      const encrypted = encrypt(testData, testKey);
      const parts = encrypted.split(':');
      // Tamper with encrypted data
      parts[2] = 'tampered-data';
      const tampered = parts.join(':');
      
      expect(() => decrypt(tampered, testKey)).toThrow();
    });
  });

  describe('encrypt-decrypt round trip', () => {
    it('should handle multiple encryptions and decryptions', () => {
      const data1 = JSON.stringify({ record: '1' });
      const data2 = JSON.stringify({ record: '2' });
      const data3 = JSON.stringify({ record: '3' });
      
      const encrypted1 = encrypt(data1, testKey);
      const encrypted2 = encrypt(data2, testKey);
      const encrypted3 = encrypt(data3, testKey);
      
      expect(decrypt(encrypted1, testKey)).toBe(data1);
      expect(decrypt(encrypted2, testKey)).toBe(data2);
      expect(decrypt(encrypted3, testKey)).toBe(data3);
    });

    it('should handle complex nested objects', () => {
      const complexData = {
        timestamp: '2024-01-01T00:00:00Z',
        records: [
          { id: '1', type: 'Survey', sensitive: true },
          { id: '2', type: 'Record', sensitive: false },
        ],
        metadata: {
          version: '1.0',
          environment: 'production',
        },
      };
      
      const encrypted = encrypt(JSON.stringify(complexData), testKey);
      const decrypted = decrypt(encrypted, testKey);
      const result = JSON.parse(decrypted);
      
      expect(result).toEqual(complexData);
      expect(result.records).toHaveLength(2);
      expect(result.metadata.version).toBe('1.0');
    });
  });
});

