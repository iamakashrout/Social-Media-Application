import {
    EditOutlined,
    DeleteOutlined,
    AttachFileOutlined,
    GifBoxOutlined,
    ImageOutlined,
    MicOutlined,
    MoreHorizOutlined,
  } from "@mui/icons-material";
  import {
    Box,
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button,
    IconButton,
  useMediaQuery,
  Menu,
    MenuItem,
  } from "@mui/material";
  import FlexBetween from "tools/FlexBetween";
  import Dropzone from "react-dropzone";
  import UserImage from "tools/UserImage";
import WidgetWrapper from "tools/WidgetWrapper";
  import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
  import { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import app from "../firebase.js"
   import {
     getDownloadURL,
     getStorage,
     ref,
     uploadBytesResumable,
   } from "firebase/storage";
  
  const MyPostWidget = ({ picturePath }) => {
    const dispatch = useDispatch();
    const [isImage, setIsImage] = useState(false);
    const [image, setImage] = useState(null);
    const [post, setPost] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Individual");
    const [anchorEl, setAnchorEl] = useState(null);
    const handleCategorySelect = (category) => {
      setSelectedCategory(category);
    };
    const { palette } = useTheme();
    const { _id } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;
  
    const handlePost = async () => {
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("description", post);
      formData.append("category", selectedCategory);
      if (image) {
        const fileName = new Date().getTime() + image?.name;
        const storage = getStorage(app);
        const StorageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(StorageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {},
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log(downloadURL);
              formData.append("picture", image);
              formData.append("picturePath", downloadURL);
              fetch(`http://localhost:5000/posts`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
              }).then(async (response) => {
                const posts = await response.json();
                dispatch(setPosts({ posts }));
                setImage(null);
                setPost("");
              });
            });
          }
        );



        /*formData.append("picture", image);
        formData.append("picturePath", image.name);*/
      }
  
      /*const response = await fetch(`http://localhost:5000/posts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const posts = await response.json();
      dispatch(setPosts({ posts }));
      setImage(null);
      setPost("");*/
    };
  
    return (
      <WidgetWrapper>
        <FlexBetween gap="1.5rem">
          <UserImage image={picturePath} />
          <InputBase
            placeholder="What's on your mind..."
            onChange={(e) => setPost(e.target.value)}
            value={post}
            sx={{
              width: "100%",
              backgroundColor: palette.neutral.light,
              borderRadius: "2rem",
              padding: "1rem 2rem",
            }}
          />
        </FlexBetween>
        {isImage && (
          <Box
            border={`1px solid ${medium}`}
            borderRadius="5px"
            mt="1rem"
            p="1rem"
          >
            <Dropzone
              acceptedFiles=".jpg,.jpeg,.png"
              multiple={false}
              onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
            >
              {({ getRootProps, getInputProps }) => (
                <FlexBetween>
                  <Box
                    {...getRootProps()}
                    border={`2px dashed ${palette.primary.main}`}
                    p="1rem"
                    width="100%"
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  >
                    <input {...getInputProps()} />
                    {!image ? (
                      <p>Add Image Here</p>
                    ) : (
                      <FlexBetween>
                        <Typography>{image.name}</Typography>
                        <EditOutlined />
                      </FlexBetween>
                    )}
                  </Box>
                  {image && (
                    <IconButton
                      onClick={() => setImage(null)}
                      sx={{ width: "15%" }}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  )}
                </FlexBetween>
              )}
            </Dropzone>
          </Box>
        )}

        <Divider sx={{ margin: "1.25rem 0" }} />


        

        
        <Button
          onClick={(event) => setAnchorEl(event.currentTarget)}
          sx={{
            backgroundColor: "primary.main",
            color: "black",
            fontWeight: "bold",
            fontSize: "0.7rem",
            padding: "4px 8px",
            textTransform: "uppercase",
            marginRight: "16px",
            borderRadius: "0.75rem",
            "&:hover": {
              backgroundColor: "primary.dark",
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



        

        <FlexBetween>
          <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
            <ImageOutlined sx={{ color: mediumMain }} />
            <Typography
              color={mediumMain}
              sx={{ "&:hover": { cursor: "pointer", color: medium } }}
            >
              Image
            </Typography>
          </FlexBetween>

          {isNonMobileScreens ? (
            <>
              <FlexBetween gap="0.25rem">
                <GifBoxOutlined sx={{ color: mediumMain }} />
                <Typography color={mediumMain}>Clip</Typography>
              </FlexBetween>

              <FlexBetween gap="0.25rem">
                <AttachFileOutlined sx={{ color: mediumMain }} />
                <Typography color={mediumMain}>Attachment</Typography>
              </FlexBetween>

              <FlexBetween gap="0.25rem">
                <MicOutlined sx={{ color: mediumMain }} />
                <Typography color={mediumMain}>Audio</Typography>
              </FlexBetween>
            </>
          ) : (
            <FlexBetween gap="0.25rem">
              <MoreHorizOutlined sx={{ color: mediumMain }} />
            </FlexBetween>
          )}

          <Button
            disabled={!post}
            onClick={handlePost}
            //   sx={{
            //     // color: palette.background.alt,
            //     color: "black",
            //     backgroundColor: palette.primary.main,
            //     borderRadius: "3rem",
            //   }}
            sx={{
              backgroundColor: "primary.main",
              color: "black",
              fontWeight: "bold",
              fontSize: "0.7rem",
              padding: "5px 10px",
              textTransform: "uppercase",
              marginRight: "16px",
              borderRadius: "0.75rem",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            POST
          </Button>
        </FlexBetween>
      </WidgetWrapper>
    );
  };
  
  export default MyPostWidget;