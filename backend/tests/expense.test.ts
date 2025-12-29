import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import expenseRoutes from '../src/routes/expense.routes';

// Mock Auth Middleware
vi.mock('../src/middleware/auth', () => ({
  authenticate: (req: any, res: any, next: any) => {
    req.userId = 'test-user-id';
    next();
  },
  requireAdmin: (req: any, res: any, next: any) => next(),
}));

// Mock Redis
vi.mock('../src/config/redis', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    setex: vi.fn(),
    del: vi.fn(),
    keys: vi.fn().mockResolvedValue([]),
  }
}));

// Mock Prisma
vi.mock('../src/utils/db', () => ({
  prisma: {
    expense: {
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({ id: '1', amount: 100 }),
    },
    category: {
      findUnique: vi.fn().mockResolvedValue({ id: 'cat-1', name: 'Food' }),
    }
  }
}));

const app = express();
app.use(express.json());
app.use('/', expenseRoutes);

describe('Expense API', () => {
  it('GET / should return empty array initially', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST / should create expense', async () => {
    const res = await request(app)
      .post('/')
      .send({
        amount: 100,
        description: 'Test',
        date: new Date(),
        paymentMethod: 'CASH',
        categoryId: 'cat-1'
      });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});
