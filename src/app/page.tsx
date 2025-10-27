import { decrypt } from '@/lib/encryption';
import ClientRecordsViewer from '@/components/ClientRecordsViewer';

// Force dynamic rendering - cannot be statically generated due to server-side encryption
export const dynamic = 'force-dynamic';

interface RecordItem {
  id: string;
  title: string;
  type: string;
  sensitivity: string;
  date: string;
}

interface DecryptedData {
  timestamp: string;
  records: RecordItem[];
}

interface HomeProps {
  initialData: DecryptedData;
}

/**
 * Server Component that fetches encrypted data from API route
 * and decrypts it server-side before rendering to the client
 */
async function getDecryptedData(): Promise<DecryptedData> {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  
  if (!encryptionKey) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }

  try {
    // Fetch encrypted data from internal API route
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/encrypted-data`, {
      cache: 'no-store', // Ensure fresh data on each request
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch encrypted data');
    }

    const { encryptedData } = await response.json();
    
    // Decrypt server-side - this is critical for security
    const decryptedJson = decrypt(encryptedData, encryptionKey);
    
    return JSON.parse(decryptedJson) as DecryptedData;
  } catch (error) {
    console.error('Error fetching or decrypting data:', error);
    throw error;
  }
}

export default async function Home() {
  const initialData = await getDecryptedData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-8 text-center">
          <h1 className="mb-4 text-5xl font-bold text-gray-900 dark:text-white">
            Secure Records Viewer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Server-side decrypted sensitive data • Last updated: {new Date(initialData.timestamp).toLocaleString()}
          </p>
        </header>

        <div className="mx-auto max-w-7xl">
          <ClientRecordsViewer initialRecords={initialData.records} />
        </div>
      </div>
    </div>
  );
}
