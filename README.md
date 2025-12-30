# XenFi Systems - Enterprise Expense Intelligence

A premium, mobile-first expense management system built for speed, transparency, and fiscal intelligence.

## 🚀 Quick Start

### 1. Core Installation
Navigate to both directories and install dependencies:
```bash
# In frontend directory
npm install

# In backend directory
npm install
```

### 2. Environment Configuration
Create `.env` files in both directories based on the templates:

**Frontend (`/frontend/.env.local`):**
```env
# Database Configuration
# PostgreSQL connection string
# Format: postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
# Example with Neon.com: postgresql://user:password@ep-xyz.region.aws.neon.tech/xenfi_db?sslmode=require
DATABASE_URL=""

# JWT Authentication
# Use a strong, random secret for production (minimum 32 characters)
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET="your-super-secret-jwt-key-change-in-production-min-32-chars"

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
# Set to your frontend URL in production
FRONTEND_URL=https://xenfi-systems-7yv3.vercel.app/

# cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
REDIS_URL=
```

### 3. Database Initialization (Backend)
```bash
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
```

### 4. Launch Development
```bash
# Frontend
npm run dev

# Backend
npm run dev
```

---

## 🛠️ Tech Stack & Decisions

### Frontend: Next.js + Tailwind CSS
- **Why**: Next.js provides a robust routing system and excellent performance out of the box. Tailwind was chosen for its rapid styling capabilities and the ability to create the **premium dark glassmorphism** aesthetic without heavy third-party UI libraries.
- **State Management**: **Zustand** for global auth state (lightweight) and **React Query** (TanStack) for server state management (caching, invalidation, loading states).

### Backend: Node.js + Express + Prisma
- **Why**: A classic, flexible combination. Prisma was chosen as the ORM for its type-safety and developer experience, allowing for rapid schema iterations.
- **Auth**: Traditional Session-based authentication using `express-session` and `cookie-parser`. This provides a secure, stateful session management layer.
- **Storage**: **Cloudinary** for scalable receipt image hosting and transformation.

---

## ⚖️ Tradeoffs & Limitations

### 1. Session Storage
- **Current State**: Uses in-memory session storage by default.
- **Limitation**: Sessions will be cleared on server restarts in development. For production, the backend is configured to trust proxies but scaling to multiple instances would require a Redis session store (already referenced in dependencies as `ioredis` but not fully initialized for sessions).

### 2. Client-Side Only Data 
- **Decision**: The dashboard heavily relies on React hooks (`useDashboardStats`, `useAdminStats`) after the client-side hydration.
- **Tradeoff**: Initial page load shows a branded loading state rather than SSR data. This was a tradeoff made to ensure a highly dynamic, SPA-like interactive feel for the "Intelligence" components.

### 3. Vercel Serverless
- **Heads Up**: The backend is designed as a single Express app exported for Vercel Serverless. Long-running tasks (like large image processing) might hit serverless execution timeouts (typically 10-60s depending on plan).

---

## 👤 Admin Access
For testing, use the seeded credentials:
- **Admin**: `admin@xenfi.com` / `admin123`
- **Staff**: `staff@xenfi.com` / `staff123`
