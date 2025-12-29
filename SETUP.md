# Quick Setup Guide

## Prerequisites

- **Node.js 18+** (20+ recommended)
- PostgreSQL database (use [Neon.com](https://neon.tech) for free hosted PostgreSQL)

## Step-by-Step Setup

### 1. Clone and Install

```bash
# Backend
cd backend
npm install

# Frontend (in a new terminal)
cd frontend
npm install
```

### 2. Database Setup

1. Create a PostgreSQL database on [Neon.com](https://neon.tech) (or use local PostgreSQL)
2. Copy the connection string

### 3. Backend Configuration

```bash
cd backend
```

Create a `.env` file:

```env
DATABASE_URL="your-neon-connection-string-here"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

Then run:

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database (creates demo users and sample data)
npm run prisma:seed

# Start backend server
npm run dev
```

Backend will run on `http://localhost:3001`

### 4. Frontend Configuration

```bash
cd frontend
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Then run:

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

### 5. Login

Use these demo credentials:
- **Admin**: `admin@xenfi.com` / `admin123`
- **Staff**: `staff@xenfi.com` / `staff123`

## Troubleshooting

### Node Version Issues

If you see engine warnings, upgrade Node.js:
```bash
# Using nvm (recommended)
nvm install 20
nvm use 20
```

### Database Connection Issues

- Verify your `DATABASE_URL` is correct
- Ensure your database is accessible (check Neon.com dashboard)
- Try running `npm run prisma:studio` to verify connection

### Port Already in Use

Change the port in `.env` files:
- Backend: `PORT=3002`
- Frontend: Update `NEXT_PUBLIC_API_URL` accordingly

## Next Steps

- Read the main [README.md](./README.md) for detailed documentation
- Explore the codebase structure
- Check API endpoints in `backend/src/routes/`
- Review React components in `frontend/src/components/`

