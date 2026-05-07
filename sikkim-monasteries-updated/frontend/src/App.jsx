import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import SikkimMonasteriesHome from "./SikkimMonasteriesHome";
import DonatePage from "./DonatePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MonasteryDetailPage from "./pages/MonasteryDetailPage";
import AllMonasteriesPage from "./pages/AllMonasteriesPage";
import MonkSessionsPage from "./pages/MonkSessionsPage";
import HandicraftPage from "./pages/HandicraftPage";
import UserProfilePage from "./pages/UserProfilePage";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import 'leaflet/dist/leaflet.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (user.role !== "ADMIN") return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SikkimMonasteriesHome />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/monasteries" element={<AllMonasteriesPage />} />
      <Route path="/monasteries/:slug" element={<MonasteryDetailPage />} />
      <Route path="/sessions" element={<MonkSessionsPage />} />
      <Route path="/handicrafts" element={<HandicraftPage />} />
      <Route path="/donate" element={<ProtectedRoute><DonatePage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
// Note: RumtekPage is now served via /monasteries/rumtek (MonasteryDetailPage)
