export type Category =
  | "FOOD"
  | "TRANSPORT"
  | "HOUSING"
  | "UTILITIES"
  | "HEALTH"
  | "ENTERTAINMENT"
  | "SHOPPING"
  | "EDUCATION"
  | "OTHER";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: Category;
  note: string | null;
  date: string; // YYYY-MM-DD
  createdAt: string;
}

export interface ExpenseInput {
  title: string;
  amount: number;
  category: Category;
  note?: string | null;
  date: string;
}

export interface ExpensePage {
  items: Expense[];
  total: number;
  page: number;
  pages: number;
  sum: number;
}

export interface CategoryShare {
  category: Category;
  total: number;
  percent: number;
}

export interface SeriesPoint {
  date: string;
  total: number;
}

export type Period = "daily" | "weekly";

export interface Dashboard {
  today: number;
  week: number;
  month: number;
  prevMonth: number;
  changePct: number | null;
  daysLeftInMonth: number;
  monthCount: number;
  byCategory: CategoryShare[];
  last7Days: SeriesPoint[];
  recent: Expense[];
}

export interface Report {
  period: Period;
  from: string;
  to: string;
  total: number;
  count: number;
  average: number;
  peak: SeriesPoint | null;
  topExpense: Expense | null;
  byCategory: CategoryShare[];
  series: SeriesPoint[];
}
