import { Prisma } from "@prisma/client";
import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { HttpError } from "../lib/errors";
import { prisma } from "../lib/prisma";
import { serializeExpense } from "../lib/serialize";
import { requireAuth } from "../middleware/auth";
import { parseDate } from "../utils/dates";
import { expenseSchema, listQuery } from "../validation";

const router = Router();
router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const q = listQuery.parse(req.query);

    const where: Prisma.ExpenseWhereInput = {
      userId: req.userId!,
      ...(q.category ? { category: q.category } : {}),
      ...(q.search ? { title: { contains: q.search, mode: "insensitive" as const } } : {}),
      ...(q.from || q.to
        ? {
            date: {
              ...(q.from ? { gte: parseDate(q.from) } : {}),
              ...(q.to ? { lte: parseDate(q.to) } : {}),
            },
          }
        : {}),
    };

    const [items, total, agg] = await Promise.all([
      prisma.expense.findMany({
        where,
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
        skip: (q.page - 1) * q.limit,
        take: q.limit,
      }),
      prisma.expense.count({ where }),
      prisma.expense.aggregate({ where, _sum: { amount: true } }),
    ]);

    res.json({
      items: items.map(serializeExpense),
      total,
      page: q.page,
      pages: Math.max(1, Math.ceil(total / q.limit)),
      sum: Number(agg._sum.amount ?? 0),
    });
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const body = expenseSchema.parse(req.body);
    const expense = await prisma.expense.create({
      data: {
        title: body.title,
        amount: body.amount,
        category: body.category,
        note: body.note || null,
        date: parseDate(body.date),
        userId: req.userId!,
      },
    });
    res.status(201).json(serializeExpense(expense));
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const body = expenseSchema.parse(req.body);
    const existing = await prisma.expense.findFirst({ where: { id: req.params.id, userId: req.userId! } });
    if (!existing) throw new HttpError(404, "Expense not found");

    const expense = await prisma.expense.update({
      where: { id: existing.id },
      data: {
        title: body.title,
        amount: body.amount,
        category: body.category,
        note: body.note || null,
        date: parseDate(body.date),
      },
    });
    res.json(serializeExpense(expense));
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { count } = await prisma.expense.deleteMany({ where: { id: req.params.id, userId: req.userId! } });
    if (count === 0) throw new HttpError(404, "Expense not found");
    res.status(204).end();
  })
);

export default router;
