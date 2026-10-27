import { Category } from "@prisma/client";
import { z } from "zod";

export const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use the YYYY-MM-DD format");
export const categorySchema = z.nativeEnum(Category);

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(60),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  // bcrypt only uses the first 72 bytes, so cap the length.
  password: z.string().min(8, "Use at least 8 characters").max(72, "Use 72 characters or fewer"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export const expenseSchema = z.object({
  title: z.string().trim().min(1, "Give this expense a title").max(120),
  amount: z.coerce.number().positive("Amount must be greater than zero").max(1_000_000_000),
  category: categorySchema,
  note: z.string().trim().max(500).optional().nullable(),
  date: dateString,
});

export const listQuery = z.object({
  from: dateString.optional(),
  to: dateString.optional(),
  category: categorySchema.optional(),
  search: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const reportQuery = z.object({
  period: z.enum(["daily", "weekly"]).default("daily"),
  from: dateString.optional(),
  to: dateString.optional(),
});
