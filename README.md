# Secure Next.js Records Viewer

A production-ready Next.js application demonstrating **server-side encryption and decryption** with responsive UI, interactive filtering, and smooth animations.

## 🎯 Features

### Core Requirements
- ✅ **Server-Side Encryption/Decryption**: Sensitive data is encrypted server-side and never exposed to the client
- ✅ **Server-Side Rendering (SSR)**: Data fetching and decryption happen in `page.tsx` (App Router equivalent of `getServerSideProps`)
- ✅ **AES-256-GCM Encryption**: Industry-standard authenticated encryption with IV and authentication tags
- ✅ **Responsive Design**: Card grid adapts from mobile (1 col) → tablet (2 cols) → desktop (3+ cols)
- ✅ **Smooth Animations**: Framer Motion powered entrance, hover, and filter transitions
- ✅ **Interactive Search & Sort**: Client-side filtering and sorting with animated results

### Security Features
- 🔐 **Encryption**: AES-256-GCM with random IV per encryption
- 🔐 **Authentication Tag**: Verifies data integrity (prevents tampering)
- 🔐 **Server-Side Only**: Decryption never happens on client-side
- 🔐 **Environment Variables**: Encryption keys stored securely
- 🔐 **No Secrets in Code**: All sensitive keys in `.env.local`

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Open `.env.local` and set your encryption key:

```bash
ENCRYPTION_KEY=your-super-secret-encryption-key-change-this-in-production-make-it-long-and-random
```

**⚠️ Generate a strong key:**

```bash
# Unix/Mac/WSL
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── encrypted-data/
│   │       └── route.ts          # API route that returns encrypted payload
│   ├── globals.css                # Global styles with Tailwind
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # SSR page that fetches & decrypts data
├── components/
│   ├── ClientRecordsViewer.tsx   # Client component with search/sort
│   └── RecordCard.tsx             # Individual record card with animations
└── lib/
    └── encryption.ts              # Encryption/decryption utilities
```

## 🔒 Security Implementation

### Why Server-Side Decryption?

**The Problem**: If we encrypted data on the server but decrypted it in the client browser, anyone could inspect the browser's network tab, see the encrypted payload, and:
1. Steal the encrypted data
2. Use the JavaScript source code to reverse-engineer the decryption
3. Decrypt and expose sensitive information

**The Solution**: Decryption happens **only on the server** before rendering. The client browser never receives:
- The encryption key
- The decryption logic
- The plaintext sensitive data

Only the **already decrypted** HTML is sent to the client.

### Encryption Details

- **Algorithm**: AES-256-GCM (Galois/Counter Mode)
- **Key Length**: 256 bits (32 bytes)
- **IV**: Random 16 bytes per encryption
- **Authentication Tag**: 16 bytes (prevents tampering)
- **Format**: `iv:tag:encryptedData` (all base64 encoded)

```typescript
// Encryption process (server-side only)
1. Generate random IV
2. Create cipher with IV
3. Encrypt plaintext
4. Get authentication tag
5. Return base64(iv:tag:encryptedData)
```

## 🎨 UI/UX Features

### Responsive Grid Layout
- **Mobile**: 1 column
- **Tablet**: 2 columns
- **Desktop**: 3+ columns
- Built with Tailwind CSS

### Animations
- **Entrance**: Cards fade in with stagger effect
- **Hover**: Lift effect with subtle shadow
- **Filter**: Smooth in/out transitions
- **Interactive**: Button press animations

### Search & Sort
- Real-time search filtering
- Sort by: Date, Type, Sensitivity
- Animated result count
- Empty state with smooth transitions

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Encryption**: Node.js `crypto` module
- **Server-Side**: Async React Server Components

## 📝 Design Decisions

### 1. App Router vs Pages Router
- Chose **App Router** (recommended for new Next.js projects)
- SSR achieved through async server components (`async function` in `page.tsx`)
- More modern and performant than `getServerSideProps`

### 2. Encryption Algorithm
- **AES-256-GCM** chosen over AES-CBC because:
  - Provides authenticated encryption (prevents tampering)
  - Authentication tag verifies data integrity
  - Modern best practice for sensitive data

### 3. Client Components Split
- Server component (`page.tsx`) handles data fetching/decryption
- Client components (`ClientRecordsViewer`, `RecordCard`) handle interactivity
- Clear separation of concerns

### 4. State Management
- Simple `useState` for search/sort (no Redux/Zustand needed)
- Framer Motion for animation state

## 🔐 Security Assumptions

1. **Server is Trusted**: The encryption key is only on the server
2. **HTTPS in Production**: Always use HTTPS to prevent man-in-the-middle attacks
3. **Key Management**: In production, use a proper key management service (AWS KMS, HashiCorp Vault, etc.)
4. **API Route Protection**: In production, add authentication to `/api/encrypted-data`

## 📦 Production Deployment

### Environment Variables

Set in your hosting platform (Vercel, Railway, etc.):

```
ENCRYPTION_KEY=<generate-strong-random-key>
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### Generate Production Key

```bash
openssl rand -base64 32
```

## 🐛 Troubleshooting

**Error: "Encryption key not configured"**
- Ensure `.env.local` exists
- Check `ENCRYPTION_KEY` is set
- Restart dev server after creating `.env.local`

**Error: "Invalid encrypted format"**
- The encryption key changed between encryption and decryption
- Use the same key that encrypted the data

**Cards not animating**
- Check browser console for JavaScript errors
- Ensure Framer Motion is installed

## 📄 License

MIT
