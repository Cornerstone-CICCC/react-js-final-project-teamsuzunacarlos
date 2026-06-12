// Main App component
// Should:
// - Setup routing (React Router)
// - Setup context providers (Auth, Socket)
// - Define page routes
// - Setup route protection (private routes)
// - Handle app-level layout (Header, navigation)

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";
import Layout from "./components/Styles/Layout";
import Home from "./pages/Home";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import DiscoverPage from "./pages/DiscoverPage";
import UploadSock from "./pages/UploadSockPage";
import Profile from "./pages/ProfilePage";
import Messages from "./pages/MessagesPage";
import { Toaster } from "react-hot-toast";

const ProtectedRoute = ({ children }: { children: React.JSX.Element }) => {
  // const { user, loading } = useAuth();

  // if (loading) return <div style={{ padding: "20px" }}>Loading...</div>;
  // if (!user) return <Navigate to="/login" replace />;

  return <Layout>{children}</Layout>;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/discover"
          element={
            <ProtectedRoute>
              <DiscoverPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload-sock"
          element={
            <ProtectedRoute>
              <UploadSock />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
