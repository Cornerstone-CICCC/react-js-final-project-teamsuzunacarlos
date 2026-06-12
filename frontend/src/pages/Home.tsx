import { Link } from "react-router-dom";
import Header from "../components/Navigation/Header";
// import Footer from "../components/Navigation/Navbar";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fafafa",
        paddingBottom: "60px",
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
          padding: "40px 20px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "64px", marginBottom: "20px" }}>🧦❤️🧦</div>

        <h2
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            margin: "0 0 10px 0",
            color: "#111",
          }}
        >
          Where Lonely Socks Find Their Match
        </h2>

        <p
          style={{
            fontSize: "16px",
            color: "#666",
            maxWidth: "400px",
            lineHeight: "1.6",
            margin: "0 0 40px 0",
          }}
        >
          Lost a single sock in the laundry? Don't throw it away. Upload its
          profile, swipe for potential twins, and coordinate a reunion with its
          owner.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            width: "100%",
            maxWidth: "240px",
          }}
        >
          <Link
            to="/signup"
            style={{
              display: "block",
              width: "100%",
              padding: "14px",
              backgroundColor: "#0070f3",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "16px",
              boxShadow: "0 4px 12px rgba(0,112,243,0.2)",
            }}
          >
            Get Started
          </Link>
          <Link
            to="/login"
            style={{
              display: "block",
              width: "100%",
              padding: "14px",
              backgroundColor: "#fff",
              color: "#0070f3",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "16px",
              border: "1px solid #0070f3",
            }}
          >
            Log In
          </Link>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
}
