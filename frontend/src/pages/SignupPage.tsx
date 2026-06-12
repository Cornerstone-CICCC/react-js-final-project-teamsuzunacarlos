// Signup page
// Should include:
// - SignupForm component
// - Page layout/styling
// - Redirect to home if already logged in

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import zxcvbn from "zxcvbn";
import toast from "react-hot-toast";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordScore, setPasswordScore] = useState(-1);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (val) {
      const result = zxcvbn(val);
      setPasswordScore(result.score);
    } else {
      setPasswordScore(-1);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError("");

    if (passwordScore < 2) {
      // setError("Password is too weak. Please use a stronger password.");
      toast.error("Password is too weak. Please use a stronger password.");
      return;
    }

    try {
      await register({ username, email, password });
      toast.success("Signed in successfully!");
      navigate("/discover");
    } catch (err) {
      toast.error("Invalid email or password.");
      // setError("Registration failed. Email might already be in use.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2>Create an Account 🧦</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />

          {passwordScore >= 0 && (
            <div style={{ marginTop: "5px", fontSize: "12px" }}>
              Password Strength:{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color:
                    passwordScore < 2
                      ? "red"
                      : passwordScore < 4
                        ? "orange"
                        : "green",
                }}
              >
                {["Very Weak", "Weak", "Fair", "Good", "Strong"][passwordScore]}
              </span>
            </div>
          )}
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Sign Up
        </button>
      </form>

      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
