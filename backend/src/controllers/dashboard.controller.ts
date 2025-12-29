import { Response, RequestHandler } from "express";
import { AuthRequest } from "../types";
import { prisma } from "../utils/db";

export const getDashboardStats: RequestHandler = async (req, res) => {
  try {
    const userId = (req as AuthRequest).userId!;
    const { startDate, endDate, categoryId } = req.query;

    const where: any = {
      userId,
    };

    // Only apply date filters if explicitly provided
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    if (categoryId) {
      where.categoryId = categoryId as string;
    }

    // Total expenses for the period
    const totalExpenses = await prisma.expense.aggregate({
      where,
      _sum: {
        amount: true,
      },
    });

    // Breakdown by category
    const expensesByCategory = await prisma.expense.groupBy({
      by: ["categoryId"],
      where,
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });

    // Get category details
    const categoryIds = expensesByCategory.map((e) => e.categoryId);
    const categories = await prisma.category.findMany({
      where: {
        id: { in: categoryIds },
      },
    });

    const categoryBreakdown = expensesByCategory.map((expense) => {
      const category = categories.find((c) => c.id === expense.categoryId);
      return {
        categoryId: expense.categoryId,
        categoryName: category?.name || "Unknown",
        total: expense._sum.amount || 0,
        count: expense._count.id,
      };
    });

    // Recent expenses (last 10)
    const recentExpenses = await prisma.expense.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
      take: 10,
    });

    // Calculate date range for display
    const now = new Date();
    const dateRange = {
      start: startDate ? new Date(startDate as string) : new Date(now.getFullYear(), 0, 1), // Start of current year if no filter
      end: endDate ? new Date(endDate as string) : now,
    };

    res.json({
      totalExpenses: totalExpenses._sum.amount || 0,
      categoryBreakdown,
      recentExpenses,
      dateRange,
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};
