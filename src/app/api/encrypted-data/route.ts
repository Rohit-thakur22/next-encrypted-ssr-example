import { NextResponse } from 'next/server';
import { encrypt } from '@/lib/encryption';

/**
 * API endpoint that returns encrypted sensitive data.
 * This simulates what would come from a database or secure service.
 * The encryption key is stored server-side in environment variables.
 * 
 * @returns JSON response with encrypted payload
 */
export async function GET() {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  
  if (!encryptionKey) {
    return NextResponse.json(
      { error: 'Encryption key not configured' },
      { status: 500 }
    );
  }

  // Sample sensitive data - in production this would come from a database
  const sensitiveData = {
    timestamp: new Date().toISOString(),
    records: [
      { id: '1', title: 'Patient Survey #001', type: 'Survey', sensitivity: 'Confidential', date: '2024-01-15' },
      { id: '2', title: 'Patient Survey #002', type: 'Survey', sensitivity: 'Private', date: '2024-01-16' },
      { id: '3', title: 'Medical Record #101', type: 'Record', sensitivity: 'Highly Confidential', date: '2024-01-17' },
      { id: '4', title: 'Patient Survey #003', type: 'Survey', sensitivity: 'Confidential', date: '2024-01-18' },
      { id: '5', title: 'Medical Record #102', type: 'Record', sensitivity: 'Confidential', date: '2024-01-19' },
      { id: '6', title: 'Patient Survey #004', type: 'Survey', sensitivity: 'Private', date: '2024-01-20' },
      { id: '7', title: 'Medical Record #103', type: 'Record', sensitivity: 'Highly Confidential', date: '2024-01-21' },
      { id: '8', title: 'Patient Survey #005', type: 'Survey', sensitivity: 'Confidential', date: '2024-01-22' },
    ]
  };

  try {
    // Encrypt the data before sending to client
    // Format: base64(iv:tag:encryptedData)
    const encryptedPayload = encrypt(JSON.stringify(sensitiveData), encryptionKey);
    
    return NextResponse.json({ encryptedData: encryptedPayload });
  } catch (error) {
    console.error('Encryption error:', error);
    return NextResponse.json(
      { error: 'Failed to encrypt data' },
      { status: 500 }
    );
  }
}

