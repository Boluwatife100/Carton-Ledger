import { Category, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const templates: Array<[string, Category, number, number]> = [
  ["Groceries", "FOOD", 15, 80],
  ["Lunch out", "FOOD", 8, 25],
  ["Coffee", "FOOD", 3, 7],
  ["Bus pass", "TRANSPORT", 10, 40],
  ["Ride share", "TRANSPORT", 6, 30],
  ["Electricity bill", "UTILITIES", 30, 90],
  ["Internet", "UTILITIES", 25, 45],
  ["Pharmacy", "HEALTH", 8, 40],
  ["Cinema", "ENTERTAINMENT", 10, 25],
  ["Streaming", "ENTERTAINMENT", 8, 16],
  ["New shoes", "SHOPPING", 40, 120],
  ["Online course", "EDUCATION", 15, 60],
  ["Rent share", "HOUSING", 120, 300],
];

const rand = (min: number, max: number) => Math.round((min + Math.random() * (max - min)) * 100) / 100;

async function main() {
  const email = "demo@expensetracker.dev";
  const passwordHash = await bcrypt.hash("demo12345", 12);
  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, name: "Demo User", passwordHash },
  });

  await prisma.expense.deleteMany({ where: { userId: user.id } });

  const now = new Date();
  const base = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const data = Array.from({ length: 70 }, () => {
    const [title, category, min, max] = templates[Math.floor(Math.random() * templates.length)];
    const daysAgo = Math.floor(Math.random() * 56);
    return { title, category, amount: rand(min, max), date: new Date(base - daysAgo * 86_400_000), userId: user.id };
  });

  await prisma.expense.createMany({ data });
  console.log(`Seeded ${data.length} expenses for ${email} (password: demo12345)`);
}

main().finally(() => prisma.$disconnect());
