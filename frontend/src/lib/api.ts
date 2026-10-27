import type { Category, Dashboard, Expense, ExpenseInput, ExpensePage, Period, Report, User } from "../types";

const BASE: string = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";
const TOKEN_KEY = "carton_ledger_token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public fields?: Record<string, string[]>
  ) {
    super(message);
  }
}

/** One readable sentence for any error, preferring the first field-level message. */
export function describeError(err: unknown): string {
  if (err instanceof ApiError) {
    const first = err.fields && Object.values(err.fields).flat()[0];
    return first ?? err.message;
  }
  return err instanceof Error ? err.message : "Something went wrong";
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = tokenStore.get();
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new ApiError(0, "Can't reach the server. Check your connection and try again.");
  }

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && token) window.dispatchEvent(new Event("auth:expired"));
    throw new ApiError(res.status, data.error ?? "Something went wrong", data.details);
  }
  return data as T;
}

const qs = (params: Record<string, string | number | undefined>) => {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
};

export interface ExpenseFilters {
  search?: string;
  category?: Category | "";
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export const api = {
  register: (name: string, email: string, password: string) =>
    request<{ token: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),
  login: (email: string, password: string) =>
    request<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  me: () => request<{ user: User }>("/auth/me"),

  listExpenses: (filters: ExpenseFilters) => request<ExpensePage>(`/expenses${qs({ ...filters })}`),
  createExpense: (input: ExpenseInput) =>
    request<Expense>("/expenses", { method: "POST", body: JSON.stringify(input) }),
  updateExpense: (id: string, input: ExpenseInput) =>
    request<Expense>(`/expenses/${id}`, { method: "PUT", body: JSON.stringify(input) }),
  deleteExpense: (id: string) => request<void>(`/expenses/${id}`, { method: "DELETE" }),

  dashboard: () => request<Dashboard>("/reports/dashboard"),
  report: (period: Period, from: string, to: string) => request<Report>(`/reports${qs({ period, from, to })}`),
};
