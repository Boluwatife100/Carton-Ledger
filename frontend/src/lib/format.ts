import type { Period } from "../types";

const currency: string = import.meta.env.VITE_CURRENCY ?? "USD";
const formatter = new Intl.NumberFormat(undefined, { style: "currency", currency });

export const money = (n: number) => formatter.format(n);

const pad = (n: number) => String(n).padStart(2, "0");

/** Local calendar date as YYYY-MM-DD. */
export const localISO = (d: Date = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const shiftDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

export const mondayOf = (d: Date) => shiftDays(d, -((d.getDay() + 6) % 7));

const utc = (iso: string) => new Date(`${iso}T00:00:00Z`);

export const shortDate = (iso: string) =>
  utc(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", timeZone: "UTC" });

export const longDate = (iso: string) =>
  utc(iso).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });

export function periodLabel(iso: string, period: Period) {
  if (period === "daily") return longDate(iso);
  const end = utc(iso);
  end.setUTCDate(end.getUTCDate() + 6);
  return `${shortDate(iso)} to ${shortDate(end.toISOString().slice(0, 10))}`;
}
