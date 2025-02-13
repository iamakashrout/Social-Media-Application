import React,{ useState } from "react";
import {Box,TextField,Button,Typography } from "@mui/material"
import { useSelector } from "react-redux";
const EditProfilePage= () =>{
    const user=useSelector((state)=>state.user)

    const[firstName,setFirstname]=useState(user?.firstName || "" );
    const[email,setEmail]=useState(user?.email || "");
    const[occupation,setOccupation]=useState(user?.occupation || "");
    const[location,setLocation]=useState(user?.location || "");
    const[lastName,setLastname]=useState(user?.lastName || "");
    const[picture,setProfilePicture]=useState(user?.picture || "");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Profile updated:", { firstName,email,occupation,location,lastName,picture});
    };

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" mb={2}>
        Edit Profile
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstname(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastname(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Occupation"
          value={occupation}
          onChange={(e) => setOccupation(e.target.value)}
          fullWidth
          margin="normal"
        />
         <TextField
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          fullWidth
          margin="normal"
        />
         <TextField
          label="Profile Picture"
          value={picture}
          onChange={(e) => setProfilePicture(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
          Save Changes
        </Button>
      </form>
    </Box>
  );
};
export default EditProfilePage;