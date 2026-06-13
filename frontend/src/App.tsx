// Main App component
// Should:
// - Setup routing (React Router)
// - Setup context providers (Auth, Socket)
// - Define page routes
// - Setup route protection (private routes)
// - Handle app-level layout (Header, navigation)

import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Styles/Layout";
import Home from "./pages/Home";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import DiscoverPage from "./pages/DiscoverPage";
import UploadSock from "./pages/UploadSockPage";
import Profile from "./pages/ProfilePage";
import Messages from "./pages/MessagesPage";
import { Toaster } from "react-hot-toast";

// Renders Layout + Outlet for all authenticated routes.
// Using Outlet (React Router v6 nested routes) ensures each child route
// unmounts and remounts correctly when navigating between pages.
const ProtectedLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ padding: "20px" }}>Loading...</div>;
  if (!user) return <Navigate to="/" replace />;

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* All protected pages share one ProtectedLayout instance */}
        <Route element={<ProtectedLayout />}>
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/upload-sock" element={<UploadSock />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
