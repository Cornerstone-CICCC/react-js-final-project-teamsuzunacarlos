import React from "react";
import Header from "../Navigation/Header";
import Navbar from "../Navigation/Navbar";

const MAX_WIDTH = "1600px";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fafafa",
      }}
    >
      <Header />
      <main style={{ flexGrow: 1, paddingBottom: "60px" }}>
        <div style={{ maxWidth: MAX_WIDTH, margin: "0 auto", width: "100%" }}>
          {children}
        </div>
      </main>
      <Navbar />
    </div>
  );
}
