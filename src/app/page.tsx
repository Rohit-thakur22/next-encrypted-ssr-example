import { decrypt } from '@/lib/encryption';
import ClientRecordsViewer from '@/components/ClientRecordsViewer';
import TypingAnimation from '@/components/TypingAnimation';

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

/**
 * Fetches encrypted data from the API route and decrypts it server-side.
 * This is critical for security - the client never sees encryption keys or plaintext data.
 * 
 * @returns Decrypted record data
 * @throws Error if encryption key is missing or decryption fails
 */
async function getDecryptedData(): Promise<DecryptedData> {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  
  if (!encryptionKey) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }

  try {
    // Call our internal API route that returns encrypted data
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/encrypted-data`, {
      cache: 'no-store', // Always fetch fresh data
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch encrypted data from API');
    }

    const { encryptedData } = await response.json();
    
    // Decrypt the data SERVER-SIDE - this is the key security feature
    // The browser never receives plaintext data or the encryption key
    const decryptedJson = decrypt(encryptedData, encryptionKey);
    
    return JSON.parse(decryptedJson) as DecryptedData;
  } catch (error) {
    console.error('Error fetching or decrypting data:', error);
    throw error;
  }
}

/**
 * Main page component - this is a SERVER COMPONENT
 * It fetches and decrypts data on the server before sending HTML to the client
 */
export default async function Home() {
  const initialData = await getDecryptedData();

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black">
      {/* Animated background orbs for visual depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-60 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-6">
            <TypingAnimation 
              text="Secure Records Viewer"
              className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400"
            />
          </div>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
            Server-side encrypted data • Built with Next.js & AES-256-GCM
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Last updated: {new Date(initialData.timestamp).toLocaleString()}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl">
          <ClientRecordsViewer initialRecords={initialData.records} />
        </div>
      </div>
    </main>
  );
}
