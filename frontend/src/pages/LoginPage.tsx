import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LiaSocksSolid } from "react-icons/lia";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, user } = useAuth();

  if (user) return <Navigate to="/discover" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      toast.success("Welcome back!");
    } catch {
      toast.error("Invalid email or password.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #f4f6f9 0%, #e8f2ff 100%)",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "48px 40px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 16px 48px rgba(0,112,243,0.10)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <span style={{ fontSize: "40px", color: "#0070f3" }}><LiaSocksSolid /></span>
          <h2 style={{ fontSize: "22px", fontWeight: 800, marginTop: "10px", letterSpacing: "-0.4px" }}>
            Welcome back
          </h2>
          <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>
            Log in to find your sock's match
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 600, color: "#374151" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 600, color: "#374151" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            style={{
              marginTop: "4px",
              width: "100%",
              padding: "13px",
              backgroundColor: "#0070f3",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: 700,
              boxShadow: "0 4px 14px rgba(0,112,243,0.35)",
            }}
          >
            Log In
          </button>
        </form>

        <p style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "#6b7280" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ fontWeight: 600 }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
