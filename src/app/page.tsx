import { decrypt } from "@/lib/encryption";
import ClientRecordsViewer from "@/components/ClientRecordsViewer";
import TypingAnimation from "@/components/TypingAnimation";

// Force dynamic rendering - cannot be statically generated due to server-side encryption
export const dynamic = "force-dynamic";

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

// Fetches encrypted data from API route and decrypts it server-side
// Simulates the exact flow: API encrypts → Server decrypts → Render
async function getDecryptedData(): Promise<DecryptedData> {
  const encryptionKey = process.env.ENCRYPTION_KEY;

  if (!encryptionKey) {
    throw new Error("ENCRYPTION_KEY environment variable is not set");
  }

  try {
    // Build the API URL - use environment variable or construct from request headers
    let baseUrl = "http://localhost:3000";

    if (process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`;
    } else if (process.env.NEXT_PUBLIC_BASE_URL) {
      baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    }

    console.log("Fetching from:", `${baseUrl}/api/encrypted-data`);

    // Fetch from internal API route (as per requirements)
    // const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/encrypted-data`, {
    //   cache: 'no-store',
    //   headers: {
    //     'Accept': 'application/json',
    //   },
    // });
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/encrypted-data`
          : "/api/encrypted-data"
      }`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      }
    );
    console.log("API Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", response.status, errorText);
      throw new Error(`Failed to fetch encrypted data: ${response.status}`);
    }

    const data = await response.json();
    const { encryptedData } = data;

    if (!encryptedData) {
      throw new Error("No encrypted data received from API");
    }

    // Decrypt server-side (critical for security)
    const decryptedJson = decrypt(encryptedData, encryptionKey);

    return JSON.parse(decryptedJson) as DecryptedData;
  } catch (error) {
    console.error("Error fetching or decrypting data:", error);
    throw error;
  }
}

// Server component: fetches and decrypts data before rendering
export default async function Home() {
  const initialData = await getDecryptedData();

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-60 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-12 text-center">
          <div className="inline-block mb-6">
            <TypingAnimation
              text="Secure Records Viewer"
              className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 via-pink-500 to-cyan-400 animate-gradient bg-[length:200%_auto]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #60a5fa, #a855f7, #ec4899, #22d3ee)",
              }}
            />
          </div>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
            Server-side encrypted data • Built with Next.js & AES-256-GCM
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>
              Last updated: {new Date(initialData.timestamp).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="mx-auto max-w-7xl">
          <ClientRecordsViewer initialRecords={initialData.records} />
        </div>
      </div>
    </main>
  );
}
