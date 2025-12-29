import { RequestHandler } from "express";
import { AuthRequest, CreateExpenseDto, UpdateExpenseDto } from "../types";
import { prisma } from "../utils/db";
import redis from "../config/redis";

const CACHE_TTL = 3600; // 1 hour

export const getExpenses: RequestHandler = async (req, res) => {
  try {
    const { startDate, endDate, categoryId } = req.query;
    const userId = (req as AuthRequest).userId!;

    const cacheKey = `expenses:${userId}:${JSON.stringify(req.query)}`;

    // Try to get from cache
    try {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }
    } catch (redisError) {
      console.error("Redis get error:", redisError);
      // Fallback to DB if redis fails
    }

    const where: any = { userId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    if (categoryId) {
      where.categoryId = categoryId as string;
    }

    const expenses = await prisma.expense.findMany({
      where,
      include: {
        category: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        updatedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    // Set cache
    try {
      await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(expenses));
    } catch (redisError) {
      console.error("Redis set error:", redisError);
    }

    res.json(expenses);
  } catch (error) {
    console.error("Get expenses error:", error);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

export const getExpense: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).userId!;

    const expense = await prisma.expense.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json(expense);
  } catch (error) {
    console.error("Get expense error:", error);
    res.status(500).json({ error: "Failed to fetch expense" });
  }
};

const invalidateUserCache = async (userId: string) => {
  try {
    const keys = await redis.keys(`expenses:${userId}:*`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error("Redis invalidation error:", error);
  }
};

export const createExpense: RequestHandler = async (
  req,
  res
) => {
  try {
    const userId = (req as AuthRequest).userId!;
    const {
      amount,
      description,
      date,
      paymentMethod,
      attachmentUrl,
      categoryId,
    } = req.body as CreateExpenseDto;

    if (!amount || !categoryId || !paymentMethod) {
      return res
        .status(400)
        .json({ error: "Amount, category, and payment method are required" });
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(400).json({ error: "Category not found" });
    }

    const expense = await prisma.expense.create({
      data: {
        amount: Number(amount),
        description,
        date: date ? new Date(date) : new Date(),
        paymentMethod,
        attachmentUrl,
        categoryId,
        userId,
        createdById: userId,
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        updatedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await invalidateUserCache(userId);

    res.status(201).json(expense);
  } catch (error) {
    console.error("Create expense error:", error);
    res.status(500).json({ error: "Failed to create expense" });
  }
};

export const updateExpense: RequestHandler = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).userId!;
    const {
      amount,
      description,
      date,
      paymentMethod,
      attachmentUrl,
      categoryId,
    } = req.body as UpdateExpenseDto;

    // Check if expense exists and belongs to user
    const existingExpense = await prisma.expense.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    // If categoryId is provided, verify it exists
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return res.status(400).json({ error: "Category not found" });
      }
    }

    const updateData: any = {};
    if (amount !== undefined) updateData.amount = Number(amount);
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) updateData.date = new Date(date);
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;
    if (attachmentUrl !== undefined) updateData.attachmentUrl = attachmentUrl;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    updateData.updatedById = userId; // Track who updated

    const expense = await prisma.expense.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        updatedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await invalidateUserCache(userId);

    res.json(expense);
  } catch (error) {
    console.error("Update expense error:", error);
    res.status(500).json({ error: "Failed to update expense" });
  }
};

export const deleteExpense: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).userId!;

    // Check if expense exists and belongs to user
    const expense = await prisma.expense.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    await prisma.expense.delete({
      where: { id },
    });

    await invalidateUserCache(userId);

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({ error: "Failed to delete expense" });
  }
};
