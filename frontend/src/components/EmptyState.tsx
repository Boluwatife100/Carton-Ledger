import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

export default function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-carton-50 text-carton-500">
        <Inbox size={22} />
      </span>
      <p className="font-display text-lg font-semibold">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-ink-soft">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
