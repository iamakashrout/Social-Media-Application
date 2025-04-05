import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa"; // Import icon
import "./CreateStoryButton.css"; // Import the CSS

const CreateStoryButton = () => {
  const navigate = useNavigate();

  return (
    <button className="create-story-btn" onClick={() => navigate("/stories/create")}>
      <FaPlus /> Create Story
    </button>
  );
};

export default CreateStoryButton;
