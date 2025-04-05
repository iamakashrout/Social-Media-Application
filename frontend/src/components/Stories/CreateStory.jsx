import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "helper";
import Navbar from "components/navbar";
import "./CreateStory.css";

const CreateStory = () => {
  const token = useSelector((state) => state.token);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setPreviewURL(URL.createObjectURL(file));
    } else {
      console.error("Please select a valid image file.");
    }
  };

  const handleCreateStory = async () => {
    if (!image) {
      console.error("Please upload an image.");
      return;
    }

    if (!caption.trim()) {
      console.error("Caption cannot be empty.");
      return;
    }

    setLoading(true); 

    try {
      const cloudinaryData = new FormData();
      cloudinaryData.append("file", image);
      cloudinaryData.append("upload_preset", "OneWorld");

      const cloudinaryRes = await fetch(
        "https://api.cloudinary.com/v1_1/ddenfqz4u/image/upload",
        {
          method: "POST",
          body: cloudinaryData,
        }
      );

      const uploaded = await cloudinaryRes.json();
      if (!uploaded.url) throw new Error("Cloudinary upload failed");

      const payload = {
        storyPath: uploaded.url,
        caption: caption.trim(),
      };

      const storyRes = await fetch(`${BASE_URL}/story/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const resp = await storyRes.json();
      if (!storyRes.ok) throw new Error(resp.message || "Failed to create story");

      console.log("Story created successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error creating story:", err);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-story-container">
        <h2>Create a Story</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="upload-input"
        />
        {previewURL && (
          <img
            src={previewURL}
            alt="Preview"
            style={{ width: "300px", marginTop: "10px", borderRadius: "10px" }}
          />
        )}
        <textarea
          placeholder="Enter a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="caption-input"
        />
        <button className="submit-btn" onClick={handleCreateStory} disabled={loading}>
          {loading ? "Sharing..." : "Share Story"}
        </button>
        {/* {loading && <p style={{ marginTop: "10px" }}>Uploading to Cloudinary...</p>} */}
      </div>
    </>
  );
};

export default CreateStory;
