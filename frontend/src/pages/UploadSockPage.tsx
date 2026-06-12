import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LiaSocksSolid } from "react-icons/lia";
import { BASE_URL } from "../services/api";

const inputStyle: React.CSSProperties = {};

export default function UploadSock() {
  const [color, setColor] = useState("");
  const [pattern, setPattern] = useState("");
  const [size, setSize] = useState("M");
  const [material, setMaterial] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) { toast.error("Please upload a photo of your sock!"); return; }

    const formData = new FormData();
    formData.append("color", color);
    formData.append("pattern", pattern);
    formData.append("size", size);
    formData.append("material", material);
    formData.append("description", description);
    formData.append("images", imageFile);

    try {
      const res = await fetch(`${BASE_URL}/socks`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Sock listed successfully!");
        navigate("/discover");
      } else {
        const error = await res.json();
        toast.error(error.message || "Upload failed.");
      }
    } catch {
      toast.error("Error uploading sock.");
    }
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "6px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
  };

  return (
    <div style={{ maxWidth: "520px", margin: "32px auto", padding: "0 16px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <LiaSocksSolid style={{ color: "#0070f3", fontSize: "22px" }} />
        <h2 style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.3px" }}>List a Lonely Sock</h2>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "28px 24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.06)",
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

          {/* Photo upload */}
          <div>
            <label style={labelStyle}>Sock Photo <span style={{ color: "#ef4444" }}>*</span></label>
            <label
              style={{
                display: "block",
                cursor: "pointer",
                borderRadius: "12px",
                overflow: "hidden",
                border: "2px dashed #d1d5db",
                transition: "border-color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#0070f3")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ width: "100%", height: "200px", objectFit: "cover", display: "block" }}
                />
              ) : (
                <div
                  style={{
                    height: "160px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    color: "#9ca3af",
                  }}
                >
                  <span style={{ fontSize: "32px" }}>📷</span>
                  <span style={{ fontSize: "14px", fontWeight: 500 }}>Click to upload</span>
                  <span style={{ fontSize: "12px" }}>JPG, PNG, WEBP</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} required style={{ display: "none" }} />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label style={labelStyle}>Color <span style={{ color: "#ef4444" }}>*</span></label>
              <input type="text" value={color} onChange={(e) => setColor(e.target.value)} placeholder="e.g. Red" required />
            </div>
            <div>
              <label style={labelStyle}>Pattern <span style={{ color: "#ef4444" }}>*</span></label>
              <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="e.g. Striped" required />
            </div>
            <div>
              <label style={labelStyle}>Size</label>
              <select value={size} onChange={(e) => setSize(e.target.value)}>
                <option value="S">S — Small</option>
                <option value="M">M — Medium</option>
                <option value="L">L — Large</option>
                <option value="XL">XL — Extra Large</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Material <span style={{ color: "#ef4444" }}>*</span></label>
              <input type="text" value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="e.g. Cotton" required />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Story</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Where did you lose it? What makes it special?"
              required
              style={{ minHeight: "88px", resize: "vertical" }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "13px",
              backgroundColor: "#10b981",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: 700,
              boxShadow: "0 4px 14px rgba(16,185,129,0.30)",
            }}
          >
            List My Sock
          </button>
        </form>
      </div>
    </div>
  );
}
