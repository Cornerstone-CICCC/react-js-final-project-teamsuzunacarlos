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
import { getImageUrl, BASE_URL } from "../services/api";

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
      const res = await fetch(`${BASE_URL}/socks/my-socks`, { credentials: 'include' });
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
      const res = await fetch(`${BASE_URL}/matches`, { credentials: 'include' });
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
      const res = await fetch(`${BASE_URL}/matches/${matchId}/accept`, {
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
      const res = await fetch(`${BASE_URL}/matches/${matchId}/reject`, {
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
          const res = await fetch(`${BASE_URL}/socks/${sockId}`, {
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
        res = await fetch(`${BASE_URL}/socks/${sockId}`, {
          method: 'PUT',
          body: formData,
          credentials: 'include',
        });
      } else {
        res = await fetch(`${BASE_URL}/socks/${sockId}`, {
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

  const card: React.CSSProperties = {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px 20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.06)",
    marginBottom: "20px",
  };

  const sectionLabel: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.6px",
    color: "#9ca3af",
    marginBottom: "14px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  return (
    <div style={{ maxWidth: "620px", margin: "28px auto", padding: "0 16px 32px" }}>

      {/* Profile card */}
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {displayUser?.profilePicture ? (
            <img
              src={displayUser.profilePicture}
              alt="Profile"
              style={{ width: "72px", height: "72px", borderRadius: "50%", objectFit: "cover", border: "3px solid #e8f2ff", flexShrink: 0 }}
            />
          ) : (
            <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#e8f2ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: "28px", color: "#0070f3" }}>🧦</span>
            </div>
          )}
          <div style={{ flexGrow: 1, minWidth: 0 }}>
            <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "2px" }}>{displayUser?.username}</h2>
            <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>{displayUser?.email}</p>
            {displayUser?.bio && (
              <p style={{ fontSize: "13px", color: "#4b5563", fontStyle: "italic" }}>{displayUser.bio}</p>
            )}
          </div>
          <button
            onClick={triggerLogoutConfirm}
            style={{
              padding: "8px 14px",
              backgroundColor: "#fff0f0",
              color: "#ef4444",
              border: "1.5px solid #fecaca",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              flexShrink: 0,
              alignSelf: "flex-start",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* My sock list */}
      <div style={card}>
        <p style={sectionLabel}><LiaSocksSolid /> My Socks</p>
        {loading ? (
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>Loading your closet...</p>
        ) : mySocks.length === 0 ? (
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>You haven't uploaded any socks yet.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {mySocks.map((sock) => (
            <div
              key={getSockId(sock)}
              style={{
                border: "1.5px solid #f0f0f0",
                borderRadius: "12px",
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              <img
                src={getImageUrl(sock.images[0])}
                alt="My Sock"
                style={{ width: "100%", height: "150px", objectFit: "cover", display: "block" }}
              />

              <span
                style={{
                  position: "absolute",
                  bottom: "52px",
                  left: "8px",
                  padding: "3px 8px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#fff",
                  backgroundColor: sock.status === "matched" ? "#10b981" : "#f59e0b",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                }}
              >
                {sock.status === "matched" ? "Matched" : "Available"}
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
                  background: "rgba(255,255,255,0.9)",
                  border: "none",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  zIndex: 10,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                }}
              >
                <BsThreeDotsVertical />
              </button>

              {activeMenuId === getSockId(sock) && (
                <div
                  style={{
                    position: "absolute",
                    top: "42px",
                    right: "8px",
                    backgroundColor: "#fff",
                    border: "1.5px solid #f0f0f0",
                    borderRadius: "10px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                    zIndex: 20,
                    overflow: "hidden",
                    minWidth: "110px",
                  }}
                >
                  <button
                    onClick={() => openEditModal(sock)}
                    style={{ padding: "10px 14px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontSize: "13px", fontWeight: 500, width: "100%", display: "block" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f4f6f9")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => triggerDeleteConfirm(getSockId(sock))}
                    style={{ padding: "10px 14px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontSize: "13px", fontWeight: 500, color: "#ef4444", width: "100%", display: "block" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fff5f5")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    Delete
                  </button>
                </div>
              )}

              <div style={{ padding: "8px 10px" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#111827", marginBottom: "2px" }}>
                  {sock.color} {sock.pattern}
                </div>
                <div style={{ fontSize: "11px", color: "#9ca3af" }}>
                  {sock.size} · {sock.material}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>

      {/* Match Requests card */}
      <div style={card}>
        <p style={sectionLabel}>Match Requests</p>
        {matchesLoading ? (
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>Loading matches...</p>
        ) : matches.filter((m) => m.status !== "rejected").length === 0 ? (
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>No match requests yet. Go discover some socks!</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
                      border: "1.5px solid",
                      borderColor: match.status === "accepted" ? "#a7f3d0" : "#f0f0f0",
                      borderRadius: "12px",
                      padding: "12px 14px",
                      backgroundColor: match.status === "accepted" ? "#f0fdf4" : "#fafafa",
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
                        style={{ width: "52px", height: "52px", borderRadius: "8px", objectFit: "cover", display: "block" }}
                      />
                      <span style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 600 }}>Yours</span>
                    </div>

                    <span style={{ fontSize: "16px", color: "#ef4444" }}>♥</span>

                    <div style={{ textAlign: "center" }}>
                      <img
                        src={getImageUrl(theirSock?.images?.[0])}
                        alt="Their sock"
                        style={{ width: "52px", height: "52px", borderRadius: "8px", objectFit: "cover", display: "block" }}
                      />
                      <span style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 600 }}>{otherUser?.username}'s</span>
                    </div>

                    <div style={{ marginLeft: "auto", textAlign: "right" }}>
                      {match.status === "pending" && isRequester && (
                        <span style={{ fontSize: "12px", color: "#f59e0b", fontWeight: 600, fontStyle: "italic" }}>
                          Waiting for {otherUser?.username}...
                        </span>
                      )}
                      {match.status === "pending" && !isRequester && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end" }}>
                          <span style={{ fontSize: "12px", fontWeight: 700, color: "#374151" }}>
                            {otherUser?.username} wants to match!
                          </span>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              onClick={() => handleAccept(match._id)}
                              style={{ padding: "6px 14px", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: "20px", cursor: "pointer", fontSize: "12px", fontWeight: 700 }}
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleReject(match._id)}
                              style={{ padding: "6px 14px", backgroundColor: "#fff", color: "#ef4444", border: "1.5px solid #fecaca", borderRadius: "20px", cursor: "pointer", fontSize: "12px", fontWeight: 700 }}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      )}
                      {match.status === "accepted" && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                          <span style={{ fontSize: "12px", color: "#10b981", fontWeight: 700 }}>Matched!</span>
                          <button
                            onClick={() => navigate("/messages")}
                            style={{ padding: "6px 14px", backgroundColor: "#0070f3", color: "#fff", border: "none", borderRadius: "20px", cursor: "pointer", fontSize: "12px", fontWeight: 700, boxShadow: "0 2px 8px rgba(0,112,243,0.25)" }}
                          >
                            Go to Chat
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {editingSock && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <form
            onSubmit={handleSaveEdit}
            style={{
              backgroundColor: "#fff",
              padding: "24px",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "400px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h3 style={{ fontSize: "17px", fontWeight: 800, marginBottom: "2px" }}>Edit Sock</h3>

            <img
              src={editImagePreview || getImageUrl(editingSock.images?.[0])}
              alt="Sock"
              style={{
                width: "100%",
                height: "160px",
                objectFit: "cover",
                borderRadius: "10px",
                display: editImagePreview || editingSock.images?.[0] ? "block" : "none",
              }}
            />
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 600, color: "#374151" }}>Replace Image</label>
              <input type="file" accept="image/*" onChange={handleEditImageChange} style={{ fontSize: "13px" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 600, color: "#374151" }}>Color</label>
                <input type="text" value={editColor} onChange={(e) => setEditColor(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 600, color: "#374151" }}>Pattern</label>
                <input type="text" value={editPattern} onChange={(e) => setEditPattern(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 600, color: "#374151" }}>Size</label>
                <select value={editSize} onChange={(e) => setEditSize(e.target.value)}>
                  <option value="S">S — Small</option>
                  <option value="M">M — Medium</option>
                  <option value="L">L — Large</option>
                  <option value="XL">XL — Extra Large</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 600, color: "#374151" }}>Material</label>
                <input type="text" value={editMaterial} onChange={(e) => setEditMaterial(e.target.value)} required />
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 600, color: "#374151" }}>Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                maxLength={500}
                style={{ resize: "vertical", minHeight: "72px" }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
              <button
                type="button"
                onClick={closeEditModal}
                style={{ flex: 1, padding: "11px", backgroundColor: "#f4f6f9", color: "#374151", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: 600, fontSize: "14px" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ flex: 1, padding: "11px", backgroundColor: "#0070f3", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: 700, fontSize: "14px", boxShadow: "0 4px 14px rgba(0,112,243,0.3)" }}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {confirmModal.isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1100,
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "28px 24px",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "340px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
              textAlign: "center",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "10px" }}>
              {confirmModal.title}
            </h3>
            <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.55", marginBottom: "22px" }}>
              {confirmModal.message}
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                style={{ flex: 1, padding: "11px", backgroundColor: "#f4f6f9", color: "#374151", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                style={{ flex: 1, padding: "11px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: 700, fontSize: "14px", boxShadow: "0 4px 12px rgba(239,68,68,0.3)" }}
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
