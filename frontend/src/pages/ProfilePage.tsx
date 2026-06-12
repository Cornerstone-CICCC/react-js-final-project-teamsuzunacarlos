// User profile page
// Should include:
// - ProfileView component
// - Navigation to edit profile
// - Show user's own socks
// - Show matches
// - Responsive layout

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Sock, PopulatedMatch } from "../types";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LiaSocksSolid } from "react-icons/lia";
import { BsThreeDotsVertical } from "react-icons/bs";
import { getImageUrl } from "../services/api";

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
  const [matches, setMatches] = useState<PopulatedMatch[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(true);

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
  const [editDescription, setEditDescription] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  // Sock model has no toJSON virtuals so _id is the only ID in API responses
  const getSockId = (sock: Sock) => (sock as any)._id as string;

  const closeEditModal = () => {
    if (editImagePreview) URL.revokeObjectURL(editImagePreview);
    setEditImagePreview(null);
    setEditImageFile(null);
    setEditingSock(null);
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (editImagePreview) URL.revokeObjectURL(editImagePreview);
    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  const displayUser = user;

  const fetchMySocks = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/socks/my-socks', { credentials: 'include' });
      const data = await res.json();
      setMySocks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch my socks:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/matches', { credentials: 'include' });
      const data = await res.json();
      setMatches(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch matches:", error);
    } finally {
      setMatchesLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchMySocks(); fetchMatches(); }, []);

  const handleAccept = async (matchId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/matches/${matchId}/accept`, {
        method: 'PUT',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Match accepted! Head to Messages to chat.");
        fetchMySocks();
        fetchMatches();
      } else {
        toast.error(data.message || "Failed to accept match");
      }
    } catch {
      toast.error("Error accepting match");
    }
  };

  const handleReject = async (matchId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/matches/${matchId}/reject`, {
        method: 'PUT',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Match rejected.");
        fetchMatches();
      } else {
        toast.error(data.message || "Failed to reject match");
      }
    } catch {
      toast.error("Error rejecting match");
    }
  };

  const triggerDeleteConfirm = (sockId: string) => {
    setActiveMenuId(null);
    setConfirmModal({
      isOpen: true,
      title: "Delete Sock",
      message: "Are you sure you want to delete this sock ?",
      onConfirm: async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/socks/${sockId}`, {
            method: 'DELETE',
            credentials: 'include',
          });
          if (res.ok) {
            setMySocks((prev) => prev.filter((s) => getSockId(s) !== sockId));
            toast.success("Sock deleted successfully");
          } else {
            const error = await res.json();
            toast.error(error.message || "Delete failed.");
          }
        } catch {
          toast.error("Error deleting sock.");
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
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
    setEditDescription(sock.description || "");
    setActiveMenuId(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSock) return;

    const sockId = getSockId(editingSock);
    try {
      let res: Response;

      if (editImageFile) {
        const formData = new FormData();
        formData.append('color', editColor);
        formData.append('pattern', editPattern);
        formData.append('size', editSize);
        formData.append('material', editMaterial);
        formData.append('description', editDescription);
        formData.append('images', editImageFile);
        res = await fetch(`http://localhost:5000/api/socks/${sockId}`, {
          method: 'PUT',
          body: formData,
          credentials: 'include',
        });
      } else {
        res = await fetch(`http://localhost:5000/api/socks/${sockId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ color: editColor, pattern: editPattern, size: editSize, material: editMaterial, description: editDescription }),
          credentials: 'include',
        });
      }

      if (res.ok) {
        const { sock: updatedSock } = await res.json();
        setMySocks((prev) =>
          prev.map((s) => (getSockId(s) === sockId ? updatedSock : s)),
        );
        toast.success("Sock updated successfully!");
        closeEditModal();
      } else {
        const error = await res.json();
        toast.error(error.message || "Update failed.");
      }
    } catch {
      toast.error("Error updating sock.");
    }
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
        {displayUser?.profilePicture && (
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
        )}
        <div style={{ flexGrow: 1 }}>
          <h2 style={{ margin: 0 }}>{displayUser?.username}</h2>
          <p style={{ color: "#666", margin: "5px 0 0 0" }}>
            {displayUser?.email}
          </p>
          {displayUser?.bio && (
            <p style={{ marginTop: "10px", fontSize: "14px", fontStyle: "italic" }}>
              {displayUser.bio}
            </p>
          )}
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
              key={getSockId(sock)}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                src={getImageUrl(sock.images[0])}
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
                  const id = getSockId(sock);
                  setActiveMenuId(activeMenuId === id ? null : id);
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

              {activeMenuId === getSockId(sock) && (
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
                    onClick={() => triggerDeleteConfirm(getSockId(sock))}
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

      {/* Match Requests */}
      <h3 style={{ marginTop: "30px" }}>
        Match Requests
      </h3>
      {matchesLoading ? (
        <p>Loading matches...</p>
      ) : matches.filter((m) => m.status !== "rejected").length === 0 ? (
        <p style={{ color: "#888" }}>No match requests yet. Go discover some socks!</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {matches
            .filter((m) => m.status !== "rejected")
            .map((match) => {
              const currentUserId = user?.id || (user as any)?._id;
              const isRequester =
                match.user1Id._id === currentUserId ||
                (match.user1Id as any)?.id === currentUserId;
              const otherUser = isRequester ? match.user2Id : match.user1Id;
              const mySock = isRequester ? match.sock1Id : match.sock2Id;
              const theirSock = isRequester ? match.sock2Id : match.sock1Id;

              return (
                <div
                  key={match._id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "15px",
                    backgroundColor: match.status === "accepted" ? "#f0fdf4" : "#fafafa",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <img
                        src={getImageUrl(mySock?.images?.[0])}
                        alt="My sock"
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "8px",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                      <span style={{ fontSize: "11px", color: "#666" }}>Yours</span>
                    </div>

                    <span style={{ fontSize: "18px", color: "#ef4444" }}>♥</span>

                    <div style={{ textAlign: "center" }}>
                      <img
                        src={getImageUrl(theirSock?.images?.[0])}
                        alt="Their sock"
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "8px",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                      <span style={{ fontSize: "11px", color: "#666" }}>
                        {otherUser?.username}'s
                      </span>
                    </div>

                    <div style={{ marginLeft: "auto" }}>
                      {match.status === "pending" && isRequester && (
                        <span style={{ fontSize: "13px", color: "#f59e0b", fontStyle: "italic" }}>
                          Waiting for {otherUser?.username}...
                        </span>
                      )}
                      {match.status === "pending" && !isRequester && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <p style={{ margin: 0, fontSize: "13px", fontWeight: "bold" }}>
                            {otherUser?.username} wants to match!
                          </p>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              onClick={() => handleAccept(match._id)}
                              style={{
                                padding: "6px 14px",
                                backgroundColor: "#10b981",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: "bold",
                              }}
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleReject(match._id)}
                              style={{
                                padding: "6px 14px",
                                backgroundColor: "#ef4444",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "13px",
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      )}
                      {match.status === "accepted" && (
                        <div style={{ textAlign: "center" }}>
                          <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#10b981", fontWeight: "bold" }}>
                            Matched!
                          </p>
                          <button
                            onClick={() => navigate("/messages")}
                            style={{
                              padding: "6px 14px",
                              backgroundColor: "#0070f3",
                              color: "#fff",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "13px",
                            }}
                          >
                            Go to Chat
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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

            {/* Image preview — shows new selection or current image */}
            <img
              src={editImagePreview || getImageUrl(editingSock.images?.[0])}
              alt="Sock"
              style={{
                width: "100%",
                height: "140px",
                objectFit: "cover",
                borderRadius: "6px",
                display: editImagePreview || editingSock.images?.[0] ? "block" : "none",
              }}
            />
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "14px" }}>
                Replace Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleEditImageChange}
                style={{ width: "100%", fontSize: "13px" }}
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

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "14px",
                }}
              >
                Description
              </label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                maxLength={500}
                style={{
                  width: "100%",
                  padding: "8px",
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                type="button"
                onClick={closeEditModal}
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
