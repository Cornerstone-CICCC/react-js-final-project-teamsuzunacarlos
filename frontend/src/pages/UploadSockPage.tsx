// Page for uploading a new sock
// Should include:
// - SockUploadForm component
// - Page layout
// - Success message/redirect after upload

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LiaSocksSolid } from "react-icons/lia";

export default function UploadSock() {
  const [color, setColor] = useState("");
  const [pattern, setPattern] = useState("");
  const [size, setSize] = useState("M");
  const [material, setMaterial] = useState("");
  const [description, setDescription] = useState("");
  // const [imageUrl, setImageUrl] = useState(""); // for testing
  const [message, setMessage] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(""); // preview

  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setMessage("");

    if (!imageFile) {
      toast.error("Please upload an image of your sock!");
      return;
    }

    const formData = new FormData();
    formData.append("color", color);
    formData.append("pattern", pattern);
    formData.append("size", size);
    formData.append("material", material);
    formData.append("description", description);
    // depending on what carlos's backend key is (e.x. upload.single('image'))
    formData.append("image", imageFile);

    console.log(
      "Form data ready to be sent to backend via multipart/form-data",
    );

    // try {
    //   const res = await fetch('http://localhost:5000/api/socks', {
    //     method: 'POST',
    //     body: formData,
    //     credentials: 'include'
    //   });
    //   if (res.ok) {
    //     toast.success("Sock uploaded successfully!");
    //     navigate('/profile');
    //   } else {
    //     toast.error("Upload failed.");
    //   }
    // } catch (err) {
    //   console.error(err);
    // }

    // const sockData = {
    //   color,
    //   pattern,
    //   size,
    //   material,
    //   description,
    //   images: [
    //     imageUrl ||
    //       "https://images.unsplash.com/photo-1582966772680-860e372bb558?w=500",
    //   ],
    // };

    // console.log("Uploading sock data:", sockData);

    // if the backend is ready, switch to this!!!
    // try {
    //   const res = await fetch('http://localhost:5000/api/socks', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(sockData),
    //     credentials: 'include'
    //   });
    //   if (res.ok) navigate('/profile');
    // } catch (err) { ... }

    // setMessage("Sock uploaded successfully!");
    toast.success("Sock uploaded successfully!");

    setTimeout(() => {
      navigate("/discover");
    }, 2000);
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2>
        Upload Your Lonely Sock <LiaSocksSolid />
      </h2>
      {message && (
        <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Color</label>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="e.g. Red, Neon Green"
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Pattern
          </label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="e.g. Striped, Polka Dot, Plain"
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Size</label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="S">S (Small)</option>
            <option value="M">M (Medium)</option>
            <option value="L">L (Large)</option>
            <option value="XL">XL (Extra Large)</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Material
          </label>
          <input
            type="text"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            placeholder="e.g. Cotton, Wool"
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}
          >
            Sock Photo
          </label>
          <input
            type="file"
            accept="image/*" // image file only
            onChange={handleFileChange}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />

          {previewUrl && (
            <div style={{ marginTop: "10px", textAlign: "center" }}>
              <img
                src={previewUrl}
                alt="Sock Preview"
                style={{
                  width: "100%",
                  maxHeight: "200px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Where did you lose it? What makes it special?"
            required
            style={{
              width: "100%",
              padding: "8px",
              height: "8px",
              minHeight: "80px",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#10b981",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          List my Sock
        </button>
      </form>
    </div>
  );
}
