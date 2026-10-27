import { LayoutDashboard, LogOut, Milk, PieChart, Receipt } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/expenses", label: "Expenses", icon: Receipt, end: false },
  { to: "/reports", label: "Reports", icon: PieChart, end: false },
];

export default function AppShell() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen md:grid md:grid-cols-[250px_1fr]">
      {/* Sidebar (tablet and up) */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-milk-300 bg-milk-50 p-5 md:flex">
        <div className="mb-8 flex items-center gap-2.5 font-display text-lg font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-carton-500 text-white">
            <Milk size={18} />
          </span>
          Carton Ledger
        </div>

        <nav className="space-y-1" aria-label="Main">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? "bg-carton-50 text-carton-700" : "text-ink-soft hover:bg-milk-200"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-dashed border-milk-400 p-4">
          <p className="truncate text-sm font-medium">{user?.name}</p>
          <p className="truncate text-xs text-ink-mute">{user?.email}</p>
          <button onClick={logout} className="btn-ghost mt-3 w-full">
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        {/* Top bar (phones) */}
        <header className="flex items-center justify-between border-b border-milk-300 bg-milk-50 px-4 py-3 md:hidden">
          <div className="flex items-center gap-2 font-display font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-carton-500 text-white">
              <Milk size={16} />
            </span>
            Carton Ledger
          </div>
          <button onClick={logout} aria-label="Sign out" className="rounded-lg p-2 text-ink-soft hover:bg-milk-200">
            <LogOut size={18} />
          </button>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 md:px-8 md:pb-12 md:pt-10">
          <Outlet />
        </main>

        {/* Bottom nav (phones) */}
        <nav
          aria-label="Main"
          className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-milk-300 bg-milk-50/95 backdrop-blur md:hidden"
        >
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2.5 text-xs font-medium ${
                  isActive ? "text-carton-600" : "text-ink-mute"
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
