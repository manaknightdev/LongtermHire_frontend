import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import DashboardMain from "./DashboardMain";
import Login from "./Login";
import Incoming from "./Incoming";
import ClientManagement from "./ClientManagement";
import EquipmentManagement from "./EquipmentManagement";
import PricingManagement from "./PricingManagement";
import ContentManagement from "./ContentManagement";
import Profile from "./Profile";
import Chat from "./components/Chat";
import PrivateRoute from "./components/PrivateRoute";
import ClientPrivateRoute from "./components/ClientPrivateRoute";

// Client Portal Components
import ClientLogin from "./client/ClientLogin";
import ClientDashboard from "./client/ClientDashboard";
import ClientProfile from "./client/ClientProfile";
import ForgotPassword from "./client/ForgotPassword";
import VerifyOTP from "./client/VerifyOTP";
import ResetPassword from "./client/ResetPassword";

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#292A2B]">
      <AdminSidebar />
      <main
        className="flex-1 overflow-y-auto mb-10 md:mb-20 lg:ml-[256px] lg:w-[calc(100vw - 256px)]"
        style={{
          height: "100vh",
        }}
      >
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={["super_admin"]}>
              <DashboardLayout>
                <DashboardMain />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/client-management"
          element={
            <PrivateRoute allowedRoles={["super_admin"]}>
              <DashboardLayout>
                <ClientManagement />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/equipment-management"
          element={
            <PrivateRoute allowedRoles={["super_admin"]}>
              <DashboardLayout>
                <EquipmentManagement />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/pricing-management"
          element={
            <PrivateRoute allowedRoles={["super_admin"]}>
              <DashboardLayout>
                <PricingManagement />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/content-management"
          element={
            <PrivateRoute allowedRoles={["super_admin"]}>
              <DashboardLayout>
                <ContentManagement />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute allowedRoles={["super_admin"]}>
              <DashboardLayout>
                <Chat />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute allowedRoles={["super_admin"]}>
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route path="/incoming" element={<Incoming />} />

        {/* Client Portal Routes */}
        <Route path="/client/login" element={<ClientLogin />} />
        <Route
          path="/client/dashboard"
          element={
            <ClientPrivateRoute>
              <ClientDashboard />
            </ClientPrivateRoute>
          }
        />
        <Route
          path="/client/profile"
          element={
            <ClientPrivateRoute>
              <ClientProfile />
            </ClientPrivateRoute>
          }
        />
        <Route path="/client/forgot-password" element={<ForgotPassword />} />
        <Route path="/client/verify-otp" element={<VerifyOTP />} />
        <Route path="/client/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
