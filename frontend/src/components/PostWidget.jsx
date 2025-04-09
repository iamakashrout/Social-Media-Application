import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import Badge from "@mui/material/Badge";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  InputBase,
  Button,
} from "@mui/material";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import FlexBetween from "tools/FlexBetween";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Friend from "tools/Friend";
import WidgetWrapper from "tools/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPost } from "state";
import UserImage from "tools/UserImage";
import ReactTimeAgo from "react-time-ago";
import { BASE_URL } from "helper.js";
import { removePost } from '../state/index';

import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import Popover from "@mui/material/Popover";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  category,
  location,
  picturePath,
  userPicturePath,
  //likes,
  reactions,
  comments,
  createdAt,
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const loggedInUserName = useSelector((state) => state.user.firstName);
  const loggedInUserPicture = useSelector((state) => state.user.picturePath);
  // const isLiked = Boolean(likes[loggedInUserId]);
  // const likeCount = Object.keys(likes).length;
  const [comment, setComment] = useState("");

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElReaction, setAnchorElReaction] = useState(null);
  
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const reactionTypes = [
    { type: "like", emoji: "👍" },
    { type: "love", emoji: "❤️" },
    { type: "funny", emoji: "😂" },
    { type: "sad", emoji: "😢" },
    { type: "celebrate", emoji: "🎉" },
  ];
  
  const userReaction = reactions?.[loggedInUserId];
  const reactionCounts = Object.values(reactions || {}).reduce((acc, reaction) => {
    acc[reaction] = (acc[reaction] || 0) + 1;
    return acc;
  }, {});

  // const patchLike = async () => {
  //   const response = await fetch(`${BASE_URL}/posts/${postId}/like`, {
  //     method: "PATCH",
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ userId: loggedInUserId }),
  //   });
  //   const updatedPost = await response.json();
  //   dispatch(setPost({ post: updatedPost }));
  // };

  const handleReaction = async (reactionType) => {
    const response = await fetch(`${BASE_URL}/posts/${postId}/react`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId, reactionType }),
    });
    console.log("we have got the result from the backend");
    
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    console.log("updated post ",updatedPost);
  };

  const handleComment = async () => {
    const response = await fetch(
      `${BASE_URL}/posts/${postId}/comment`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: loggedInUserId,
          userpic: loggedInUserPicture,
          username: loggedInUserName,
          comment: comment,
        }),
      }
    );
    const updatedPost = await response.json();
    setComment("");
    dispatch(setPost({ post: updatedPost }));
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/posts/${postId}/delete/${commentId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            
            userId: loggedInUserId, 
          }),
        }
      );
  
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost })); // Update the post in Redux state
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEditClick = (commentId, existingComment) => {
    setEditingCommentId(commentId);
    setEditedComment(existingComment);
  };
  
  const handleUpdateComment = async (commentId) => {
    const response = await fetch(`${BASE_URL}/posts/${postId}/edit/${commentId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        
        newComment: editedComment,
      }),
    });
  
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    setEditingCommentId(null);
    setEditedComment("");
  };

  const handleLikeComment = async (commentId) => {
    const response = await fetch(`${BASE_URL}/posts/${postId}/like/${commentId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });
  
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };
  const handleDeletePost = async (postId) => {
    try {
      // Check if the logged-in user is the owner of the post
      if (postUserId !== loggedInUserId) {
        console.error("You do not have permission to delete this post.");
        return;
      }
  
      console.log("Deleting post with ID:", postId);
      console.log("Authorization token:", token);
  
      const response = await fetch(`${BASE_URL}/posts/${postId}/deletepost`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      console.log("Response status:", response.status);
  
      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response
        console.error("Error details:", errorData);
        throw new Error("Failed to delete post");
      }
  
      dispatch(removePost({ postId })); // Dispatch the removePost action
    } catch (error) {
      console.error("Error deleting post:", error.message);
    }
  };

  

  
  return (
    <WidgetWrapper m="2rem 0">
      <div sx={{ margin: "-8px 0 16px 0" }}>
        
        <Friend
          friendId={postUserId}
          name={name}
          subtitle={
            <ReactTimeAgo
              style={{ color: main }}
              date={createdAt}
              locale="en-US"
            />
          }
          userPicturePath={userPicturePath}
        />
        <Typography color={main} sx={{ mt: "1rem" }}>
          <Badge
            color="secondary"
            badgeContent={category}
            sx={{
              marginTop: "-190px",
              mt: "-190px",
              mr: "8px",
              marginLeft: "415px",
            }}
          ></Badge>
        </Typography>
        
        <Typography color={main} sx={{ mt: "-25px", ml: "8px" }}>
          {description}
        </Typography>
        
  {/* {picturePath && (
    <img
      width="100%"
      height="auto"
      alt="post"
      style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
      src={picturePath}
    />
  )} */}
  {picturePath.length>1?(
  <Swiper style={{height:'400px',width:'400px'}}
  modules={[Navigation, Pagination]}
  navigation
  pagination={{ clickable: true }}
      loop={true} // this enables looping
      spaceBetween={10}
      slidesPerView={1}
    >
     {picturePath.map((url, index) => (
        <SwiperSlide key={index}>
          <img src={url} alt={`Slide ${index}`} width={500} height={500} />
        </SwiperSlide>
      ))}
    </Swiper>):picturePath.length===1?
    (<img src={picturePath[0]} width={500} height={500}/>):null
    }
  
   {/* <FlexBetween mt="0.25rem">
          <FlexBetween gap="1rem">
            <FlexBetween gap="0.3rem">
              <IconButton onClick={patchLike}>
                {isLiked ? (
                  <FavoriteOutlined sx={{ color: "#c147e9" }} />
                ) : (
                  <FavoriteBorderOutlined />
                )}
              </IconButton>
              <Typography>{likeCount}</Typography>
            </FlexBetween> */}

        <FlexBetween mt="0.25rem">
        <FlexBetween gap="0.3rem">
  <IconButton onClick={(e) => setAnchorElReaction(e.currentTarget)}>
    <EmojiEmotionsIcon color={userReaction ? "primary" : "action"} />
  </IconButton>
  <Box display="flex" gap="0.4rem">
    {reactionTypes.map(({ type, emoji }) => (
      <Box key={type} display="flex" alignItems="center" gap="0.1rem">
        <Typography fontSize="1.2rem">{emoji}</Typography>
        <Typography fontSize="0.9rem">{reactionCounts[type]||0}</Typography>
      </Box>
    ))}
  </Box>
</FlexBetween>
<Popover
  open={Boolean(anchorElReaction)}
  anchorEl={anchorElReaction}
  onClose={() => setAnchorElReaction(null)}
  anchorOrigin={{ vertical: "top", horizontal: "center" }}
  transformOrigin={{ vertical: "bottom", horizontal: "center" }}
>
  <Box display="flex" padding="0.5rem">
    {reactionTypes.map(({ type, emoji }) => (
      <IconButton key={type} onClick={() => {
        handleReaction(type);
        setAnchorElReaction(null);
      }}>
        <Typography fontSize="1.5rem" title={type}>
          {emoji}
        </Typography>
      </IconButton>
    ))}
  </Box>
</Popover>

            <FlexBetween gap="0.3rem">
              <IconButton onClick={() => setIsComments(!isComments)}>
                <ChatBubbleOutlineOutlined />
              </IconButton>
              <Typography>{comments.length}</Typography>
            </FlexBetween>
          </FlexBetween>
        {/* </FlexBetween> */}
        {isComments && (
          <Box mt="0.5rem">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                width: "100%",
                padding: "0.1rem",
              }}
            >
              <InputBase
                placeholder="  Write a comment..."
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                sx={{
                  flex: 1,
                  backgroundColor: palette.neutral.light,
                  borderRadius: "1rem",
                }}
              />
              <Button
                disabled={!comment}
                onClick={handleComment}
                sx={{
                  // color: palette.background.alt,
                  color: "black",
                  backgroundColor: "silver",
                  borderRadius: "0.75rem",
                  fontSize: "0.5rem",
                  fontWeight: "bold",
                  ":hover": {
                    backgroundColor: "#c147e9",
                  },
                }}
              >
                COMMENT
              </Button>
            </Box>
            {comments.map((item, i) => (
              <Box key={`${name}-${i}`} sx={{ mt: "0.5rem" }}>
                <Divider />
                <Box sx={{ display: "flex", alignItems: "center", mt: "0.5rem", gap: "0.5rem" }}>
                  <UserImage image={item.userpic} size="30px" />
                  <Typography
                    sx={{
                      color: palette.secondary.main,
                      fontWeight: "bold",
                      "&:hover": { color: palette.primary.light, cursor: "pointer" },
                    }}
                    onClick={() => {
                      navigate(`/profile/${item.userId}`);
                      navigate(0);
                    }}
                  >
                    {item.username}
                  </Typography>


                  {/* Edit Mode */}
                  {editingCommentId === item._id ? (
                    
                    <Box display="flex" alignItems="center" gap={1}>
                    <InputBase
                      value={editedComment}
                      onChange={(e) => setEditedComment(e.target.value)}
                      sx={{
                        flex: 1,
                        backgroundColor: palette.neutral.light,
                        borderRadius: "1rem",
                        padding: "4px",
                      }}
                    />
                    <MenuItem onClick={() => { handleUpdateComment(item._id); setAnchorEl(null); }}>
                      Save✅
                    </MenuItem>
                  </Box>
                    
                  ) : (
                    <Typography sx={{ color: main, flex: 1 }}>{item.comment}</Typography>
                  )}

                  {/* Menu for Edit & Delete */}
                  {item.userId === loggedInUserId && (
                    <Box>
                      <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                      >
                        {editingCommentId !== item._id ? 
                          
                        (
                          <MenuItem onClick={() => { handleEditClick(item._id, item.comment); setAnchorEl(null); }}>
                            Edit
                          </MenuItem>
                        ):<></>}
                        <MenuItem onClick={() => { handleDeleteComment(item._id); setAnchorEl(null); }}>
                          Delete
                        </MenuItem>
                      </Menu>
                    </Box>
                  )}
                  {/* Like Button & Count */}
                  <Box sx={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <IconButton onClick={() => handleLikeComment(item._id)}>
                      {item.likes && item.likes[loggedInUserId] ? <FavoriteOutlined sx={{ color: "#c147e9" }} /> : <FavoriteBorderOutlined />}
                    </IconButton>
                    <Typography sx={{ minWidth: "20px", textAlign: "center" }}>{item.likes ? Object.keys(item.likes).length : 0}</Typography>
                  </Box>
                </Box>
              </Box>
            ))}
            

            <Divider sx={{ mt: "0.2rem" }} />
            
          </Box>
        )}
        
      </div>
      
      {postUserId === loggedInUserId && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "1rem", mt: "1rem" }}>
          
          <Button
            sx={{
              backgroundColor: "#e91e63",
              color: "white",
              borderRadius: "8px",
              fontWeight: "bold",
              ":hover": { backgroundColor: "#c2185b" },
            }}
            onClick={() => handleDeletePost(postId)}
          >
            Delete
          </Button>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;