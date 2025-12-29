import { Response } from "express";
import { AuthRequest } from "../types";
import { prisma } from "../utils/db";

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { startDate, endDate, categoryId } = req.query;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    const dateFilter = {
      date: {
        gte: startDate ? new Date(startDate as string) : startOfMonth,
        lte: endDate ? new Date(endDate as string) : endOfMonth,
      },
    };

    const where: any = {
      userId,
      ...dateFilter,
    };

    if (categoryId) {
      where.categoryId = categoryId as string;
    }

    // Total expenses for current month
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

    res.json({
      totalExpenses: totalExpenses._sum.amount || 0,
      categoryBreakdown,
      recentExpenses,
      dateRange: {
        start: dateFilter.date.gte,
        end: dateFilter.date.lte,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};
