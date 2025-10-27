# Secure Next.js Records Viewer

A production-ready Next.js application demonstrating **server-side encryption and decryption** with responsive UI, interactive filtering, and smooth animations.

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm, yarn, pnpm, or bun

### Setup Instructions

#### 1. Install Dependencies

```bash
npm install
```

#### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy the example file
cp .env.example .env.local
```

**⚠️ CRITICAL: Set your encryption key in `.env.local`:**

```env
ENCRYPTION_KEY=your-super-secret-encryption-key-change-this-in-production
```

**Generate a strong encryption key:**

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Or using OpenSSL
openssl rand -base64 32
```

**⚠️ Security Note**: Never commit `.env.local` to version control. It's already in `.gitignore`.

#### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

#### 4. Run Tests

```bash
npm test
```

#### 5. Build for Production

```bash
npm run build
npm start
```

---

## 🔒 Why Server-Side Decryption is Required

### The Security Problem

If data is encrypted on the server but decrypted in the browser (client-side), an attacker could:

1. **Inspect Network Traffic**: See the encrypted payload in the browser's network tab
2. **Steal the Payload**: Copy the encrypted data
3. **Reverse Engineer**: Extract the decryption JavaScript from the bundle
4. **Decrypt Sensitive Data**: Use the stolen encrypted payload and decryption logic

### The Solution

**Decryption happens ONLY on the server** before HTML is sent to the browser. This means:

- ✅ Client never receives the encryption key (`ENCRYPTION_KEY`)
- ✅ Client never receives plaintext sensitive data
- ✅ Client never receives decryption logic
- ✅ Only pre-decrypted HTML is sent to the browser

### How It Works

```typescript
// Flow in src/app/page.tsx (server-side only)
1. Fetch encrypted data from API route
2. Decrypt using ENCRYPTION_KEY (server-side only)
3. Render decrypted HTML
4. Send already-decrypted HTML to client
```

**Result**: Even if someone intercepts network traffic, they only see rendered HTML - never the encryption key or encrypted payload.

---

## 🔐 Encryption Details

### Algorithm: AES-256-GCM

**Why AES-256-GCM?**
- **Confidentiality**: Data is encrypted (AES-256)
- **Integrity**: Authentication tag prevents tampering (GCM)
- **Industry Standard**: Recommended for sensitive data

### Technical Specifications

- **Algorithm**: `aes-256-gcm` (Galois/Counter Mode)
- **Key Length**: 256 bits (32 bytes) derived using scrypt
- **IV (Initialization Vector)**: 16 random bytes per encryption
- **Authentication Tag**: 16 bytes that proves data wasn't tampered with
- **Format**: `base64(iv:tag:encryptedData)`

### Encryption Flow

```typescript
// In src/lib/encryption.ts

// Step 1: Derive 256-bit key from secret using scrypt
const key = crypto.scryptSync(secretKey, 'salt', 32);

// Step 2: Generate random IV (unique for each encryption)
const iv = crypto.randomBytes(16);

// Step 3: Create cipher and encrypt data
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
let encrypted = cipher.update(text, 'utf8');
encrypted = Buffer.concat([encrypted, cipher.final()]);

// Step 4: Get authentication tag (prevents tampering)
const tag = cipher.getAuthTag();

// Step 5: Return format: iv:tag:encryptedData (all base64)
return `${iv.toString('base64')}:${tag.toString('base64')}:${encrypted.toString('base64')}`;
```

### Decryption Flow

```typescript
// Parse the encrypted format
const [ivBase64, tagBase64, encryptedBase64] = encryptedText.split(':');

// Decode components
const iv = Buffer.from(ivBase64, 'base64');
const tag = Buffer.from(tagBase64, 'base64');
const encrypted = Buffer.from(encryptedBase64, 'base64');

// Decrypt with authentication
const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
decipher.setAuthTag(tag); // Throws error if data was tampered with
let decrypted = decipher.update(encrypted);
decrypted = Buffer.concat([decrypted, decipher.final()]);
```

**Security Benefit**: If the authentication tag doesn't match, decryption fails - preventing tampered data from being accepted.

---

## 📝 Design Choices & Assumptions

### 1. App Router (Next.js 16)
- **Choice**: Used App Router (React Server Components)
- **Versions**: Next.js 16.0.0, React 19.2.0, TypeScript 5.x
- **Why**: More modern, better performance, recommended by Next.js
- **Implementation**: SSR via async server components in `page.tsx`
- **TypeScript**: Strict mode enabled

### 2. Server vs Client Components
- **Server Component** (`src/app/page.tsx`): Handles data fetching and decryption
- **Client Components** (`ClientRecordsViewer`, `RecordCard`): Handle interactivity
- **Benefit**: Clear separation of concerns, security boundaries

### 3. Environment Variables
- **Assumption**: `ENCRYPTION_KEY` is set in `.env.local` for local development
- **Production**: Should use a key management service (AWS KMS, HashiCorp Vault)
- **Security**: Key never committed to git, stored server-side only

### 4. API Route Protection
- **Current**: Public endpoint for demo purposes
- **Production**: Should add authentication (JWT, API keys, etc.)
- **Note**: API route is internal - only called from server components

### 5. Static vs Dynamic Rendering
- **Choice**: `export const dynamic = 'force-dynamic'` in `page.tsx`
- **Why**: Data is encrypted/decrypted on each request (fresh data)
- **Trade-off**: Cannot pre-render at build time

### 6. Encryption Key Derivation
- **Method**: scrypt with fixed salt
- **Purpose**: Prevent brute force attacks
- **Note**: For production, consider using a key derivation service

### 7. Client-Side Filtering
- **Choice**: Search/sort happens in browser (not server)
- **Why**: Better UX with instant results, less server load
- **Note**: All data already decrypted server-side before rendering

### 8. Animation Library
- **Choice**: Framer Motion for smooth animations
- **Why**: Easy to use, performant, declarative API
- **Alternative**: Could use CSS animations or other libraries

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── encrypted-data/
│   │       └── route.ts          # Encrypts data before sending
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # SSR: fetches & decrypts data
│   └── globals.css                # Global styles
├── components/
│   ├── ClientRecordsViewer.tsx   # Search & sort UI
│   └── RecordCard.tsx             # Individual animated cards
└── lib/
    ├── __tests__/
    │   └── encryption.test.ts     # Unit tests
    └── encryption.ts              # AES-256-GCM utilities

Root Files:
├── .env.local                    # Your encryption key (create this)
├── .env.example                  # Template for .env.local
├── package.json                  # Dependencies & scripts
├── README.md                      # This file
└── tsconfig.json                  # TypeScript configuration
```

---

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch
```

**Test Coverage**:
- ✅ Encryption/decryption round trips
- ✅ Error handling (wrong key, tampered data)
- ✅ Edge cases (empty data, complex objects)

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16.0.0 (App Router)
- **React**: 19.2.0
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion 12.23.24
- **Encryption**: Node.js crypto module (AES-256-GCM)
- **Testing**: Jest 30.2.0 + React Testing Library 16.3.0
- **Environment**: Node.js 18+

---

## 🎨 Features

### Responsive Design (Tailwind CSS v4)
- Mobile: 1 column (`grid-cols-1`)
- Tablet: 2 columns (`md:grid-cols-2`)
- Desktop: 3+ columns (`lg:grid-cols-3`)
- Smooth transitions between breakpoints

### Animations (Framer Motion 12.23.24)
- Entrance: Staggered fade-in with slide up (0.05s delay per card)
- Hover: Lift effect (-8px) with shadow glow
- Filter: Smooth in/out transitions with AnimatePresence
- Button: Scale animation (1.02 on hover, 0.98 on tap)

### Interactivity
- Real-time search (filters by title, type, sensitivity)
- Sort dropdown (Date, Type, Sensitivity)
- Animated result counter with fade transitions
- Empty state with helpful message and icon

---

## 📦 Production Deployment

### Environment Variables

Set these in your hosting platform (Vercel, Railway, etc.):

```env
ENCRYPTION_KEY=<generate-new-strong-random-key>
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### Generate Production Encryption Key

```bash
openssl rand -base64 32
```

### Security Recommendations

1. **Use HTTPS**: Always use HTTPS in production
2. **Key Management**: Use AWS KMS, HashiCorp Vault, or similar
3. **API Auth**: Add authentication to API routes
4. **Rate Limiting**: Protect against abuse
5. **Monitoring**: Add error tracking (Sentry, etc.)

---

## 🐛 Troubleshooting

### "Encryption key not configured"
**Solution**: Create `.env.local` with `ENCRYPTION_KEY=...`

### "Invalid encrypted format"
**Solution**: The encryption key changed. Use the original key that encrypted the data.

### Cards not animating
**Solution**: Check browser console, ensure Framer Motion is installed.

### Port already in use
**Solution**: Next.js will use the next available port, or specify with `npm run dev -- -p 3001`

---

