import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { money, periodLabel, shortDate } from "../lib/format";
import type { Period, SeriesPoint } from "../types";

export default function SpendBars({ data, period }: { data: SeriesPoint[]; period: Period }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#EBE2CA" strokeDasharray="4 4" />
          <XAxis
            dataKey="date"
            tickFormatter={(d: string) => shortDate(d)}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#7B8194" }}
            interval="preserveStartEnd"
            minTickGap={16}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={44}
            tick={{ fontSize: 12, fill: "#7B8194" }}
            tickFormatter={(v: number) => (v >= 1000 ? `${Math.round(v / 100) / 10}k` : String(v))}
          />
          <Tooltip
            cursor={{ fill: "#F5EFDF" }}
            formatter={(value) => [money(Number(value)), "Spent"]}
            labelFormatter={(label) => periodLabel(String(label), period)}
            contentStyle={{ borderRadius: 12, border: "1px solid #EBE2CA", background: "#FFFEFA", fontSize: 13 }}
          />
          <Bar dataKey="total" fill="#2F5D9E" radius={[6, 6, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
