# XenFi Systems - Expense & Accounting Management Platform

A full-stack expense and accounting management platform built for internal use at XenFi Systems. This application demonstrates modern web development practices with a clean separation between frontend and backend.

## 🏗️ Architecture

- **Backend**: Node.js + Express + TypeScript
- **Frontend**: Next.js 16 (App Router) + React + TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **State Management**: Zustand + React Query
- **Styling**: TailwindCSS
- **Authentication**: JWT-based authentication

## 📋 Features

### Core Functionality
- ✅ User authentication (Register/Login) with JWT
- ✅ Protected routes and session handling
- ✅ Full CRUD operations for Expenses
- ✅ Full CRUD operations for Categories
- ✅ Dashboard with expense analytics
- ✅ Date range and category filtering
- ✅ Responsive design

### Technical Highlights
- Type-safe API with TypeScript throughout
- React Query for efficient data fetching and caching
- Zustand for lightweight state management
- Prisma migrations for database schema management
- Seed script for sample data
- Error handling and validation
- Clean code structure and separation of concerns

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (recommended: Node.js 20+)
- PostgreSQL database (local or hosted on Neon.com)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/xenfi_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

4. Generate Prisma client:
```bash
npm run prisma:generate
```

5. Run database migrations:
```bash
npm run prisma:migrate
```

6. Seed the database (optional):
```bash
npm run prisma:seed
```

This creates:
- Admin user: `admin@xenfi.com` / `admin123`
- Staff user: `staff@xenfi.com` / `staff123`
- Sample categories and expenses

7. Start the development server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
xenfi-systems/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth middleware
│   │   ├── routes/          # API routes
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utilities (JWT, DB)
│   │   └── index.ts         # Express app entry
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts          # Seed script
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/             # Next.js App Router pages
    │   │   ├── auth/        # Login/Register pages
    │   │   ├── dashboard/   # Dashboard page
    │   │   ├── expenses/    # Expenses page
    │   │   └── categories/  # Categories page
    │   ├── components/      # React components
    │   ├── hooks/           # React Query hooks
    │   ├── lib/             # API client, utilities
    │   ├── stores/          # Zustand stores
    │   └── types/           # TypeScript types
    └── package.json
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. After login/register, the token is stored in localStorage and sent with each API request via the Authorization header.

### Demo Credentials

- **Admin**: `admin@xenfi.com` / `admin123`
- **Staff**: `staff@xenfi.com` / `staff123`

## 🗄️ Database Schema

### Users
- id, email, name, password, role (ADMIN/STAFF), timestamps

### Categories
- id, name, description, timestamps

### Expenses
- id, amount, description, date, paymentMethod, attachmentUrl
- Relations: categoryId → Category, userId → User

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Expenses
- `GET /api/expenses` - List expenses (with filters)
- `GET /api/expenses/:id` - Get expense details
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Categories
- `GET /api/categories` - List categories
- `GET /api/categories/:id` - Get category details
- `POST /api/categories` - Create category (protected)
- `PUT /api/categories/:id` - Update category (protected)
- `DELETE /api/categories/:id` - Delete category (protected)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (protected)

## 🛠️ Development

### Backend Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database with sample data
- `npm run prisma:studio` - Open Prisma Studio

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🚢 Deployment

### Backend Deployment

The backend can be deployed to platforms like:
- Railway
- Render
- Fly.io
- Heroku

Set environment variables on your hosting platform:
- `DATABASE_URL`
- `JWT_SECRET`
- `PORT`
- `FRONTEND_URL` (your frontend URL)

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL` (your backend URL)
4. Deploy

### Database (Neon.com)

1. Create a new project on Neon.com
2. Copy the connection string
3. Update `DATABASE_URL` in backend `.env`
4. Run migrations: `npm run prisma:migrate`

## 🔒 Security Notes

- Never commit `.env` files
- Use strong `JWT_SECRET` in production
- Implement rate limiting in production
- Use HTTPS in production
- Validate all user inputs
- Consider adding CSRF protection

## 📝 Tech Choices & Tradeoffs

### Why Express + Next.js Separate?
- Clear separation of concerns
- Independent scaling
- Easier to maintain and test
- Allows different deployment strategies

### Why React Query?
- Automatic caching and refetching
- Optimistic updates
- Built-in loading/error states
- Reduces boilerplate

### Why Zustand?
- Lightweight alternative to Redux
- Simple API
- Good TypeScript support
- Perfect for auth state

### Known Limitations
- No file upload for receipts (attachment URL only)
- No role-based UI differences (backend enforces)
- No pagination (can be added)
- No email verification
- No password reset flow

## 🤝 Contributing

This is a practical engineering task submission. For production use, consider:
- Adding tests (unit + integration)
- Implementing file uploads
- Adding pagination
- Implementing role-based UI
- Adding audit trails
- Setting up CI/CD
- Adding monitoring/logging

## 📄 License

ISC

## 👤 Author

Josue Batey - Practical Engineering Task Submission for XenFi Systems
