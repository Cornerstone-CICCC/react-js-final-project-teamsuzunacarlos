import { Link, Navigate } from "react-router-dom";
import Header from "../components/Navigation/Header";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/discover" replace />;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(160deg, #f4f6f9 0%, #e8f2ff 100%)",
      }}
    >
      <Header />

      <main
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "56px 48px",
            maxWidth: "440px",
            width: "100%",
            boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 16px 48px rgba(0,112,243,0.10)",
          }}
        >
          <div style={{ fontSize: "60px", marginBottom: "20px", lineHeight: 1 }}>🧦❤️🧦</div>

          <h1
            style={{
              fontSize: "28px",
              fontWeight: 800,
              margin: "0 0 12px",
              color: "#111827",
              letterSpacing: "-0.5px",
            }}
          >
            Where Lonely Socks Find Their Match
          </h1>

          <p
            style={{
              fontSize: "15px",
              color: "#6b7280",
              lineHeight: "1.65",
              margin: "0 0 36px",
            }}
          >
            Lost a single sock in the laundry? Don't throw it away. Upload its profile, swipe for potential twins, and coordinate a reunion with its owner.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link
              to="/signup"
              style={{
                display: "block",
                padding: "14px",
                backgroundColor: "#0070f3",
                color: "#fff",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "15px",
                letterSpacing: "0.2px",
                boxShadow: "0 4px 14px rgba(0,112,243,0.35)",
                transition: "box-shadow 0.2s, filter 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.filter = "brightness(1.08)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.filter = ""; }}
            >
              Get Started — It's Free
            </Link>
            <Link
              to="/login"
              style={{
                display: "block",
                padding: "14px",
                backgroundColor: "#fff",
                color: "#0070f3",
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "15px",
                border: "1.5px solid #c7dfff",
              }}
            >
              Log In
            </Link>
          </div>
        </div>

        <p style={{ marginTop: "32px", fontSize: "13px", color: "#9ca3af" }}>
          Reuniting socks, one pair at a time.
        </p>
      </main>
    </div>
  );
}
