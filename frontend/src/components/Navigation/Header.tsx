import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LiaSocksSolid } from "react-icons/lia";

export default function Header() {
  const { user } = useAuth();

  return (
    <header
      style={{
        height: "64px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #f0f0f0",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
          height: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 24px",
        }}
      >
        <Link
          to={user ? "/discover" : "/"}
          style={{
            textDecoration: "none",
            color: "#111827",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "26px", color: "#0070f3", lineHeight: 1 }}>
            <LiaSocksSolid />
          </span>
          <span style={{ fontSize: "17px", fontWeight: 700, letterSpacing: "-0.3px" }}>
            It Socks
          </span>
        </Link>

        {user && (
          <Link
            to="/profile"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
              color: "#374151",
              padding: "6px 10px",
              borderRadius: "8px",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f4f6f9")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <img
              src={
                user.profilePicture ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50"
              }
              alt="Profile"
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #e5e7eb",
              }}
            />
            <span style={{ fontSize: "14px", fontWeight: 600 }}>
              {user.username}
            </span>
          </Link>
        )}
      </div>
    </header>
  );
}
