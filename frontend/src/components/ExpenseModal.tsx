import { Loader2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { api, describeError } from "../lib/api";
import { CATEGORY_LIST, CATEGORY_META } from "../lib/categories";
import { localISO } from "../lib/format";
import type { Category, Expense } from "../types";
import Modal from "./Modal";

interface Props {
  open: boolean;
  expense: Expense | null; // null = adding a new one
  onClose: () => void;
  onSaved: () => void;
}

export default function ExpenseModal({ open, expense, onClose, onSaved }: Props) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("FOOD");
  const [date, setDate] = useState(localISO());
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitle(expense?.title ?? "");
    setAmount(expense ? String(expense.amount) : "");
    setCategory(expense?.category ?? "FOOD");
    setDate(expense?.date ?? localISO());
    setNote(expense?.note ?? "");
    setError(null);
  }, [open, expense]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!title.trim()) return setError("Give this expense a title");
    if (!Number.isFinite(value) || value <= 0) return setError("Enter an amount greater than zero");

    setBusy(true);
    setError(null);
    try {
      const input = { title: title.trim(), amount: value, category, date, note: note.trim() || null };
      if (expense) await api.updateExpense(expense.id, input);
      else await api.createExpense(input);
      onSaved();
      onClose();
    } catch (err) {
      setError(describeError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} title={expense ? "Edit expense" : "Add expense"} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label" htmlFor="exp-title">
            What was it for?
          </label>
          <input
            id="exp-title"
            className="input"
            placeholder="Groceries, bus fare, rent…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="exp-amount">
              Amount
            </label>
            <input
              id="exp-amount"
              className="input font-mono"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="exp-date">
              Date
            </label>
            <input id="exp-date" type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>

        <fieldset>
          <legend className="label">Category</legend>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORY_LIST.map((c) => {
              const meta = CATEGORY_META[c];
              const active = c === category;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  aria-pressed={active}
                  className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-2 text-left text-xs font-medium transition ${
                    active
                      ? "border-carton-500 bg-carton-50 text-carton-700"
                      : "border-milk-300 bg-white/60 text-ink-soft hover:bg-milk-200"
                  }`}
                >
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: meta.color }} />
                  <span className="truncate">{meta.label}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label className="label" htmlFor="exp-note">
            Note (optional)
          </label>
          <input id="exp-note" className="input" value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} />
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-stamp-50 px-3 py-2 text-sm text-stamp-600">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={busy}>
            {busy && <Loader2 size={16} className="animate-spin" />}
            {expense ? "Save changes" : "Add expense"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
