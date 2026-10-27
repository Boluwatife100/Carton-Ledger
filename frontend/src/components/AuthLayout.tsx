import { Milk } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: Props) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-carton-500 p-12 text-milk-50 lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-6 rounded-3xl border border-dashed border-white/25" />
        <div className="relative flex items-center gap-2.5 font-display text-xl font-semibold">
          <Milk size={22} />
          Carton Ledger
        </div>
        <div className="relative">
          <h2 className="max-w-md font-display text-5xl font-semibold leading-[1.05]">
            Log it in seconds. See it by day, week and category.
          </h2>
          <p className="mt-5 max-w-sm text-milk-200/90">
            Every expense in one place, with a dashboard and reports that show
            where the month is going.
          </p>
        </div>
        <p className="relative text-sm text-white/70">Your data stays safe.</p>
      </aside>

      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 font-display text-lg font-semibold lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-carton-500 text-white">
              <Milk size={18} />
            </span>
            Carton Ledger
          </div>
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm text-ink-soft">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-6 text-center text-sm text-ink-soft">{footer}</p>
        </div>
      </main>
    </div>
  );
}
