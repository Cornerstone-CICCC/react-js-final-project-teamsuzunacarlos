import React from "react";
import Header from "../Navigation/Header";
import Navbar from "../Navigation/Navbar";

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
      <main style={{ flexGrow: 1, paddingBottom: "60px" }}>{children}</main>
      <Navbar />
    </div>
  );
}
