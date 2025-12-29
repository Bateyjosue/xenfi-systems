import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@xenfi.com" },
    update: {},
    create: {
      email: "admin@xenfi.com",
      password: adminPassword,
      name: "Admin User",
      role: "ADMIN",
    },
  });

  // Create staff user
  const staffPassword = await bcrypt.hash("staff123", 10);
  const staff = await prisma.user.upsert({
    where: { email: "staff@xenfi.com" },
    update: {},
    create: {
      email: "staff@xenfi.com",
      password: staffPassword,
      name: "Staff User",
      role: "STAFF",
    },
  });

  console.log("✅ Created users:", { admin: admin.email, staff: staff.email });

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: "Office Supplies" },
      update: {},
      create: {
        name: "Office Supplies",
        description: "Stationery, paper, pens, etc.",
      },
    }),
    prisma.category.upsert({
      where: { name: "Travel" },
      update: {},
      create: {
        name: "Travel",
        description: "Transportation, accommodation, meals",
      },
    }),
    prisma.category.upsert({
      where: { name: "Meals" },
      update: {},
      create: {
        name: "Meals",
        description: "Food and beverages",
      },
    }),
    prisma.category.upsert({
      where: { name: "Utilities" },
      update: {},
      create: {
        name: "Utilities",
        description: "Electricity, water, internet, etc.",
      },
    }),
    prisma.category.upsert({
      where: { name: "Software" },
      update: {},
      create: {
        name: "Software",
        description: "Software licenses and subscriptions",
      },
    }),
  ]);

  console.log("✅ Created categories:", categories.length);

  // Create sample expenses for current month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const expenses = await Promise.all([
    prisma.expense.create({
      data: {
        amount: 150.0,
        description: "Monthly office supplies",
        date: new Date(startOfMonth.getTime() + 2 * 24 * 60 * 60 * 1000),
        paymentMethod: "CARD",
        categoryId: categories[0].id,
        userId: admin.id,
      },
    }),
    prisma.expense.create({
      data: {
        amount: 250.0,
        description: "Team lunch",
        date: new Date(startOfMonth.getTime() + 5 * 24 * 60 * 60 * 1000),
        paymentMethod: "CARD",
        categoryId: categories[2].id,
        userId: staff.id,
      },
    }),
    prisma.expense.create({
      data: {
        amount: 500.0,
        description: "Monthly internet bill",
        date: new Date(startOfMonth.getTime() + 10 * 24 * 60 * 60 * 1000),
        paymentMethod: "BANK_TRANSFER",
        categoryId: categories[3].id,
        userId: admin.id,
      },
    }),
    prisma.expense.create({
      data: {
        amount: 99.0,
        description: "Software subscription",
        date: new Date(startOfMonth.getTime() + 15 * 24 * 60 * 60 * 1000),
        paymentMethod: "CARD",
        categoryId: categories[4].id,
        userId: admin.id,
      },
    }),
    prisma.expense.create({
      data: {
        amount: 75.0,
        description: "Taxi fare",
        date: new Date(startOfMonth.getTime() + 20 * 24 * 60 * 60 * 1000),
        paymentMethod: "MOBILE_MONEY",
        categoryId: categories[1].id,
        userId: staff.id,
      },
    }),
  ]);

  console.log("✅ Created expenses:", expenses.length);
  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
