import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, TextField, Box, Typography, Card, CardContent, Grid, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { BASE_URL } from "helper.js";
import { getStorage, ref, getDownloadURL , uploadBytesResumable} from "firebase/storage";
import app from "../firebase";
import { toast } from "react-hot-toast";
import { ArrowBack } from "@mui/icons-material";
import axios from "axios";

const EditProfile = () => {
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedFileName, setSelectedFileName] = useState("No file chosen");
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [location, setLocation] = useState(user.location || "");
  const [occupation, setOccupation] = useState(user.occupation || "");
  const [profilePic, setProfilePic] = useState(user.picturePath);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false); // Track upload progress

  // Handle file upload to Firebase Storage
  // const handleFileChange = async (event) => {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   setSelectedFileName(file.name);
  //   setUploading(true);

  //   try {
  //     const storage = getStorage(app);
  //     const fileName = `profile_pictures/${user._id}`;
  //     const storageRef = ref(storage, fileName);
  //     const uploadTask = uploadBytesResumable(storageRef, file);

  //     uploadTask.on(
  //       "state_changed",
  //       (snapshot) => {
  //         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         console.log(`Upload is ${progress}% done`);
  //       },
  //       (error) => {
  //         console.error("Upload error:", error);
  //         toast.error("Failed to upload profile picture.");
  //         setUploading(false);
  //       },
  //       async () => {
  //         const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  //         setProfilePic(downloadURL); // Update UI
  //         dispatch({ type: "UPDATE_USER", payload: { ...user, picturePath: downloadURL } }); // Update Redux store
  //         toast.success("Profile picture uploaded successfully!");
  //         setUploading(false);
  //       }
  //     );
  //   } catch (error) {
  //     console.error("Upload error:", error);
  //     toast.error("Failed to upload profile picture.");
  //     setUploading(false);
  //   }
  // };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFileName(file.name);
    setUploading(true);

    try {
      console.log("Uploading image to Cloudinary...");
      const imageFormData = new FormData();
      imageFormData.append("file", file);
      imageFormData.append("upload_preset", "OneWorld");
      imageFormData.append("cloud_name", "ddenfqz4u");

      const res = await fetch("https://api.cloudinary.com/v1_1/ddenfqz4u/image/upload", {
        method: "POST",
        body: imageFormData,
      });

      const uploadedImage = await res.json();
      console.log("Cloudinary response:", uploadedImage);

      if (uploadedImage.url) {
        setProfilePic(uploadedImage.url); 
        dispatch({ type: "UPDATE_USER", payload: { ...user, picturePath: uploadedImage.url } }); // Update Redux store
        toast.success("Profile picture uploaded successfully!");
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      toast.error("Failed to upload profile picture.");
    } finally {
      setUploading(false);
    }
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/users/users-profile/${user._id}`,
        {
          firstName,
          lastName,
          password,
          location,
          occupation,
          pictureUrl: profilePic, // Send updated profile picture URL
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (password) {
        response.password = password; //Only send password if user entered a new one else dont change
      }

      
      if (response.status === 200) {
        const updatedUser = response.data;
        dispatch({ type: "UPDATE_USER", payload: updatedUser });
        navigate(`/profile/${user._id}`);
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("An error occurred while updating the profile.");
    }
  };

  const handleBackToProfile = () => {
    navigate(`/profile/${user._id}`);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f3e5f5">
      <Card sx={{ width: 500, p: 5, textAlign: "center", borderRadius: 5, boxShadow: 10, bgcolor: "white" }}>
        <CardContent>
          <Avatar src={profilePic} sx={{ width: 120, height: 120, mx: "auto", mb: 2, border: "3px solid black" }} />
          <Typography variant="h4" fontWeight="bold" color="black" gutterBottom>
            Edit Profile
          </Typography>
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" mt={1} gap={2}>
  <Button
    variant="outlined"
    component="label"
    sx={{
      textTransform: "none",
      fontSize: "0.9rem",
      borderRadius: 3,
      py: 1,
      px: 3,
      color: "#8e24aa",
      borderColor: "#8e24aa",
      "&:hover": { backgroundColor: "#f3e5f5" }
    }}
  >
    Choose File
    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      hidden
    />
  </Button>
  <Typography variant="body2" color="textSecondary">{selectedFileName}</Typography>
</Box>

          <Grid container spacing={3} mt={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} variant="outlined" sx={{
                "& label.Mui-focused": { color: "#8e24aa" },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": { borderColor: "#8e24aa" }
                }
              }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} variant="outlined" sx={{
                "& label.Mui-focused": { color: "#8e24aa" },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": { borderColor: "#8e24aa" }
                }
              }} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                sx={{
                  "& label.Mui-focused": { color: "#8e24aa" },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#8e24aa" }
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Location" value={location} onChange={(e) => setLocation(e.target.value)} variant="outlined" 
                sx={{ "& label.Mui-focused": { color: "#8e24aa" },
                      "& .MuiOutlinedInput-root": { "&.Mui-focused fieldset": { borderColor: "#8e24aa" } } }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Occupation" value={occupation} onChange={(e) => setOccupation(e.target.value)} variant="outlined" 
                sx={{ "& label.Mui-focused": { color: "#8e24aa" },
                      "& .MuiOutlinedInput-root": { "&.Mui-focused fieldset": { borderColor: "#8e24aa" } } }} />
            </Grid>
          </Grid>
          <Button variant="contained" fullWidth sx={{ mt: 4, py: 1.5, fontSize: "1rem", borderRadius: 3, boxShadow: 3, background: "linear-gradient(45deg, #9c27b0, #6a1b9a)", color: "white" }} onClick={handleSaveChanges}>
            Save Changes
          </Button>
          <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            <Button 
              variant="outlined" 
              onClick={handleBackToProfile} 
              sx={{ 
                py: 1.5, 
                fontSize: "1rem", 
                borderRadius: 3, 
                boxShadow: 3, 
                color: "#8e24aa", 
                display: "flex", 
                alignItems: "center", 
                borderColor: "#8e24aa"
              }}
            >
              <ArrowBack sx={{ mr: 1, color: "#8e24aa" }} />
              Back to Profile
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditProfile;
