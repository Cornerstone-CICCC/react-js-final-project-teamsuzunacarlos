import { useState, useEffect } from "react";
import { Sock } from "../types";
import toast from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { TbMoodSad2 } from "react-icons/tb";
import { getImageUrl, BASE_URL } from "../services/api";

export default function Discover() {
  const [socks, setSocks] = useState<Sock[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [mySocks, setMySocks] = useState<Sock[]>([]);

  useEffect(() => {
    const fetchSocks = async () => {
      try {
        const res = await fetch(`${BASE_URL}/socks`, { credentials: "include" });
        const data = await res.json();
        setSocks(data.socks || []);

        const mySocksRes = await fetch(`${BASE_URL}/socks/my-socks`, { credentials: "include" });
        const mySocksData = await mySocksRes.json();
        setMySocks(mySocksData || []);
      } catch {
        toast.error("Failed to load socks");
      } finally {
        setLoading(false);
      }
    };
    fetchSocks();
  }, []);

  const currentSock = socks[currentIndex];

  const handleSwipe = (direction: "like" | "pass") => {
    if (!currentSock) return;
    if (direction === "like") { setShowModal(true); return; }
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSelectMySock = async (mySockId: string) => {
    const selectedSock = mySocks.find((s) => (s as any)._id === mySockId || s.id === mySockId);
    try {
      const res = await fetch(`${BASE_URL}/matches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sock1Id: mySockId,
          sock2Id: (currentSock as any)?._id || currentSock?.id,
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        const successMsg = data.message === "It's a match!"
          ? `It's a match! Your ${selectedSock?.color} sock found its partner!`
          : `Match request sent with your ${selectedSock?.color} sock!`;
        toast.success(successMsg, { duration: 4000 });
        setShowModal(false);
        setCurrentIndex((prev) => prev + 1);
      } else {
        toast.error(data.message || "Failed to create match");
      }
    } catch {
      toast.error("Error creating match");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center", color: "#6b7280" }}>
        Loading lonely socks...
      </div>
    );
  }

  if (currentIndex >= socks.length) {
    return (
      <div style={{ padding: "80px 20px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧦</div>
        <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>No more socks around!</h3>
        <p style={{ color: "#6b7280" }}>Check back later or upload more of your own.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "420px", margin: "32px auto", padding: "0 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <FaSearch style={{ color: "#0070f3", fontSize: "16px" }} />
        <h2 style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.3px" }}>Discover</h2>
      </div>

      {/* Sock card */}
      <div
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.10)",
          background: "#fff",
          marginBottom: "20px",
        }}
      >
        <div style={{ position: "relative" }}>
          <img
            src={getImageUrl(currentSock.images[0])}
            alt="Sock"
            style={{ width: "100%", height: "320px", objectFit: "cover", display: "block" }}
          />
          {/* Gradient overlay */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "50%",
              background: "linear-gradient(transparent, rgba(0,0,0,0.55))",
            }}
          />
          <div style={{ position: "absolute", bottom: "14px", left: "16px", color: "#fff" }}>
            <div style={{ fontSize: "17px", fontWeight: 700, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
              {currentSock.color} {currentSock.pattern}
            </div>
            <div style={{ fontSize: "13px", opacity: 0.85 }}>Size {currentSock.size} · {currentSock.material}</div>
          </div>
        </div>
        {currentSock.description && (
          <div style={{ padding: "14px 16px" }}>
            <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: "1.5" }}>{currentSock.description}</p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <button
          onClick={() => handleSwipe("pass")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "13px 28px",
            fontSize: "15px",
            fontWeight: 600,
            backgroundColor: "#fff",
            color: "#6b7280",
            border: "1.5px solid #e5e7eb",
            borderRadius: "50px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <TbMoodSad2 /> Pass
        </button>
        <button
          onClick={() => handleSwipe("like")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "13px 28px",
            fontSize: "15px",
            fontWeight: 700,
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "50px",
            boxShadow: "0 4px 14px rgba(0,112,243,0.35)",
          }}
        >
          <FaRegHeart /> Like
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            zIndex: 1000,
            padding: "0 0 20px",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "24px 20px",
              borderRadius: "20px 20px 16px 16px",
              width: "100%",
              maxWidth: "440px",
              boxShadow: "0 -4px 32px rgba(0,0,0,0.12)",
            }}
          >
            {/* Handle bar */}
            <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "#e5e7eb", margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "4px" }}>Pick your sock</h3>
            <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "16px" }}>
              Which of yours is looking for this partner?
            </p>

            <div style={{ maxHeight: "220px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
              {mySocks.filter((s) => s.status === "available").length === 0 && (
                <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "14px", padding: "16px 0" }}>
                  You have no available socks. Upload one first!
                </p>
              )}
              {mySocks.filter((s) => s.status === "available").map((sock) => (
                <div
                  key={(sock as any)._id || sock.id}
                  onClick={() => handleSelectMySock((sock as any)._id || sock.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#0070f3"; (e.currentTarget as HTMLDivElement).style.background = "#f0f7ff"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#e5e7eb"; (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                >
                  <img
                    src={getImageUrl(sock.images[0])}
                    alt=""
                    style={{ width: "44px", height: "44px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600 }}>{sock.color} {sock.pattern}</div>
                    <div style={{ fontSize: "12px", color: "#9ca3af" }}>Size {sock.size}</div>
                  </div>
                  <FaHeart style={{ marginLeft: "auto", color: "#e5e7eb", fontSize: "14px" }} />
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowModal(false)}
              style={{
                marginTop: "14px",
                width: "100%",
                padding: "12px",
                backgroundColor: "#f4f6f9",
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 600,
                color: "#6b7280",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
