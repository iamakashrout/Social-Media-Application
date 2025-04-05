import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "helper.js";
import { Typography, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Navbar from "components/navbar";
import "./Stories.css";

const StoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [myStories, setMyStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);
  const { _id } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const token = localStorage.getItem("token");

        const [friendsRes, ownRes] = await Promise.all([
          fetch(`${BASE_URL}/story/fetch`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${BASE_URL}/story/own-stories`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const friendsData = await friendsRes.json();
        const ownData = await ownRes.json();

        console.log(ownData);

        if (!friendsData.error) setStories(friendsData || []);
        if (!ownData.error) setMyStories(ownData.stories || []);
      } catch (error) {
        console.error("Error fetching stories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const handleStoryClick = async (story) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${BASE_URL}/story/view`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ storyId: story._id }),
      });

      setSelectedStory(story);
    } catch (error) {
      console.error("Error viewing story:", error);
    }
  };

  const handleLikeStory = async (storyId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/story/like`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ storyId }),
      });

      const result = await response.json();

      if (result.found !== undefined) {
        const updateStories = (storiesArray) =>
          storiesArray.map((story) =>
            story._id === storyId
              ? {
                  ...story,
                  likecount: result.found
                    ? Math.max(0, story.likecount - 1)
                    : story.likecount + 1,
                  likes: result.found
                    ? story.likes.filter((id) => id !== _id)
                    : [...story.likes, _id],
                }
              : story
          );

        setStories((prev) => updateStories(prev));
        setMyStories((prev) => updateStories(prev));

        if (selectedStory && selectedStory._id === storyId) {
          setSelectedStory((prev) => ({
            ...prev,
            likecount: result.found
              ? Math.max(0, prev.likecount - 1)
              : prev.likecount + 1,
            likes: result.found
              ? prev.likes.filter((id) => id !== _id)
              : [...prev.likes, _id],
          }));
        }
      }
    } catch (error) {
      console.error("Error liking story:", error);
    }
  };

  const hasUserLiked = (story) => story?.likes?.includes(_id);

  const renderStoryGrid = (storyList, title) => (
    <>
      <Typography variant="h4" sx={{ mt: 4, mb: 2, fontWeight: "bold" }}>
        {title}
      </Typography>
      <div className="stories-grid">
        {storyList.length > 0 ? (
          storyList.map((story) => (
            <div
              key={story._id}
              className="story-card"
              onClick={() => handleStoryClick(story)}
            >
              <img
                src={`${story.storyPath}`}
                alt="Story"
                className="story-image"
              />
              <h3 className="story-title">
                {story.firstName} {story.lastName}
              </h3>
            </div>
          ))
        ) : (
          <p className="no-stories">No stories available.</p>
        )}
      </div>
    </>
  );
  

  return (
    <>
      <Navbar />
      <div className="stories-container">
        {/* <button className="back-button" onClick={() => navigate("/")}>
          ← Back
        </button> */}

        {loading ? (
          <p className="loading-text">Loading stories...</p>
        ) : (
          <>
            {myStories.length > 0 && renderStoryGrid(myStories, "Your Stories")}
            {renderStoryGrid(stories, "Friends' Stories")}
          </>
        )}

        {selectedStory && (
          <div className="story-modal" onClick={() => setSelectedStory(null)}>
            <div
              className="modal-content"
              style={{ backgroundColor: "white", color: "black" }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="close-button" onClick={() => setSelectedStory(null)}>
                ✖
              </span>

              <img
                src={`${selectedStory.storyPath}`}
                alt="Story"
                className="modal-image"
              />

              <Typography variant="h5" sx={{ fontWeight: "bold", mt: 2 }}>
                {selectedStory.firstName} {selectedStory.lastName}
              </Typography>

              <Typography variant="h6" className="caption">
                {selectedStory.caption}
              </Typography>

              <div className="modal-footer">
                <div className="story-actions">
                  <IconButton
                    onClick={() => handleLikeStory(selectedStory._id)}
                    sx={{ fontSize: "2rem" }}
                  >
                    {hasUserLiked(selectedStory) ? (
                      <FavoriteIcon color="error" fontSize="large" />
                    ) : (
                      <FavoriteBorderIcon color="error" fontSize="large" />
                    )}
                  </IconButton>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "black" }}>
                    {selectedStory.likecount}
                  </Typography>
                </div>

                <div className="view-count">
                  <VisibilityIcon fontSize="large" />
                  <Typography variant="h6">{selectedStory.viewcount} views</Typography>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StoriesPage;
