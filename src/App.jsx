import { lazy, Suspense } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ToastContainer from "./components/Toast";

// Lazy load pages for better bundle performance
const RoleSelectionPage = lazy(() => import("./pages/RoleSelectionPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const DeanDashboard = lazy(() => import("./pages/dean/DeanDashboard"));
const StaffDashboard = lazy(() => import("./pages/staff/StaffDashboard"));
const DriverDashboard = lazy(() => import("./pages/driver/DriverDashboard"));
const TransportManagerDashboard = lazy(() => import("./pages/manager/TransportManagerDashboard"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ProfilePage = lazy(() => import("./pages/dean/Profile"));
const PendingRequests = lazy(() => import("./pages/dean/PendingRequests"));
const RequestHistory = lazy(() => import("./pages/dean/RequestHistory"));
const MyRequests = lazy(() => import("./pages/staff/MyRequests"));
const TripHistory = lazy(() => import("./pages/staff/TripHistory"));

const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
  </div>
);

export default function App() {
  const location = useLocation();
  const showGlobalHomePill =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <>
      {showGlobalHomePill && (
        <Link
          to="/"
          aria-label="Go to welcome page"
          className="fixed left-6 top-6 z-50 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-3 py-2 text-teal-700 shadow-sm backdrop-blur-sm hover:bg-white"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-sm">
            🚚
          </span>
          <span className="text-sm font-bold">FleetFlow</span>
        </Link>
      )}

      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<RoleSelectionPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/dashboard/transport_manager"
            element={
              <ProtectedRoute allowedRoles={["TRANSPORT_MANAGER"]}>
                <TransportManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/operations_staff"
            element={
              <ProtectedRoute allowedRoles={["STAFF"]}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/department_dean"
            element={
              <ProtectedRoute allowedRoles={["DEAN"]}>
                <DeanDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/fleet_driver"
            element={
              <ProtectedRoute allowedRoles={["DRIVER"]}>
                <DriverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dean/pending"
            element={
              <ProtectedRoute allowedRoles={["DEAN"]}>
                <PendingRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dean/history"
            element={
              <ProtectedRoute allowedRoles={["DEAN"]}>
                <RequestHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dean/profile"
            element={
              <ProtectedRoute allowedRoles={["DEAN"]}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/myRequests"
            element={
              <ProtectedRoute allowedRoles={["STAFF"]}>
                <MyRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/TripHistory"
            element={
              <ProtectedRoute allowedRoles={["STAFF"]}>
                <TripHistory />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
      <ToastContainer />
    </>
  );
}
