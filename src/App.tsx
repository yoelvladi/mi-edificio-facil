import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Payments from "./pages/Payments";
import Reservations from "./pages/Reservations";
import Visitors from "./pages/Visitors";
import Announcements from "./pages/Announcements";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBilling from "./pages/AdminBilling";
import AdminMaintenance from "./pages/AdminMaintenance";
import AdminVisits from "./pages/AdminVisits";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAdminAuthenticated } = useAuth();
  return isAdminAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <Payments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reservations"
              element={
                <ProtectedRoute>
                  <Reservations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/visitors"
              element={
                <ProtectedRoute>
                  <Visitors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/announcements"
              element={
                <ProtectedRoute>
                  <Announcements />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/billing"
              element={
                <AdminProtectedRoute>
                  <AdminBilling />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/maintenance"
              element={
                <AdminProtectedRoute>
                  <AdminMaintenance />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/visits"
              element={
                <AdminProtectedRoute>
                  <AdminVisits />
                </AdminProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
