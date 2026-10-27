import { Category, Prisma } from "@prisma/client";
import { addDays, startOfDay, startOfWeek, toKey } from "./dates";

export type Row = { amount: number; category: Category; date: Date };
export type SeriesPoint = { date: string; total: number };

export const round = (n: number) => Math.round(n * 100) / 100;

export const toRows = (items: { amount: Prisma.Decimal; category: Category; date: Date }[]): Row[] =>
  items.map((i) => ({ amount: Number(i.amount), category: i.category, date: i.date }));

export const sum = (rows: Row[]) => round(rows.reduce((s, r) => s + r.amount, 0));

export function byCategory(rows: Row[]) {
  const totals = new Map<Category, number>();
  for (const r of rows) totals.set(r.category, (totals.get(r.category) ?? 0) + r.amount);
  const grand = rows.reduce((s, r) => s + r.amount, 0);
  return [...totals.entries()]
    .map(([category, total]) => ({
      category,
      total: round(total),
      percent: grand > 0 ? round((total / grand) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

/** One bucket per day (or per Monday-based week), including empty ones. */
export function buildSeries(rows: Row[], from: Date, to: Date, period: "daily" | "weekly"): SeriesPoint[] {
  const buckets = new Map<string, number>();
  const step = period === "daily" ? 1 : 7;
  let cursor = period === "daily" ? startOfDay(from) : startOfWeek(from);
  while (cursor <= to) {
    buckets.set(toKey(cursor), 0);
    cursor = addDays(cursor, step);
  }
  for (const r of rows) {
    const key = toKey(period === "daily" ? startOfDay(r.date) : startOfWeek(r.date));
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + r.amount);
  }
  return [...buckets.entries()].map(([date, total]) => ({ date, total: round(total) }));
}
