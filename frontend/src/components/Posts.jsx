import { useEffect , useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Menu, MenuItem } from '@mui/material';
import { setPosts } from "state";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);}
  
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    const response = await fetch("http://localhost:5000/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    const response = await fetch(
      `http://localhost:5000/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
    <Button
      variant="outlined"
      onClick={(event) => setAnchorEl(event.currentTarget)}
      sx={{
        color: 'grey',
        fontWeight: 'bold', 
        fontSize: '0.9rem', 
        textTransform: 'none', 
      }}
    >
      {selectedCategory ? selectedCategory : 'All Categories'}
    </Button>

    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={() => setAnchorEl(null)}
    >
      <MenuItem onClick={() => handleCategorySelect(null)}>All Categories</MenuItem>
      <MenuItem onClick={() => handleCategorySelect('Comedy')}>Entertainment</MenuItem>
      <MenuItem onClick={() => handleCategorySelect('Political')}>Political</MenuItem>
      <MenuItem onClick={() => handleCategorySelect('Bollywood')}>Bollywood</MenuItem>
      <MenuItem onClick={() => handleCategorySelect('Sports')}>Sports</MenuItem>
      <MenuItem onClick={() => handleCategorySelect('Academics')}>Academics</MenuItem>
    </Menu>

      {Array.isArray(posts) && posts.slice(0).reverse().map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;