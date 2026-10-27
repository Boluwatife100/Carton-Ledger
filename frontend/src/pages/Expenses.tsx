import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import ErrorNote from "../components/ErrorNote";
import ExpenseModal from "../components/ExpenseModal";
import ExpenseRow from "../components/ExpenseRow";
import Spinner from "../components/Spinner";
import { useDebounced, useFetch } from "../hooks/useFetch";
import { api, describeError } from "../lib/api";
import { CATEGORY_LIST, CATEGORY_META } from "../lib/categories";
import { money } from "../lib/format";
import type { Category, Expense } from "../types";

const PAGE_SIZE = 10;

export default function Expenses() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounced(search);
  const { data, error, loading, reload } = useFetch(
    () => api.listExpenses({ search: debouncedSearch, category, from, to, page, limit: PAGE_SIZE }),
    [debouncedSearch, category, from, to, page]
  );

  const [editor, setEditor] = useState<{ open: boolean; expense: Expense | null }>({ open: false, expense: null });
  const [deleting, setDeleting] = useState<Expense | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const filtered = Boolean(debouncedSearch || category || from || to);

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await api.deleteExpense(deleting.id);
      setDeleting(null);
      reload();
    } catch (err) {
      setDeleteError(describeError(err));
      setDeleting(null);
    } finally {
      setDeleteBusy(false);
    }
  }

  function clearFilters() {
    setSearch("");
    setCategory("");
    setFrom("");
    setTo("");
    setPage(1);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Expenses</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {data
              ? `${data.total} ${data.total === 1 ? "expense" : "expenses"}${filtered ? " match" : ""} · ${money(data.sum)} total`
              : "Search, filter and edit everything you've logged."}
          </p>
        </div>
        <button className="btn-primary" onClick={() => setEditor({ open: true, expense: null })}>
          <Plus size={16} />
          Add expense
        </button>
      </div>

      <div className="card mb-4 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mute" />
          <input
            className="input pl-10"
            placeholder="Search by title"
            aria-label="Search by title"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <select
          className="input"
          aria-label="Category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value as Category | "");
            setPage(1);
          }}
        >
          <option value="">All categories</option>
          {CATEGORY_LIST.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_META[c].label}
            </option>
          ))}
        </select>
        <input
          type="date"
          className="input"
          aria-label="From date"
          value={from}
          onChange={(e) => {
            setFrom(e.target.value);
            setPage(1);
          }}
        />
        <input
          type="date"
          className="input"
          aria-label="To date"
          value={to}
          onChange={(e) => {
            setTo(e.target.value);
            setPage(1);
          }}
        />
        <button className="btn-ghost" onClick={clearFilters} disabled={!filtered && !search}>
          Clear
        </button>
      </div>

      {error && <ErrorNote message={error} onRetry={reload} />}
      {deleteError && <ErrorNote message={deleteError} />}
      {loading && !data && <Spinner />}

      {data && (
        <section className="card overflow-hidden">
          {data.items.length === 0 ? (
            <EmptyState
              title={filtered ? "No expenses match those filters" : "No expenses yet"}
              text={filtered ? "Try a wider date range or a different category." : "Add your first expense to get started."}
              action={
                filtered ? (
                  <button className="btn-ghost" onClick={clearFilters}>
                    Clear filters
                  </button>
                ) : (
                  <button className="btn-primary" onClick={() => setEditor({ open: true, expense: null })}>
                    <Plus size={16} />
                    Add expense
                  </button>
                )
              }
            />
          ) : (
            <ul className="divide-y divide-dashed divide-milk-300">
              {data.items.map((e) => (
                <ExpenseRow
                  key={e.id}
                  expense={e}
                  onEdit={(x) => setEditor({ open: true, expense: x })}
                  onDelete={(x) => {
                    setDeleteError(null);
                    setDeleting(x);
                  }}
                />
              ))}
            </ul>
          )}

          {data.pages > 1 && (
            <div className="flex items-center justify-between border-t border-milk-300 px-4 py-3 text-sm">
              <span className="text-ink-soft">
                Page {data.page} of {data.pages}
              </span>
              <div className="flex gap-2">
                <button className="btn-ghost px-3" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <button className="btn-ghost px-3" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)}>
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      <ExpenseModal
        open={editor.open}
        expense={editor.expense}
        onClose={() => setEditor((s) => ({ ...s, open: false }))}
        onSaved={reload}
      />

      <ConfirmDialog
        open={deleting !== null}
        title="Delete this expense?"
        message={deleting ? `"${deleting.title}" (${money(deleting.amount)}) will be removed for good.` : ""}
        confirmLabel="Delete expense"
        busy={deleteBusy}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
