import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { HttpError } from "../lib/errors";
import { prisma } from "../lib/prisma";
import { serializeExpense } from "../lib/serialize";
import { requireAuth } from "../middleware/auth";
import { SeriesPoint, buildSeries, byCategory, round, sum, toRows } from "../utils/aggregate";
import { DAY_MS, addDays, parseDate, startOfMonth, startOfWeek, toKey, today } from "../utils/dates";
import { reportQuery } from "../validation";

const router = Router();
router.use(requireAuth);

/** Everything the dashboard screen needs in one request. */
router.get(
  "/dashboard",
  asyncHandler(async (req, res) => {
    const userId = req.userId!;
    const now = today();
    const monthStart = startOfMonth(now);
    const prevMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
    const nextMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
    const weekStart = startOfWeek(now);

    const [items, recent] = await Promise.all([
      prisma.expense.findMany({ where: { userId, date: { gte: prevMonthStart, lt: nextMonthStart } } }),
      prisma.expense.findMany({
        where: { userId },
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
        take: 6,
      }),
    ]);

    const rows = toRows(items);
    const monthRows = rows.filter((r) => r.date >= monthStart);
    const month = sum(monthRows);
    const prevMonth = sum(rows.filter((r) => r.date < monthStart));

    res.json({
      today: sum(rows.filter((r) => toKey(r.date) === toKey(now))),
      week: sum(rows.filter((r) => r.date >= weekStart && r.date <= now)),
      month,
      prevMonth,
      changePct: prevMonth > 0 ? round(((month - prevMonth) / prevMonth) * 100) : null,
      daysLeftInMonth: Math.round((nextMonthStart.getTime() - now.getTime()) / DAY_MS),
      monthCount: monthRows.length,
      byCategory: byCategory(monthRows),
      last7Days: buildSeries(rows, addDays(now, -6), now, "daily"),
      recent: recent.map(serializeExpense),
    });
  })
);

/** Daily or weekly breakdown for any date range up to one year. */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const q = reportQuery.parse(req.query);

    const to = q.to ? parseDate(q.to) : today();
    const from = q.from
      ? parseDate(q.from)
      : q.period === "daily"
        ? addDays(to, -6)
        : addDays(startOfWeek(to), -49);

    if (from > to) throw new HttpError(400, "The start date must be before the end date");
    if ((to.getTime() - from.getTime()) / DAY_MS > 366) throw new HttpError(400, "Pick a range of one year or less");

    const queryFrom = q.period === "weekly" ? startOfWeek(from) : from;
    const items = await prisma.expense.findMany({
      where: { userId: req.userId!, date: { gte: queryFrom, lte: to } },
      orderBy: { date: "desc" },
    });

    const rows = toRows(items);
    const series = buildSeries(rows, from, to, q.period);
    const total = sum(rows);

    const peak = series.reduce<SeriesPoint | null>((best, p) => (!best || p.total > best.total ? p : best), null);
    const top = items.reduce<(typeof items)[number] | null>(
      (best, e) => (!best || Number(e.amount) > Number(best.amount) ? e : best),
      null
    );

    res.json({
      period: q.period,
      from: toKey(from),
      to: toKey(to),
      total,
      count: rows.length,
      average: series.length ? round(total / series.length) : 0,
      peak: peak && peak.total > 0 ? peak : null,
      topExpense: top ? serializeExpense(top) : null,
      byCategory: byCategory(rows),
      series,
    });
  })
);

export default router;
