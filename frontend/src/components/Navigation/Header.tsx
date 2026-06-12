// Top navigation header
// Should include:
// - Logo/app name
// - Navigation links (Discover, Messages, Profile, etc.)
// - User menu (profile, settings, logout)
// - Notification badge for new messages
// - Responsive mobile menu

import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LiaSocksSolid } from "react-icons/lia";

export default function Header() {
  const { user } = useAuth();

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        height: "60px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #eee",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <Link
        to="/discover"
        style={{
          textDecoration: "none",
          color: "#000",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span style={{ fontSize: "24px" }}>
          <LiaSocksSolid />
        </span>
        <h1 style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>
          It Socks
        </h1>
      </Link>

      {user && (
        <Link
          to="/profile"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
            color: "#333",
          }}
        >
          <img
            src={
              user.profilePicture ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50"
            }
            alt="Profile"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <span style={{ fontSize: "14px", fontWeight: "500" }}>
            {user.username}
          </span>
        </Link>
      )}
    </header>
  );
}
