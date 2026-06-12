// User profile page
// Should include:
// - ProfileView component
// - Navigation to edit profile
// - Show user's own socks
// - Show matches
// - Responsive layout

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Sock } from "../types";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LiaSocksSolid } from "react-icons/lia";
import { BsThreeDotsVertical } from "react-icons/bs";

interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mySocks, setMySocks] = useState<Sock[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingSock, setEditingSock] = useState<Sock | null>(null);

  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const [editColor, setEditColor] = useState("");
  const [editPattern, setEditPattern] = useState("");
  const [editSize, setEditSize] = useState("");
  const [editMaterial, setEditMaterial] = useState("");

  // dummy data
  const displayUser = user || {
    username: "Suzuna",
    email: "suzuna@example.com",
    bio: "Looking for the missing pairs of my favorite winter socks. Based in Vancouver!",
    profilePicture:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
  };

  useEffect(() => {
    const fetchMySocks = async () => {
      try {
        // const res = await fetch('http://localhost:5000/api/my-socks', { credentials: 'include' });
        // const data = await res.json();
        // setMySocks(data);

        // this is dummy data
        const dummyMySocks: Sock[] = [
          {
            id: "101",
            userId: "current_user",
            color: "Green",
            pattern: "Christmas Holiday",
            size: "M",
            material: "Wool",
            images: [
              "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500",
            ],
            description:
              "Lost this one during Christmas party. Please find it!",
            status: "lonely",
            createdAt: "",
          },
          {
            id: "102",
            userId: "current_user",
            color: "Black",
            pattern: "Business Plain",
            size: "M",
            material: "Cotton",
            images: [
              "https://images.unsplash.com/photo-1610986603166-f7842862c17e?w=500",
            ],
            description:
              "Standard office sock. Dropped it near the laundry room.",
            status: "matched",
            createdAt: "",
          },
        ];
        setMySocks(dummyMySocks);
      } catch (error) {
        console.error("Failed to fetch my socks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMySocks();
  }, []);

  const triggerDeleteConfirm = (sockId: string) => {
    setActiveMenuId(null);
    setConfirmModal({
      isOpen: true,
      title: "Delete Sock",
      message: "Are you sure you want to delete this sock ?",
      onConfirm: () => {
        setMySocks((prev) => prev.filter((s) => s.id !== sockId));
        toast.success("Sock deleted successfully");
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // const handleDelete = (sockId: string) => {
  //   if (window.confirm("Are you sure you want to delete this sock? 🗑️")) {
  //     setMySocks((prev) => prev.filter((s) => s.id !== sockId));
  //     toast.success("Sock deleted successfully");
  //     setActiveMenuId(null);
  //   }
  // };

  const triggerLogoutConfirm = () => {
    setConfirmModal({
      isOpen: true,
      title: "Logout",
      message: "Are you sure you want to logout ?",
      onConfirm: async () => {
        try {
          await logout();
        } catch (err) {
          console.log("Logout for front-end testing");
        } finally {
          toast.success("See you later!");
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          navigate("/login");
        }
      },
    });
  };

  const openEditModal = (sock: Sock) => {
    setEditingSock(sock);
    setEditColor(sock.color);
    setEditPattern(sock.pattern);
    setEditSize(sock.size);
    setEditMaterial(sock.material);
    setActiveMenuId(null);
  };

  const handleSaveEdit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!editingSock) return;

    setMySocks((prev) =>
      prev.map((s) =>
        s.id === editingSock.id
          ? {
              ...s,
              color: editColor,
              pattern: editPattern,
              size: editSize,
              material: editMaterial,
            }
          : s,
      ),
    );

    toast.success("Sock updated successfully!");
    setEditingSock(null);
  };

  // const handleLogout = async () => {
  //   try {
  //     await logout();
  //   } catch (err) {
  //     console.log("Logout for front-end testing");
  //   } finally {
  //     toast.success("See you there!");
  //     navigate("/login");
  //   }
  // };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          borderBottom: "1px solid #eee",
          paddingBottom: "20px",
          marginBottom: "20px",
        }}
      >
        <img
          src={displayUser.profilePicture}
          alt="Profile"
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <div style={{ flexGrow: 1 }}>
          <h2 style={{ margin: 0 }}>{displayUser.username}</h2>
          <p style={{ color: "#666", margin: "5px 0 0 0" }}>
            {displayUser.email}
          </p>
          <p
            style={{ marginTop: "10px", fontSize: "14px", fontStyle: "italic" }}
          >
            {displayUser.bio}
          </p>
        </div>
        <button
          onClick={triggerLogoutConfirm}
          style={{
            padding: "8px 12px",
            backgroundColor: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            alignSelf: "flex-start",
          }}
        >
          Logout
        </button>
      </div>

      {/* My sock list */}
      <h3>
        <LiaSocksSolid /> My sock list <LiaSocksSolid />
      </h3>
      {loading ? (
        <p>Loading your closet...</p>
      ) : mySocks.length === 0 ? (
        <p style={{ color: "#888" }}>You haven't uploaded any socks yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
          }}
        >
          {mySocks.map((sock) => (
            <div
              key={sock.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                src={sock.images[0]}
                alt="My Sock"
                style={{ width: "100%", height: "150px", objectFit: "cover" }}
              />

              <span
                style={{
                  position: "absolute",
                  bottom: "8px",
                  right: "8px",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#fff",
                  backgroundColor:
                    sock.status === "matched" ? "#10b981" : "#f59e0b",
                }}
              >
                {sock.status === "matched" ? "Matched!" : "Lonely"}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenuId(activeMenuId === sock.id ? null : sock.id);
                }}
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  background: "rgba(255,255,255,0.8)",
                  border: "none",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  zIndex: 10,
                }}
              >
                <BsThreeDotsVertical />
              </button>

              {activeMenuId === sock.id && (
                <div
                  style={{
                    position: "absolute",
                    top: "40px",
                    right: "8px",
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    zIndex: 20,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <button
                    onClick={() => openEditModal(sock)}
                    style={{
                      padding: "8px 16px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: "14px",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f5f5f5")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => triggerDeleteConfirm(sock.id)}
                    style={{
                      padding: "8px 16px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: "14px",
                      color: "#ef4444",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f5f5f5")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    Delete
                  </button>
                </div>
              )}

              <div style={{ padding: "10px" }}>
                <h4 style={{ margin: "0 0 5px 0" }}>
                  {sock.color} {sock.pattern}
                </h4>
                <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
                  Size: {sock.size} | {sock.material}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingSock && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <form
            onSubmit={handleSaveEdit}
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "400px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0" }}>Edit Sock Info 🧦</h3>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "14px",
                }}
              >
                Color
              </label>
              <input
                type="text"
                value={editColor}
                onChange={(e) => setEditColor(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "14px",
                }}
              >
                Pattern
              </label>
              <input
                type="text"
                value={editPattern}
                onChange={(e) => setEditPattern(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "14px",
                }}
              >
                Size
              </label>
              <select
                value={editSize}
                onChange={(e) => setEditSize(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  boxSizing: "border-box",
                }}
              >
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "14px",
                }}
              >
                Material
              </label>
              <input
                type="text"
                value={editMaterial}
                onChange={(e) => setEditMaterial(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                type="button"
                onClick={() => setEditingSock(null)}
                style={{
                  flex: 1,
                  padding: "10px",
                  backgroundColor: "#e5e7eb",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: "10px",
                  backgroundColor: "#0070f3",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {confirmModal.isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1100,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "24px",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "360px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              textAlign: "center",
            }}
          >
            <h3 style={{ margin: "0 0 12px 0", fontSize: "18px" }}>
              {confirmModal.title}
            </h3>
            <p
              style={{
                margin: "0 0 20px 0",
                fontSize: "14px",
                color: "#555",
                lineHeight: "1.5",
              }}
            >
              {confirmModal.message}
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() =>
                  setConfirmModal((prev) => ({ ...prev, isOpen: false }))
                }
                style={{
                  flex: 1,
                  padding: "10px",
                  backgroundColor: "#e5e7eb",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                style={{
                  flex: 1,
                  padding: "10px",
                  backgroundColor: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
