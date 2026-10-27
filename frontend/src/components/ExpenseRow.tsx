import { Pencil, Trash2 } from "lucide-react";
import { CATEGORY_META } from "../lib/categories";
import { money, shortDate } from "../lib/format";
import type { Expense } from "../types";

interface Props {
  expense: Expense;
  onEdit?: (e: Expense) => void;
  onDelete?: (e: Expense) => void;
}

export default function ExpenseRow({ expense, onEdit, onDelete }: Props) {
  const meta = CATEGORY_META[expense.category];
  return (
    <li className="flex items-center gap-3 px-4 py-3.5">
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
        style={{ background: `${meta.color}22` }}
        aria-hidden
      >
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: meta.color }} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{expense.title}</p>
        <p className="truncate text-xs text-ink-mute">
          {meta.label} · {shortDate(expense.date)}
          {expense.note ? ` · ${expense.note}` : ""}
        </p>
      </div>
      <span className="font-mono text-sm font-medium tabular-nums">{money(expense.amount)}</span>
      {(onEdit || onDelete) && (
        <div className="flex shrink-0 gap-0.5">
          {onEdit && (
            <button
              onClick={() => onEdit(expense)}
              aria-label={`Edit ${expense.title}`}
              className="rounded-lg p-2 text-ink-mute hover:bg-milk-200 hover:text-ink"
            >
              <Pencil size={15} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(expense)}
              aria-label={`Delete ${expense.title}`}
              className="rounded-lg p-2 text-ink-mute hover:bg-stamp-50 hover:text-stamp-500"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      )}
    </li>
  );
}
