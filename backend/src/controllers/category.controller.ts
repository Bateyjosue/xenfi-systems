import { Response, RequestHandler } from "express";
import { AuthRequest, CreateCategoryDto, UpdateCategoryDto } from "../types";
import { prisma } from "../utils/db";

export const getCategories: RequestHandler = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

export const getCategory: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Get category error:", error);
    res.status(500).json({ error: "Failed to fetch category" });
  }
};

export const createCategory: RequestHandler = async (
  req,
  res
) => {
  try {
    const { name, description } = req.body as CreateCategoryDto;

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    // Check if category already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
};

export const updateCategory: RequestHandler = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body as UpdateCategoryDto;

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    // If name is being updated, check for duplicates
    if (name && name !== existingCategory.name) {
      const duplicateCategory = await prisma.category.findUnique({
        where: { name },
      });

      if (duplicateCategory) {
        return res.status(400).json({ error: "Category name already exists" });
      }
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    res.json(category);
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
};

export const deleteCategory: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Check if category is used by any expenses
    const expensesCount = await prisma.expense.count({
      where: { categoryId: id },
    });

    if (expensesCount > 0) {
      return res.status(400).json({
        error: "Cannot delete category that is used by expenses",
      });
    }

    await prisma.category.delete({
      where: { id },
    });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
};
