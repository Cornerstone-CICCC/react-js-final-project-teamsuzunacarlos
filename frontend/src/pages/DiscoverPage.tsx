// Main discovery/browsing page
// Should include:
// - List of socks to swipe through
// - SockCard components
// - Filter options (color, size, pattern, etc.)
// - Swipe/like/dislike functionality
// - Loading states
// - Empty state when no more socks
import { useState, useEffect } from "react";
import { Sock } from "../types";
import toast from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { TbMoodSad2 } from "react-icons/tb";

export default function Discover() {
  const [socks, setSocks] = useState<Sock[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [mySocks, setMySocks] = useState<Sock[]>([]);

  useEffect(() => {
    const fetchSocks = async () => {
      try {
        // const res = await fetch('http://localhost:5000/api/socks', { credentials: 'include' });
        // const data = await res.json();
        // setSocks(data);

        const dummySocks: Sock[] = [
          {
            id: "1",
            userId: "userA",
            color: "Red",
            pattern: "Striped",
            size: "M",
            material: "Cotton",
            images: [
              "https://images.unsplash.com/photo-1582966772680-860e372bb558?w=500",
            ],
            description:
              "Lost my twin at the laundromat. Looking for a cozy partner.",
            status: "lonely",
            createdAt: "",
          },
          {
            id: "2",
            userId: "userB",
            color: "Blue",
            pattern: "Polka Dot",
            size: "L",
            material: "Wool",
            images: [
              "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=500",
            ],
            description:
              "Extremely soft, slightly worn out but still has a lot of love to give.",
            status: "lonely",
            createdAt: "",
          },
        ];

        const dummyMySocks: Sock[] = [
          {
            id: "101",
            userId: "me",
            color: "Green",
            pattern: "Christmas Holiday",
            size: "M",
            material: "Wool",
            images: [
              "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=100",
            ],
            description: "",
            status: "lonely",
            createdAt: "",
          },
          {
            id: "102",
            userId: "me",
            color: "Black",
            pattern: "Business Plain",
            size: "M",
            material: "Cotton",
            images: [
              "https://images.unsplash.com/photo-1610986603166-f7842862c17e?w=100",
            ],
            description: "",
            status: "lonely",
            createdAt: "",
          },
        ];
        setMySocks(dummyMySocks);
        setSocks(dummySocks);
      } catch (error) {
        console.error("Failed to fetch socks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSocks();
  }, []);

  const currentSock = socks[currentIndex];

  const handleSwipe = async (direction: "like" | "pass") => {
    if (!currentSock) return;

    if (direction === "like") {
      setShowModal(true);
      return;
      // toast.success(
      //   `It's a Match! You and ${currentSock.color} ${currentSock.pattern} Sock belong together!`,
      //   {
      //     duration: 5000,
      //     style: {
      //       borderRadius: "10px",
      //       background: "#333",
      //       color: "#fff",
      //     },
      //   },
      // );

      // await fetch('http://localhost:5000/api/matches', {
      //   method: 'POST',
      //   body: JSON.stringify({ sock2Id: currentSock.id, status: 'pending' }),
      // });
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const handleSelectMySock = (mySockId: string) => {
    const selectedSock = mySocks.find((s) => s.id === mySockId);

    toast.success(
      `Sent match request using your ${selectedSock?.color} sock!`,
      {
        duration: 4000,
      },
    );

    // await fetch('http://localhost:5000/api/matches', {
    //   method: 'POST',
    //   body: JSON.stringify({ sock1Id: mySockId, sock2Id: currentSock.id }),
    // });

    setShowModal(false);
    setCurrentIndex((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Loading lonely socks...
      </div>
    );
  }

  if (currentIndex >= socks.length) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h3>No more socks around!</h3>
        <p>Check back later or upload more of your own socks.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "40px auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h2>
        Find Your Match <FaSearch />
      </h2>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          marginBottom: "20px",
        }}
      >
        <img
          src={currentSock.images[0]}
          alt="Sock"
          style={{ width: "100%", height: "300px", objectFit: "cover" }}
        />
        <div style={{ padding: "15px", textAlign: "left" }}>
          <h3>
            {currentSock.color} {currentSock.pattern} ({currentSock.size})
          </h3>
          <p style={{ color: "#666", fontSize: "14px" }}>
            Material: {currentSock.material}
          </p>
          <p style={{ marginTop: "10px" }}>{currentSock.description}</p>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <button
          onClick={() => handleSwipe("pass")}
          style={{
            padding: "12px 30px",
            fontSize: "16px",
            backgroundColor: "#e5e7eb",
            border: "none",
            borderRadius: "30px",
            cursor: "pointer",
          }}
        >
          <TbMoodSad2 /> Pass
        </button>
        <button
          onClick={() => handleSwipe("like")}
          style={{
            padding: "12px 30px",
            fontSize: "16px",
            backgroundColor: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "30px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          <FaRegHeart /> Like
        </button>
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "360px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Select your sock to match!</h3>
            <p style={{ fontSize: "13px", color: "#666" }}>
              Which of your socks is looking for this partner?
            </p>

            {/* List of my socks */}
            <div
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                margin: "15px 0",
              }}
            >
              {mySocks.map((sock) => (
                <div
                  key={sock.id}
                  onClick={() => handleSelectMySock(sock.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "8px",
                    border: "1px solid #eee",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f0f9ff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <img
                    src={sock.images[0]}
                    alt=""
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "6px",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                      {sock.color} {sock.pattern}
                    </div>
                    <div style={{ fontSize: "12px", color: "#888" }}>
                      Size: {sock.size}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* cancel button */}
            <button
              onClick={() => setShowModal(false)}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#e5e7eb",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
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
