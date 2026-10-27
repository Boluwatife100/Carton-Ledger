import { Expense } from "@prisma/client";
import { toKey } from "../utils/dates";

export const serializeExpense = (e: Expense) => ({
  id: e.id,
  title: e.title,
  amount: Number(e.amount),
  category: e.category,
  note: e.note,
  date: toKey(e.date),
  createdAt: e.createdAt,
});
