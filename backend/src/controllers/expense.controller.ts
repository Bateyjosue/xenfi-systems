import { Response, RequestHandler } from "express";
import { AuthRequest, CreateExpenseDto, UpdateExpenseDto } from "../types";
import { prisma } from "../utils/db";

export const getExpenses: RequestHandler = async (req, res) => {
  try {
    const { startDate, endDate, categoryId } = req.query;
    const userId = (req as AuthRequest).userId!;

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
      },
    });

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

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({ error: "Failed to delete expense" });
  }
};
