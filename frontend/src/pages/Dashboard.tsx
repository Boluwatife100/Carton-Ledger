import { ArrowDownRight, ArrowUpRight, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import CategoryPie from "../components/CategoryPie";
import EmptyState from "../components/EmptyState";
import ErrorNote from "../components/ErrorNote";
import ExpenseModal from "../components/ExpenseModal";
import ExpenseRow from "../components/ExpenseRow";
import SpendBars from "../components/SpendBars";
import Spinner from "../components/Spinner";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import { useFetch } from "../hooks/useFetch";
import { api } from "../lib/api";
import { money } from "../lib/format";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data, error, loading, reload } = useFetch(() => api.dashboard(), []);
  const [adding, setAdding] = useState(false);

  const firstName = user?.name.split(" ")[0] ?? "";

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">
            {greeting()}, {firstName}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <button className="btn-primary" onClick={() => setAdding(true)}>
          <Plus size={16} />
          Add expense
        </button>
      </div>

      {error && <ErrorNote message={error} onRetry={reload} />}
      {loading && !data && <Spinner />}

      {data && (
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Signature: the carton label */}
            <section className="relative overflow-hidden rounded-2xl bg-carton-500 p-7 text-milk-50 shadow-card lg:col-span-2">
              <div className="pointer-events-none absolute inset-2.5 rounded-xl border border-dashed border-white/30" />
              <div className="relative flex h-full flex-col justify-between gap-8">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs font-medium uppercase tracking-widest text-white/75">Spent this month</p>
                  <span className="rounded-lg border border-white/30 px-2.5 py-1 text-xs text-white/85">
                    Resets in {data.daysLeftInMonth} {data.daysLeftInMonth === 1 ? "day" : "days"}
                  </span>
                </div>
                <div>
                  <p className="font-display text-5xl font-semibold tabular-nums md:text-6xl">{money(data.month)}</p>
                  <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/80">
                    {data.changePct === null ? (
                      <span>No spending last month to compare with</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/15 px-2 py-0.5 font-medium text-white">
                        {data.changePct > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {Math.abs(data.changePct)}% {data.changePct > 0 ? "more" : "less"} than last month
                      </span>
                    )}
                    <span>
                      {data.monthCount} {data.monthCount === 1 ? "expense" : "expenses"} logged
                    </span>
                  </p>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              <StatCard label="Today" value={money(data.today)} />
              <StatCard label="This week" value={money(data.week)} hint="Since Monday" />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <section className="card p-5 lg:col-span-2">
              <h2 className="mb-4 text-lg font-semibold">Last 7 days</h2>
              <SpendBars data={data.last7Days} period="daily" />
            </section>
            <section className="card p-5">
              <h2 className="mb-4 text-lg font-semibold">Where it went this month</h2>
              <CategoryPie data={data.byCategory} />
            </section>
          </div>

          <section className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4">
              <h2 className="text-lg font-semibold">Recent expenses</h2>
              <Link to="/expenses" className="text-sm font-medium text-carton-600 hover:underline">
                View all
              </Link>
            </div>
            {data.recent.length === 0 ? (
              <EmptyState
                title="No expenses yet"
                text="Log your first one and the dashboard fills in."
                action={
                  <button className="btn-primary" onClick={() => setAdding(true)}>
                    <Plus size={16} />
                    Add expense
                  </button>
                }
              />
            ) : (
              <ul className="divide-y divide-dashed divide-milk-300 border-t border-milk-300">
                {data.recent.map((e) => (
                  <ExpenseRow key={e.id} expense={e} />
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      <ExpenseModal open={adding} expense={null} onClose={() => setAdding(false)} onSaved={reload} />
    </div>
  );
}
