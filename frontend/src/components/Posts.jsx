import { useEffect , useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Menu, MenuItem } from '@mui/material';
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import { Box } from "@mui/system";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { BASE_URL } from "helper.js";

const PostsWidget = ({ userId, isProfile = false }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState("Latest");
  const [anchorEl2, setAnchorEl2] = useState(null);
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  }
  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
  }
  
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    const response = await fetch(`${BASE_URL}/posts`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    const response = await fetch(
      `${BASE_URL}/posts/${userId}/posts`,
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

  const sortedPosts=posts.slice().sort(function (p1, p2) {
    return Object.keys(p1.likes).length - Object.keys(p2.likes).length;
  });

  var viewPosts = posts;
  if (selectedOrder === "Latest") {
    viewPosts = posts;
  }
  else {
    viewPosts = sortedPosts;
  }

  if (selectedCategory !== null) {
    viewPosts = viewPosts.filter(function (p) {
      return p.category === selectedCategory;
    })
  }


  return (
    <>
      <Box
        sx={{ display: "flex", marginTop: "28px", justifyContent: "center" }}
      >
        <Button
          onClick={(event) => setAnchorEl(event.currentTarget)}
          sx={{
            backgroundColor: "silver",
            color: "black",
            fontWeight: "bold",
            fontSize: "0.7rem",
            padding: "4px 8px",
            textTransform: "uppercase",
            marginRight: "16px",
            borderRadius: "0.75rem",
            ":hover": {
              backgroundColor: "#c147e9",
            },
          }}
        >
          {selectedCategory ? selectedCategory : "All Categories"}
          <ExpandMoreIcon sx={{ marginLeft: "4px" }} />
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => handleCategorySelect(null)}>
            All Categories
          </MenuItem>
          <MenuItem onClick={() => handleCategorySelect("Individual")}>
            Individual
          </MenuItem>
          <MenuItem onClick={() => handleCategorySelect("Political")}>
            Political
          </MenuItem>
          <MenuItem onClick={() => handleCategorySelect("Entertainment")}>
            Entertainment
          </MenuItem>
          <MenuItem onClick={() => handleCategorySelect("Sports")}>
            Sports
          </MenuItem>
          <MenuItem onClick={() => handleCategorySelect("Education")}>
            Education
          </MenuItem>
          <MenuItem onClick={() => handleCategorySelect("Tourism")}>
            Tourism
          </MenuItem>
          <MenuItem onClick={() => handleCategorySelect("Health")}>
            Health
          </MenuItem>
        </Menu>

        <Button
          onClick={(event) => setAnchorEl2(event.currentTarget)}
          sx={{
            backgroundColor: "silver",
            color: "black",
            fontWeight: "bold",
            fontSize: "0.7rem",
            padding: "4px 8px",
            textTransform: "uppercase",
            marginRight: "16px",
            borderRadius: "0.75rem",
            ":hover": {
              backgroundColor: "#c147e9",
            },
          }}
        >
          {selectedOrder ? selectedOrder : "Latest"}
          <ExpandMoreIcon sx={{ marginLeft: "4px" }} />
        </Button>
      </Box>

      <Menu
        anchorEl={anchorEl2}
        open={Boolean(anchorEl2)}
        onClose={() => setAnchorEl2(null)}
      >
        <MenuItem onClick={() => handleOrderSelect("Latest")}>Latest</MenuItem>
        <MenuItem onClick={() => handleOrderSelect("Popular")}>
          Popular
        </MenuItem>
      </Menu>

      {Array.isArray(viewPosts) &&
        viewPosts
          .slice()
          .reverse()
          .map(
            ({
              _id,
              userId,
              firstName,
              lastName,
              description,
              category,
              location,
              picturePath,
              userPicturePath,
              likes,
              comments,
              createdAt,
            }) => (
              <PostWidget
                key={_id}
                postId={_id}
                postUserId={userId}
                name={`${firstName} ${lastName}`}
                description={description}
                category={category}
                location={location}
                picturePath={picturePath}
                userPicturePath={userPicturePath}
                likes={likes}
                comments={comments}
                createdAt={createdAt}
              />
            )
          )}
    </>
  );
};

export default PostsWidget;