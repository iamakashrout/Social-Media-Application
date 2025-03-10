import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, TextField, Box, Typography, Card, CardContent, Grid, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { BASE_URL } from "helper.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "../firebase";
import { toast } from "react-hot-toast";
import { ArrowBack } from "@mui/icons-material";

const EditProfile = () => {
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedFileName, setSelectedFileName] = useState("No file chosen");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [location, setLocation] = useState("");
  const [occupation, setOccupation] = useState("");
  const [profilePic, setProfilePic] = useState(user.picturePath);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProfilePic(URL.createObjectURL(file)); // Show preview immediately
      setSelectedFileName(file.name); // Show file name
  
      // Upload image to Firebase
      const storage = getStorage(app);
      const storageRef = ref(storage, `profile_pictures/${user._id}`);
      await uploadBytes(storageRef, file);
      const profilePicUrl = await getDownloadURL(storageRef);
  
      setProfilePic(profilePicUrl); // Update UI with uploaded image URL
      toast.success("Profile picture uploaded successfully!");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSaveChanges = async () => {
    let profilePicUrl = profilePic;

    if (selectedFile) {
      const storage = getStorage(app);
      const storageRef = ref(storage, `profile_pictures/${user._id}`);
      await uploadBytes(storageRef, selectedFile);
      profilePicUrl = await getDownloadURL(storageRef);
      setProfilePic(profilePicUrl); // Ensure UI updates immediately
    }

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("password", password);
    formData.append("location", location);
    formData.append("occupation", occupation);
    formData.append("picturePath", profilePicUrl);

    if (selectedFile) {
      formData.append("profilePic", selectedFile);
    }

    const response = await fetch(`${BASE_URL}/users/users-profile/${user._id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.status === 200) {
      const updatedUser = await response.json();
      dispatch({ type: "UPDATE_USER", payload: updatedUser });
      navigate(`/profile/${user._id}`);
    } else {
      console.error("Failed to update profile");
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
          <Box display="flex" flexDirection="column" alignItems="center">
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "block", margin: "10px auto" }} />
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
          borderColor: "#8e24aa" // Ensure the border color is set so the button is visible
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