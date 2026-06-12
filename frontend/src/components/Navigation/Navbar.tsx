import { NavLink } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { MdOutlineMessage } from "react-icons/md";
import { IoPersonSharp } from "react-icons/io5";

export default function Footer() {
  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "3px",
    textDecoration: "none",
    color: isActive ? "#0070f3" : "#9ca3af",
    fontSize: "11px",
    fontWeight: isActive ? (700 as const) : (500 as const),
    padding: "4px 16px",
    borderRadius: "12px",
    transition: "color 0.15s",
  });

  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "64px",
        backgroundColor: "#fff",
        borderTop: "1px solid #f0f0f0",
        boxShadow: "0 -1px 8px rgba(0,0,0,0.06)",
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
          height: "100%",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "0 8px",
        }}
      >
        <NavLink to="/discover" style={linkStyle}>
          <span style={{ fontSize: "22px" }}><FaSearch /></span>
          <span>Discover</span>
        </NavLink>

        <NavLink to="/upload-sock" style={linkStyle}>
          <span style={{ fontSize: "22px" }}><IoIosMail /></span>
          <span>Upload</span>
        </NavLink>

        <NavLink to="/messages" style={linkStyle}>
          <span style={{ fontSize: "22px" }}><MdOutlineMessage /></span>
          <span>Messages</span>
        </NavLink>

        <NavLink to="/profile" style={linkStyle}>
          <span style={{ fontSize: "22px" }}><IoPersonSharp /></span>
          <span>Profile</span>
        </NavLink>
      </div>
    </footer>
  );
}
