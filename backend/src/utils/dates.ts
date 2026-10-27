export const DAY_MS = 86_400_000;

export const toKey = (d: Date) => d.toISOString().slice(0, 10);
export const parseDate = (s: string) => new Date(`${s}T00:00:00.000Z`);

export const startOfDay = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
export const startOfMonth = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
export const today = () => startOfDay(new Date());

export const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + n);
  return x;
};

/** Weeks start on Monday. */
export const startOfWeek = (d: Date) => addDays(startOfDay(d), -((d.getUTCDay() + 6) % 7));
