import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import Spinner from "./components/Spinner";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Reports from "./pages/Reports";

function RequireAuth() {
  const { user, loading } = useAuth();
  if (loading) return <Spinner label="Opening your ledger" />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

function PublicOnly() {
  const { user, loading } = useAuth();
  if (loading) return <Spinner label="Opening your ledger" />;
  return user ? <Navigate to="/" replace /> : <Outlet />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicOnly />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
