import React from "react";
import { Link } from "react-router-dom";
import "./ViewStoriesButton.css";

const ViewStoriesButton = () => {
  return (
    <div className="view-stories-container">
      <Link to="/stories/view" className="view-stories-button">
        View Stories
      </Link>
    </div>
  );
};

export default ViewStoriesButton;
