import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout
import DashboardLayout from "./layouts/DashboardLayout";

// Public Pages
import Login from "./components/Login/Login";
import Name from "./components/Login/Name";
import Number from "./components/Login/Number";
import Avatar from "./components/Login/Avatar";
import Page1 from "./components/Login/Page1";
import Page2 from "./components/Login/Page2";
import Page3 from "./components/Login/Page3";
import Page4 from "./components/Login/Page4";
import Page5 from "./components/Login/Page5";
import Form from "./components/Form";

// Dashboards
import VolunteerDashboard from "./components/dashboard/VolunteerDashboard";
import Dashboard from "./components/dashboard/Dashboard";
import AuditReport from "./components/dashboard/AuditReport";
import RaiseFunds from "./components/dashboard/RaiseFunds";
import ImpactCalculator from "./components/dashboard/ImpactCalculator";
import WhyInternship from "./components/dashboard/WhyInternship";
import UnderstandRole from "./components/dashboard/UnderstandRole";
import StartOrientation from "./components/dashboard/StartOrientation";
import Rewards from "./components/dashboard/Rewards";
import BuildConnection from "./components/dashboard/BuildConnection";
import CaptureAttention from "./components/dashboard/CaptureAttention";
import G80Certificate from "./components/dashboard/G80Certificate";
import TrustCertificate from "./components/dashboard/TrustCertificate";
import ProjectSneh from "./components/dashboard/Projectkeytaab";
import Learning from "./components/dashboard/Learning";
import Emotional from "./components/dashboard/Emotional";
import Mental from "./components/dashboard/Mental";
import Insights from "./components/dashboard/Insights";
import Donations from "./components/dashboard/Donation";
import Explore from "./components/dashboard/Explore";
import Community from "./components/dashboard/Community";
import CertificatesPage from "./components/dashboard/CertificatesPage";

// ProtectedRoute
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/name" element={<Name />} />
      <Route path="/number" element={<Number />} />
      <Route path="/avatar" element={<Avatar />} />
      <Route path="/page1" element={<Page1 />} />
      <Route path="/page2" element={<Page2 />} />
      <Route path="/page3" element={<Page3 />} />
      <Route path="/page4" element={<Page4 />} />
      <Route path="/page5" element={<Page5 />} />
      <Route path="/form" element={<Form />} />

      {/* Volunteer Dashboard */}
      <Route
        path="/volunteerDashboard"
        element={
          <ProtectedRoute allowedRoles={["Volunteer_Internal"]}>
            <VolunteerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fundraiser Dashboard Routes inside layout */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["Fundraiser_External"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/audit" element={<AuditReport />} />
        <Route path="/raise-funds" element={<RaiseFunds />} />
        <Route path="/impact" element={<ImpactCalculator />} />
        <Route path="/internship" element={<WhyInternship />} />
        <Route path="/role" element={<UnderstandRole />} />
        <Route path="/orientation" element={<StartOrientation />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/connection" element={<BuildConnection />} />
        <Route path="/attention" element={<CaptureAttention />} />
        <Route path="/g80" element={<G80Certificate />} />
        <Route path="/trust" element={<TrustCertificate />} />
         <Route path="/sneh" element={<ProjectSneh />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/donations" element={<Donations />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/community" element={<Community />} />
        <Route path="/emotional" element={<Emotional />} />
        <Route path="/mental" element={<Mental />} />
        <Route path="/certificates" element={<CertificatesPage />} />
      </Route>

      {/* Redirect unknown paths to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;

