import { useMemo, useState } from "react";
import CategoryPie from "../components/CategoryPie";
import ErrorNote from "../components/ErrorNote";
import SpendBars from "../components/SpendBars";
import Spinner from "../components/Spinner";
import StatCard from "../components/StatCard";
import { useFetch } from "../hooks/useFetch";
import { api } from "../lib/api";
import { CATEGORY_META } from "../lib/categories";
import { localISO, mondayOf, money, periodLabel, shiftDays } from "../lib/format";
import type { Period } from "../types";

const SIZES: Record<Period, { label: string; n: number }[]> = {
  daily: [
    { label: "Last 7 days", n: 7 },
    { label: "Last 14 days", n: 14 },
    { label: "Last 30 days", n: 30 },
  ],
  weekly: [
    { label: "Last 4 weeks", n: 4 },
    { label: "Last 8 weeks", n: 8 },
    { label: "Last 12 weeks", n: 12 },
  ],
};

export default function Reports() {
  const [period, setPeriod] = useState<Period>("daily");
  const [sizeIdx, setSizeIdx] = useState(0);

  const { from, to } = useMemo(() => {
    const now = new Date();
    const n = SIZES[period][sizeIdx].n;
    const start = period === "daily" ? shiftDays(now, -(n - 1)) : shiftDays(mondayOf(now), -(n - 1) * 7);
    return { from: localISO(start), to: localISO(now) };
  }, [period, sizeIdx]);

  const { data, error, loading, reload } = useFetch(() => api.report(period, from, to), [period, from, to]);

  const unit = period === "daily" ? "day" : "week";
  const maxBucket = data ? Math.max(...data.series.map((s) => s.total), 1) : 1;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Reports</h1>
          <p className="mt-1 text-sm text-ink-soft">See how spending breaks down over time and by category.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div role="group" aria-label="Breakdown period" className="flex rounded-xl border border-milk-300 bg-milk-50 p-1">
            {(["daily", "weekly"] as Period[]).map((p) => (
              <button
                key={p}
                aria-pressed={period === p}
                onClick={() => {
                  setPeriod(p);
                  setSizeIdx(0);
                }}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                  period === p ? "bg-carton-500 text-white" : "text-ink-soft hover:bg-milk-200"
                }`}
              >
                {p === "daily" ? "Daily" : "Weekly"}
              </button>
            ))}
          </div>
          <select
            className="input w-auto"
            aria-label="Date range"
            value={sizeIdx}
            onChange={(e) => setSizeIdx(Number(e.target.value))}
          >
            {SIZES[period].map((s, i) => (
              <option key={s.label} value={i}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <ErrorNote message={error} onRetry={reload} />}
      {loading && !data && <Spinner />}

      {data && (
        <div className={`space-y-6 transition-opacity ${loading ? "opacity-60" : ""}`}>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Total spent" value={money(data.total)} hint={`${data.count} ${data.count === 1 ? "expense" : "expenses"}`} />
            <StatCard label={`Average per ${unit}`} value={money(data.average)} />
            <StatCard
              label={`Biggest ${unit}`}
              value={data.peak ? money(data.peak.total) : "None yet"}
              hint={data.peak ? periodLabel(data.peak.date, period) : undefined}
            />
            <StatCard
              label="Largest expense"
              value={data.topExpense ? money(data.topExpense.amount) : "None yet"}
              hint={data.topExpense?.title}
            />
          </div>

          <section className="card p-5">
            <h2 className="mb-4 text-lg font-semibold">{period === "daily" ? "Daily" : "Weekly"} spending</h2>
            <SpendBars data={data.series} period={period} />
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="card p-5">
              <h2 className="mb-4 text-lg font-semibold">By category</h2>
              <CategoryPie data={data.byCategory} />
            </section>

            <section className="card p-5">
              <h2 className="mb-4 text-lg font-semibold">{period === "daily" ? "Day by day" : "Week by week"}</h2>
              <ul className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
                {[...data.series].reverse().map((s) => (
                  <li key={s.date}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-ink-soft">{periodLabel(s.date, period)}</span>
                      <span className="font-mono tabular-nums">{money(s.total)}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-milk-200">
                      <div
                        className="h-full rounded-full bg-carton-500"
                        style={{ width: `${(s.total / maxBucket) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {data.byCategory.length > 0 && (
            <section className="card overflow-hidden">
              <h2 className="px-5 pt-5 text-lg font-semibold">Category totals</h2>
              <div className="overflow-x-auto">
                <table className="mt-3 w-full text-sm">
                  <thead>
                    <tr className="border-y border-milk-300 text-left text-xs uppercase tracking-wide text-ink-soft">
                      <th className="px-5 py-2.5 font-medium">Category</th>
                      <th className="px-5 py-2.5 text-right font-medium">Share</th>
                      <th className="px-5 py-2.5 text-right font-medium">Spent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dashed divide-milk-300">
                    {data.byCategory.map((c) => (
                      <tr key={c.category}>
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ background: CATEGORY_META[c.category].color }} />
                            {CATEGORY_META[c.category].label}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right font-mono tabular-nums text-ink-soft">{c.percent}%</td>
                        <td className="px-5 py-3 text-right font-mono tabular-nums">{money(c.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
