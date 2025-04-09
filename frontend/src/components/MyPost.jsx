import "theme.js";
 import { toast } from "react-hot-toast";
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
import { BASE_URL } from "helper.js";
  
  const MyPostWidget = ({ picturePath }) => {
    const dispatch = useDispatch();
    const [isImage, setIsImage] = useState(false);
    // const [image, setImage] = useState(null);
    const [images, setImages] = useState([]);
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
    // const handlePost = async () => {
    //   const formData = new FormData();
    //   formData.append("userId", _id);
    //   formData.append("description", post);
    //   formData.append("category", selectedCategory);
    //   if (image) {
    //     const fileName = new Date().getTime() + image?.name;
    //     const storage = getStorage(app);
    //     const StorageRef = ref(storage, fileName);
    //     const uploadTask = uploadBytesResumable(StorageRef, image);
    //     uploadTask.on(
    //       "state_changed",
    //       (snapshot) => {
    //         const progress =
    //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //         console.log("Upload is " + progress + "% done");
    //         switch (snapshot.state) {
    //           case "paused":
    //             console.log("Upload is paused");
    //             break;
    //           case "running":
    //             console.log("Upload is running");
    //             break;
    //         }
    //       },
    //       (error) => {},
    //       () => {
    //         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //           console.log(downloadURL);
    //           formData.append("picture", image);
    //           formData.append("picturePath", downloadURL);
    //           fetch(`${BASE_URL}/posts`, {
    //             method: "POST",
    //             headers: { Authorization: `Bearer ${token}` },
    //             body: formData,
    //           }).then(async (response) => {
    //             const posts = await response.json();
    //             dispatch(setPosts({ posts }));
    //             setImage(null);
    //             setPost("");
    //             toast.dismiss();
    //             toast.success("Post added");
    //           });
    //         });
    //       }
    //     );



    //     /*formData.append("picture", image);
    //     formData.append("picturePath", image.name);*/
    //   }
  
    //   /*const response = await fetch(`http://localhost:5000/posts`, {
    //     method: "POST",
    //     headers: { Authorization: `Bearer ${token}` },
    //     body: formData,
    //   });
    //   const posts = await response.json();
    //   dispatch(setPosts({ posts }));
    //   setImage(null);
    //   setPost("");*/
    //   else {
    //     const response = await fetch(`${BASE_URL}/posts`, {
    //       method: "POST",
    //       headers: { Authorization: `Bearer ${token}` },
    //       body: formData,
    //     });
    //     const posts = await response.json();
    //     dispatch(setPosts({ posts }));
    //     setImage(null);
    //     setPost("");
    //     toast.dismiss();
    //     toast.success("Post added");
    //   }
    // };
    const removeImage = (index) => {
      setImages(images.filter((_, i) => i !== index));
    };
    const handlePost = async () => {
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("description", post);
      formData.append("category", selectedCategory);
      let imageUrls=[];
      //if(image){
      if (images.length>0) {
        try {
          for(let image of images){
          console.log("Uploading image to Cloudinary...",image.name);
          const imageFormData = new FormData();
          //imageFormData.append("file", image);
          imageFormData.append("file", image, image.name);
          imageFormData.append("upload_preset", "OneWorld");
          imageFormData.append("cloud_name", "ddenfqz4u");
  
          const res = await fetch("https://api.cloudinary.com/v1_1/ddenfqz4u/image/upload", {
            method: "POST",
            body: imageFormData,
          });
  
          const uploadedImage = await res.json();
          console.log("Cloudinary response:", uploadedImage);
  
          if (uploadedImage.url) {
            imageUrls.push(uploadedImage.url);
            // formData.append("picture", image);
            // formData.append("picturePath", uploadedImage.url);
            // console.log("image uploaded successfully, post getting created...");
          } else {
            throw new Error("Image upload failed");
          }
        }
        } catch (error) {
          console.error("Cloudinary upload error:", error);
          toast.error("failed to upload image.");
          return;
        }
      }
      console.log("yahan pe i will be loggind the urls ",imageUrls);
      formData.append("picturePaths", JSON.stringify(imageUrls));
      console.log("logging the form data now");
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      console.log("Submitting post request...");
      const response = await fetch(`${BASE_URL}/posts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
  
      const posts = await response.json();
      dispatch(setPosts({ posts }));
      //setImage(null);
      setImages([]);
      setPost("");
      toast.dismiss();
      toast.success("Post added");
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

        <Box
          sx={{ display: "flex", justifyContent: "right", marginLeft: "20px" }}
        >
          <Button
            onClick={(event) => setAnchorEl(event.currentTarget)}
            sx={{
              backgroundColor: palette.neutral.light,
              color: mediumMain,
              // fontWeight: "bold",
              fontSize: "0.7rem",
              padding: "5px 10px",
              textTransform: "uppercase",
              marginRight: "16px",
              marginTop: "15px",
              borderRadius: "2rem",
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
        </Box>

        {isImage && (
          <Box
            border={`1px solid ${medium}`}
            borderRadius="5px"
            mt="1rem"
            p="1rem"
          >
            <Dropzone
              acceptedFiles=".jpg,.jpeg,.png"
              //multiple={false}
              multiple={true}
              onDrop={(acceptedFiles) => setImages([...images, ...acceptedFiles])}
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
                    {!images ? (
                      <p>Add Image Here</p>
                    ) :  (
                      images.map((img,index)=>(
                      <FlexBetween key={index}>
                        <Typography>{img.name}</Typography>
                        <Box sx={{ display: "flex", gap: "8px" }}>  </Box>
                        <DeleteOutlined
          sx={{ cursor: "pointer", color: "red" }}
          onClick={() => removeImage(index)}
        />
                      </FlexBetween>
                      ))
                    )}
                  </Box>
                  {images && (
                    <IconButton
                      onClick={() => setImages([])}
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

        <FlexBetween>
          <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
            <ImageOutlined sx={{ color: mediumMain }} />
            <Typography
              color={mediumMain}
              sx={{ "&:hover": { cursor: "pointer", color: medium } }}
            >
              Upload an Image
            </Typography>
          </FlexBetween>

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
              backgroundColor: "silver",
              color: "black",
              fontWeight: "bold",
              fontSize: "0.7rem",
              padding: "5px 10px",
              textTransform: "uppercase",
              marginRight: "16px",
              borderRadius: "0.75rem",
              ":hover": {
                backgroundColor: "#c147e9",
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

  // previous return code
//   return (
//     <WidgetWrapper>
//     <FlexBetween gap="1.5rem">
//       <UserImage image={picturePath} />
//       <InputBase
//         placeholder="What's on your mind..."
//         onChange={(e) => setPost(e.target.value)}
//         value={post}
//         sx={{
//           width: "100%",
//           backgroundColor: palette.neutral.light,
//           borderRadius: "2rem",
//           padding: "1rem 2rem",
//         }}
//       />
//     </FlexBetween>

//     <Box
//       sx={{ display: "flex", justifyContent: "right", marginLeft: "20px" }}
//     >
//       <Button
//         onClick={(event) => setAnchorEl(event.currentTarget)}
//         sx={{
//           backgroundColor: palette.neutral.light,
//           color: mediumMain,
//           // fontWeight: "bold",
//           fontSize: "0.7rem",
//           padding: "5px 10px",
//           textTransform: "uppercase",
//           marginRight: "16px",
//           marginTop: "15px",
//           borderRadius: "2rem",
//           ":hover": {
//             backgroundColor: "#c147e9",
//           },
//         }}
//       >
//         {selectedCategory ? selectedCategory : "All Categories"}
//         <ExpandMoreIcon sx={{ marginLeft: "4px" }} />
//       </Button>

//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={() => setAnchorEl(null)}
//       >
//         <MenuItem onClick={() => handleCategorySelect("Individual")}>
//           Individual
//         </MenuItem>
//         <MenuItem onClick={() => handleCategorySelect("Political")}>
//           Political
//         </MenuItem>
//         <MenuItem onClick={() => handleCategorySelect("Entertainment")}>
//           Entertainment
//         </MenuItem>
//         <MenuItem onClick={() => handleCategorySelect("Sports")}>
//           Sports
//         </MenuItem>
//         <MenuItem onClick={() => handleCategorySelect("Education")}>
//           Education
//         </MenuItem>
//         <MenuItem onClick={() => handleCategorySelect("Tourism")}>
//           Tourism
//         </MenuItem>
//         <MenuItem onClick={() => handleCategorySelect("Health")}>
//           Health
//         </MenuItem>
//       </Menu>
//     </Box>

//     {isImage && (
//       <Box
//         border={`1px solid ${medium}`}
//         borderRadius="5px"
//         mt="1rem"
//         p="1rem"
//       >
//         <Dropzone
//           acceptedFiles=".jpg,.jpeg,.png"
//           multiple={false}
//           onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
//         >
//           {({ getRootProps, getInputProps }) => (
//             <FlexBetween>
//               <Box
//                 {...getRootProps()}
//                 border={`2px dashed ${palette.primary.main}`}
//                 p="1rem"
//                 width="100%"
//                 sx={{ "&:hover": { cursor: "pointer" } }}
//               >
//                 <input {...getInputProps()} />
//                 {!image ? (
//                   <p>Add Image Here</p>
//                 ) : (
//                   <FlexBetween>
//                     <Typography>{image.name}</Typography>
//                     <EditOutlined />
//                   </FlexBetween>
//                 )}
//               </Box>
//               {image && (
//                 <IconButton
//                   onClick={() => setImage(null)}
//                   sx={{ width: "15%" }}
//                 >
//                   <DeleteOutlined />
//                 </IconButton>
//               )}
//             </FlexBetween>
//           )}
//         </Dropzone>
//       </Box>
//     )}

//     <Divider sx={{ margin: "1.25rem 0" }} />

//     <FlexBetween>
//       <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
//         <ImageOutlined sx={{ color: mediumMain }} />
//         <Typography
//           color={mediumMain}
//           sx={{ "&:hover": { cursor: "pointer", color: medium } }}
//         >
//           Upload an Image
//         </Typography>
//       </FlexBetween>

//       <Button
//         disabled={!post}
//         onClick={handlePost}
//         //   sx={{
//         //     // color: palette.background.alt,
//         //     color: "black",
//         //     backgroundColor: palette.primary.main,
//         //     borderRadius: "3rem",
//         //   }}
//         sx={{
//           backgroundColor: "silver",
//           color: "black",
//           fontWeight: "bold",
//           fontSize: "0.7rem",
//           padding: "5px 10px",
//           textTransform: "uppercase",
//           marginRight: "16px",
//           borderRadius: "0.75rem",
//           ":hover": {
//             backgroundColor: "#c147e9",
//           },
//         }}
//       >
//         POST
//       </Button>
//     </FlexBetween>
//   </WidgetWrapper>
// );
// };

// export default MyPostWidget;