import React,{ useState } from "react";
import {Box,TextField,Button,Typography } from "@mui/material"
import { useSelector } from "react-redux";
import { BASE_URL } from "helper";
const EditProfilePage= () =>{
    const user=useSelector((state)=>state.user)
    const token = useSelector((state) => state.token);
    const[firstName,setFirstname]=useState(user?.firstName || "" );
    const[email,setEmail]=useState(user?.email || "");
    const[occupation,setOccupation]=useState(user?.occupation || "");
    const[location,setLocation]=useState(user?.location || "");
    const[lastName,setLastname]=useState(user?.lastName || "");
    const[picture,setProfilePicture]=useState(user?.picture || "");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const updatedProfile = { firstName, email, occupation, location, lastName, picture };
      
        try {
          console.log(user);
          const response = await fetch(`${BASE_URL}/users/editUsertProfile/${user._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedProfile),
          });
      
          if (!response.ok) {
            throw new Error("Failed to update profile");
          }
      
          const data = await response.json();
          console.log("Profile updated:", data);
          
        } catch (error) {
          console.error("Error updating profile:", error);
        }
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