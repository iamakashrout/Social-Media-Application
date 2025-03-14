import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "components/navbar";
import UserWidget from "components/UserWidget";
import MyPostWidget from "components/MyPost";
import PostsWidget from "components/Posts";
import FriendListWidget from "components/FriendList";
import { BASE_URL } from "helper.js";
import HelpButton from "components/Chatbot/HelpButton";
import HelpChat from "components/Chatbot/HelpChat";
import { useState } from "react";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);
  const [showHelpChat, setShowHelpChat] = useState(false);

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath || `${BASE_URL}/uploads/default_profile_image.png`} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={picturePath || `${BASE_URL}/uploads/default_profile_image.png`} />
          <PostsWidget userId={_id} />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <Box m="2rem 0" />
            <FriendListWidget userId={_id} />
          </Box>
        )}
      </Box>
      <HelpButton onClick={() => setShowHelpChat(true)} />
      {showHelpChat && <HelpChat onClose={() => setShowHelpChat(false)} />}
    </Box>
  );
};

export default HomePage;
