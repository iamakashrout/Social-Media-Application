import { Box, useMediaQuery, Button} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "components/navbar";
import FriendListWidget from "components/FriendList"; 
import MyPostWidget from "components/MyPost";
import PostsWidget from "components/Posts";
import UserWidget from "components/UserWidget";
import { BASE_URL } from "helper.js";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const loggedInUser = useSelector((state) => state.user);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const getUser = async () => {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={userId} picturePath={user.picturePath || `${BASE_URL}/uploads/default_profile_image.png`} />
          <Box m="1rem 0" />
          {/* Addded Edit Profile Button if logged-in user matches the profile */}
          {loggedInUser._id === user._id && (
            <Button
              variant="contained"
              color="primary"
              fullWidth 
              sx={{ mt: 4, py: 1.5, fontSize: "1rem", borderRadius: 3, boxShadow: 3, background: "linear-gradient(45deg, #9c27b0, #6a1b9a)", color: "white" }} 
              onClick={() => navigate(`/edit-profile/${user._id}`)}
            >
              Edit Profile
            </Button>
          )}
          <Box m="2rem 0" />
          <FriendListWidget userId={userId} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {loggedInUser._id === user._id && (
            <MyPostWidget picturePath={user.picturePath || `${BASE_URL}/uploads/default_profile_image.png`} />
          )}
          <Box m="2rem 0" />
          <PostsWidget userId={userId} isProfile />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;