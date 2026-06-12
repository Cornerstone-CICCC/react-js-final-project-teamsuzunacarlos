import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LiaSocksSolid } from "react-icons/lia";
import zxcvbn from "zxcvbn";
import toast from "react-hot-toast";

const strengthLabel = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
const strengthColor = ["#ef4444", "#f59e0b", "#f59e0b", "#10b981", "#10b981"];

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordScore, setPasswordScore] = useState(-1);
  const { register, user } = useAuth();

  if (user) return <Navigate to="/discover" replace />;

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    setPasswordScore(val ? zxcvbn(val).score : -1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordScore < 2) {
      toast.error("Password is too weak. Please use a stronger password.");
      return;
    }
    try {
      await register({ username, email, password });
      toast.success("Account created!");
    } catch {
      toast.error("Registration failed. Email might already be in use.");
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
            Create an account
          </h2>
          <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>
            Join the sock matching community
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 600, color: "#374151" }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="sockmaster42"
              required
            />
          </div>

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
              onChange={handlePasswordChange}
              placeholder="••••••••"
              required
            />
            {passwordScore >= 0 && (
              <div style={{ marginTop: "8px" }}>
                <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: "3px",
                        borderRadius: "2px",
                        backgroundColor: i <= passwordScore ? strengthColor[passwordScore] : "#e5e7eb",
                        transition: "background-color 0.2s",
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: "12px", color: strengthColor[passwordScore], fontWeight: 600 }}>
                  {strengthLabel[passwordScore]}
                </span>
              </div>
            )}
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
            Create Account
          </button>
        </form>

        <p style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "#6b7280" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ fontWeight: 600 }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
