import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loading from "../../Components/ui/Loading";

const SignInPage = lazy(() => import("../../Components/SignIn/SignIn"));
const ForgotPassword = lazy(() =>
  import("../../Components/SignIn/ForgotPassword")
);
const VerifyOtp = lazy(() => import("../../Components/SignIn/VerifyOtp"));
const SetNewPassword = lazy(() =>
  import("../../Components/SignIn/SetNewPassword")
);
const PasswordSuccess = lazy(() =>
  import("../../Components/SignIn/PasswordSuccess")
);
const AdminPanel = lazy(() => import("../AdminPanel/withAdminLayout"));
const Dashboard = lazy(() => import("../Dashboard/Dashboard"));
const TopPerformers = lazy(() =>
  import("../../Components/Dashboard/TopPerformers")
);
const TopPerformersMain = lazy(() =>
  import("../../Components/TopPerformers/TopPerformersMain")
);
const Clients = lazy(() => import("../../Components/Clients/Clients"));
const CreateClientForm = lazy(() =>
  import("../../Components/Clients/CreateClientForm")
);
const ClientDetails = lazy(() =>
  import("../../Components/Clients/ClientDetails")
);
const SubscriptionManagement = lazy(() =>
  import("../../Components/Clients/SubscriptionManagement")
);
const SubscriptionTable = lazy(() =>
  import("../../Components/SubscriptionTable/SubscriptionTable")
);
const Report = lazy(() => import("../Report/Report"));
const AuditLogTable = lazy(() =>
  import("../../Components/Audits/AuditLogTable")
);
const SupportsPage = lazy(() => import("../SupportsPage/SupportsPage"));
const TicketDetails = lazy(() =>
  import("../../Components/Supports/TicketDetails")
);
const Notifications = lazy(() =>
  import("../../Components/Topbar/Notifications")
);
const PosDevice = lazy(() => import("../PosDevice/PosDevice"));
const HardwareDeviceHistory = lazy(() =>
  import("../../Components/PosDevice/HardwareDeviceHistory")
);
const AccountSettings = lazy(() =>
  import("../AccountSettings/AccountSettings")
);
const SubAdminTable = lazy(() =>
  import("../../Components/Settings/SubAdminTable")
);
const ChangePasswordForm = lazy(() =>
  import("../../Components/Settings/ChangePasswordForm")
);
const AccountManagement = lazy(() =>
  import("../../Components/Settings/AccountManagement")
);
const DeviceActivity = lazy(() =>
  import("../../Components/Settings/DeviceActivity")
);
const LanguageSettings = lazy(() =>
  import("../../Components/Settings/LanguageSettings")
);
const DateTimeSettings = lazy(() =>
  import("../../Components/Settings/DateTimeSettings")
);
const CurrencySettings = lazy(() =>
  import("../../Components/Settings/CurrencySettings")
);
const BillingHistory = lazy(() =>
  import("../../Components/Settings/BillingHistory")
);

// Import your page components

const AppRoutes = () => {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<SignInPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/set-new-password" element={<SetNewPassword />} />

          <Route path="/password-success" element={<PasswordSuccess />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/top-performers-list" element={<TopPerformersMain />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/create-clients" element={<CreateClientForm />} />
          <Route path="/client-details" element={<ClientDetails />} />
          <Route
            path="/renew-management"
            element={<SubscriptionManagement />}
          />
          <Route path="/subscription-list" element={<SubscriptionTable />} />
          <Route path="/report" element={<Report />} />
          <Route path="/audit-log" element={<AuditLogTable />} />
          <Route path="/supports" element={<SupportsPage />} />
          <Route path="/ticket-details" element={<TicketDetails />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/pos-device" element={<PosDevice />} />
          <Route
            path="/pos-device-history"
            element={<HardwareDeviceHistory />}
          />
          <Route path="/settings" element={<AccountSettings />} />
          <Route path="/sub-admin" element={<SubAdminTable />} />
          <Route path="/change-password" element={<ChangePasswordForm />} />
          <Route path="/account-management" element={<AccountManagement />} />
          <Route path="/device" element={<DeviceActivity />} />
          <Route path="/language" element={<LanguageSettings />} />
          <Route path="/date-time" element={<DateTimeSettings />} />
          <Route path="/currency" element={<CurrencySettings />} />
          <Route path="/billing-history" element={<BillingHistory />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
