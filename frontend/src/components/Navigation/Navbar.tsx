// Secondary navigation component
// Likely includes similar elements to Header
// Can be used for main nav or sidebar depending on design

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
    gap: "4px",
    textDecoration: "none",
    color: isActive ? "#0070f3" : "#666",
    fontSize: "12px",
    fontWeight: isActive ? ("bold" as const) : ("normal" as const),
  });

  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "60px",
        backgroundColor: "#fff",
        borderTop: "1px solid #eee",
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
        }}
      >
      <NavLink to="/discover" style={linkStyle}>
        <span style={{ fontSize: "20px" }}>
          <FaSearch />
        </span>
        <span>Discover</span>
      </NavLink>

      <NavLink to="/upload-sock" style={linkStyle}>
        <span style={{ fontSize: "20px" }}>
          <IoIosMail />
        </span>
        <span>Upload</span>
      </NavLink>

      <NavLink to="/messages" style={linkStyle}>
        <span style={{ fontSize: "20px" }}>
          <MdOutlineMessage />
        </span>
        <span>Messages</span>
      </NavLink>

      <NavLink to="/profile" style={linkStyle}>
        <span style={{ fontSize: "20px" }}>
          <IoPersonSharp />
        </span>
        <span>Profile</span>
      </NavLink>
      </div>
    </footer>
  );
}
