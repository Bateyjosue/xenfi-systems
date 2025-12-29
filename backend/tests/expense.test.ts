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
      findFirst: vi.fn(), // Dynamic return values in tests
      create: vi.fn().mockResolvedValue({ id: '1', amount: 100 }),
      update: vi.fn(),
      delete: vi.fn(),
    },
    category: {
      findUnique: vi.fn().mockResolvedValue({ id: 'cat-1', name: 'Food' }),
    }
  }
}));

import { prisma } from '../src/utils/db'; // Import to use in tests

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

  it('GET /:id should return single expense', async () => {
    // Mock specific finding behavior for this test
    vi.mocked(prisma.expense.findFirst).mockResolvedValueOnce({
      id: '1',
      amount: 100,
      description: 'Test',
      date: new Date(),
      paymentMethod: 'CASH',
      categoryId: 'cat-1',
      userId: 'test-user-id',
      attachmentUrl: null,
      createdById: 'test-user-id',
      updatedById: 'test-user-id',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const res = await request(app).get('/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', '1');
  });

  it('GET /:id should return 404 if not found', async () => {
    vi.mocked(prisma.expense.findFirst).mockResolvedValueOnce(null);

    const res = await request(app).get('/999');
    expect(res.status).toBe(404);
  });

  it('PUT /:id should update expense', async () => {
    // Mock findFirst (exists) and update
    vi.mocked(prisma.expense.findFirst).mockResolvedValueOnce({ id: '1', userId: 'test-user-id' } as any);
    vi.mocked(prisma.expense.update).mockResolvedValueOnce({
      id: '1',
      amount: 200, // Updated amount
    } as any);

    const res = await request(app)
      .put('/1')
      .send({ amount: 200 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('amount', 200);
  });

  it('DELETE /:id should delete expense', async () => {
    vi.mocked(prisma.expense.findFirst).mockResolvedValueOnce({ id: '1', userId: 'test-user-id' } as any);
    vi.mocked(prisma.expense.delete).mockResolvedValueOnce({ id: '1' } as any);

    const res = await request(app).delete('/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Expense deleted successfully');
  });

  it('POST / should fail validation with missing fields', async () => {
    const res = await request(app)
      .post('/')
      .send({
        description: 'Missing amount and category'
      });
    
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
