import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import OperatorPage from "./pages/OperatorPage.jsx";
import { getSession } from "./services/auth.js";

function Protected({ role, children }) {
  const session = getSession();
  if (!session) return <Navigate to="/" replace />;
  if (role && session.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/user"
        element={
          <Protected role="user">
            <UserDashboard />
          </Protected>
        }
      />
      <Route
        path="/admin"
        element={
          <Protected role="admin">
            <AdminDashboard />
          </Protected>
        }
      />
      <Route
        path="/operator"
        element={
          <Protected role="operator">
            <OperatorPage />
          </Protected>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
