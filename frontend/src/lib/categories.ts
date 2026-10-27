import type { Category } from "../types";

export const CATEGORY_META: Record<Category, { label: string; color: string }> = {
  FOOD: { label: "Food & drink", color: "#2F5D9E" },
  TRANSPORT: { label: "Transport", color: "#E0A526" },
  HOUSING: { label: "Housing", color: "#5B8C5A" },
  UTILITIES: { label: "Utilities", color: "#7A6FB0" },
  HEALTH: { label: "Health", color: "#D64541" },
  ENTERTAINMENT: { label: "Entertainment", color: "#E27D9B" },
  SHOPPING: { label: "Shopping", color: "#3E9BA8" },
  EDUCATION: { label: "Education", color: "#9A6B3F" },
  OTHER: { label: "Other", color: "#8C8C84" },
};

export const CATEGORY_LIST = Object.keys(CATEGORY_META) as Category[];
