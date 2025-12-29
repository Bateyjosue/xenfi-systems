import { Response, RequestHandler } from "express";
import { AuthRequest } from "../types";
import { prisma } from "../utils/db";

export const getAdminStats: RequestHandler = async (req, res) => {
  try {
    // User statistics
    const totalUsers = await prisma.user.count();
    const adminUsers = await prisma.user.count({ where: { role: "ADMIN" } });
    const staffUsers = await prisma.user.count({ where: { role: "STAFF" } });

    // Expense statistics
    const totalExpenses = await prisma.expense.count();
    const totalExpenseAmount = await prisma.expense.aggregate({
      _sum: { amount: true },
    });

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentExpenses = await prisma.expense.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    const recentUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Expenses by user
    const expensesByUser = await prisma.expense.groupBy({
      by: ["userId"],
      _count: {
        id: true,
      },
      _sum: {
        amount: true,
      },
    });

    const userIds = expensesByUser.map((e) => e.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    const userExpenseStats = expensesByUser.map((stat) => {
      const user = users.find((u) => u.id === stat.userId);
      return {
        userId: stat.userId,
        userName: user?.name || user?.email || "Unknown",
        userEmail: user?.email,
        userRole: user?.role,
        expenseCount: stat._count.id,
        totalAmount: stat._sum.amount || 0,
      };
    });

    // Category usage statistics
    const categoryUsage = await prisma.expense.groupBy({
      by: ["categoryId"],
      _count: {
        id: true,
      },
      _sum: {
        amount: true,
      },
    });

    const categoryIds = categoryUsage.map((c) => c.categoryId);
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
    });

    const categoryStats = categoryUsage.map((stat) => {
      const category = categories.find((c) => c.id === stat.categoryId);
      return {
        categoryId: stat.categoryId,
        categoryName: category?.name || "Unknown",
        usageCount: stat._count.id,
        totalAmount: stat._sum.amount || 0,
      };
    });

    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyExpenses = await prisma.expense.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        amount: true,
        createdAt: true,
      },
    });

    const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthExpenses = monthlyExpenses.filter(
        (e) => e.createdAt >= monthStart && e.createdAt <= monthEnd
      );

      return {
        month: date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        }),
        count: monthExpenses.length,
        total: monthExpenses.reduce((sum, e) => sum + e.amount, 0),
      };
    });

    res.json({
      users: {
        total: totalUsers,
        admins: adminUsers,
        staff: staffUsers,
        recent: recentUsers,
      },
      expenses: {
        total: totalExpenses,
        totalAmount: totalExpenseAmount._sum.amount || 0,
        recent: recentExpenses,
      },
      userExpenseStats,
      categoryStats: categoryStats.sort((a, b) => b.usageCount - a.usageCount),
      monthlyTrend,
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    res.status(500).json({ error: "Failed to fetch admin statistics" });
  }
};

export const getAllExpenses: RequestHandler = async (req, res) => {
  try {
    const { startDate, endDate, categoryId, userId } = req.query;

    const where: any = {};

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    if (categoryId) {
      where.categoryId = categoryId as string;
    }

    if (userId) {
      where.userId = userId as string;
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
            role: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    res.json(expenses);
  } catch (error) {
    console.error("Get all expenses error:", error);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

export const getAllUsers: RequestHandler = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            expenses: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
