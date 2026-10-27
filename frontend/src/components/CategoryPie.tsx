import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CATEGORY_META } from "../lib/categories";
import { money } from "../lib/format";
import type { CategoryShare } from "../types";
import EmptyState from "./EmptyState";

export default function CategoryPie({ data }: { data: CategoryShare[] }) {
  if (data.length === 0) {
    return <EmptyState title="Nothing to chart yet" text="Add an expense and its category will show up here." />;
  }

  const total = data.reduce((s, d) => s + d.total, 0);
  const chartData = data.map((d) => ({
    name: CATEGORY_META[d.category].label,
    value: d.total,
    color: CATEGORY_META[d.category].color,
    percent: d.percent,
  }));

  return (
    <div>
      <div className="relative h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="94%"
              paddingAngle={2}
              stroke="none"
            >
              {chartData.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => money(Number(value))}
              contentStyle={{ borderRadius: 12, border: "1px solid #EBE2CA", background: "#FFFEFA", fontSize: 13 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-ink-mute">Total</span>
          <span className="font-display text-xl font-semibold tabular-nums">{money(total)}</span>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {chartData.map((d) => (
          <li key={d.name} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: d.color }} />
            <span className="flex-1 truncate text-ink-soft">{d.name}</span>
            <span className="font-mono text-xs tabular-nums text-ink-mute">{d.percent}%</span>
            <span className="w-24 text-right font-mono text-sm tabular-nums">{money(d.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
