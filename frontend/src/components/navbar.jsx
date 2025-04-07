import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Button,
  Paper, List, ListItem,
  ListItemText

} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
  History
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "tools/FlexBetween";
import Voice_Search from "./voice search in search bar.jsx";
import { Mic, MicOff } from "lucide-react";

import React, { useEffect, useRef } from "react";
import { Bell } from "lucide-react"; // Bell icon for notifications
import { BASE_URL } from "../helper.js";
import NotificationsPopup from "./NotificationsPopup";
//import Notifs from "./Notifications";
import logo from './OneWorld.png'; 
const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const _id = user._id; 
  const userEmail = user.email;
  const [searchedUser, setSearchedUser] = useState("");
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [searchHistory, setSearchHistory] = useState([]);

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const fullName = `${user.firstName} ${user.lastName}`;

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationsRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSearchHistory(false); // Close dropdown
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${BASE_URL}/notif/view/${userEmail}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
          });
          const data = await response.json();
          console.log("data to navbar : ", data);
          setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchSearches = async (name) => {
    try {
      const response = await fetch(`${BASE_URL}/users/search/get/${name}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.log("Search history:", data);
      setSearchHistory(data); 
    } catch (error) {
      console.error("Error fetching searches:", error);
    }
  };

  const storeSearch = async (name) => {
    console.log("storeSearch called with:", name);

    try {
      const response = await fetch(`${BASE_URL}/users/search/store`, {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"  
            },
            body: JSON.stringify({ name })  
      });
    } catch (error) {
      console.error("Error storing search:", error);
    }
};


  useEffect(() => {
    fetchNotifications();
  }, []);

    // Function to handle voice search result
  const handleVoiceSearch = (query) => {
    if (!query.trim()) return;  // Avoid empty search
    console.log("Searching for:", query); 
    setSearchedUser(query);
    
    // Wait for state update before navigating
    setTimeout(() => {
        navigate(`/search/${query}`);
        navigate(0);
    }, 100);
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
  
    if (showNotifications) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
  
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showNotifications]);

  const handleNotificationClick = async (notifId) => {
    try {
      const notification = notifications.find((notif) => notif._id === notifId);
      if (!notification) return;

      // Delete notification
      await fetch(`${BASE_URL}/notif/delete/${_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ notifId }),
});
  
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== notifId)
      );

    
  } catch (error) {
    console.error("Error handling notification:", error);
  }
};

    const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
};

  return (
    <FlexBetween padding="1rem 6%" backgroundColor="black">
      <FlexBetween gap="1.75rem">
      <img 
  src={logo} 
  alt="Logo" 
  className="w-16 h-16" 
  style={{ width: "70px" }} 
/>
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="#cb6ce6"
          onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              cursor: "pointer",
            },
          }}
        >
          OneWorld
        </Typography>
        {isNonMobileScreens && (
          <FlexBetween
          backgroundColor={neutralLight}
          borderRadius="9px"
          gap="0.1rem"
          padding="0.1rem 1.0rem"
          style={{ position: "relative", width: "300px" }}
        >
          {/* Search Bar */}
          <InputBase
            placeholder="Search..."
            onChange={(e) => {
              setSearchedUser(e.target.value);
              fetchSearches(e.target.value); // ✅ Fetch history on input change
            }}
            value={searchedUser}
            onKeyDown={async (e) => {
              console.log("Key pressed:", e.key);
              if (e.key === "Enter" && searchedUser.trim() !== "") {
                console.log("Enter pressed. Storing search...");
                await storeSearch(searchedUser);
                navigate(`/search/${searchedUser}`);
              }
            }}
            fullWidth
          />
          <IconButton
                onClick={async () => {
                  if (searchedUser.trim() !== "") {
                    console.log("Search icon clicked. Storing search...");
                    await storeSearch(searchedUser);
                    navigate(`/search/${searchedUser}`);
                  }
                }}
              >
            <Search />
          </IconButton>
            <Voice_Search onSearch={handleVoiceSearch} />
        
          {/* Search History Dropdown */}
          {searchHistory && searchHistory.length > 0 && (
            <Paper
            ref={dropdownRef}
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "100%",
              zIndex: 10,
              backgroundColor: "white",
              borderRadius: "8px", // Rounded corners
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Soft shadow
              overflow: "hidden", // Clean look
            }}
            elevation={3}
          >
            <List sx={{ padding: 0 }}>
              {searchHistory.map((search, index) => (
                <ListItem
                  key={index}
                  button
                  onClick={() => {
                    setSearchedUser(search);
                    setSearchHistory(false);
                    navigate(`/search/${search}`);
                  }}
                  sx={{
                    padding: "10px 16px", // Better spacing
                    "&:hover": { backgroundColor: "#f0f0f0" }, // Hover effect
                  }}
                >
                  <History sx={{ marginRight: "8px", color: "gray" }} />
                  <ListItemText primary={search} sx={{ color: "black" }} />
                </ListItem>
              ))}
            </List>
          </Paper>
          )}
        </FlexBetween>
        
        )}
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton
            onClick={() => dispatch(setMode())}
            sx={{ color: "#ffffff" }}
          >
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: "#ffffff", fontSize: "25px" }} />
            )}
          </IconButton>
          <IconButton
            onClick={() => {
              navigate("/messenger");
              navigate(0);
            }}
          >
            <Message sx={{ fontSize: "25px", color: "white" }} />
            <Button
              sx={{
                padding: 0,
                margin: 0,
                fontSize: "16px",
                textTransform: "none",
                color: "darkGray",
                fontWeight: "bold",
                ":hover": {
                  color: "#F582A7",
                },
              }}
            >
              MESSENGER
            </Button>
          </IconButton>




           {/* Notifications Icon */}
           <div className="relative" ref={notificationsRef}>
            <IconButton
              onClick={toggleNotifications}
              sx={{ color: "#ffffff" }}
              aria-label="View notifications"
            >
              <Notifications sx={{ fontSize: "25px", color: "white" }} /> 
              {/* notification bell icon from material ui */}
              {notifications.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -5,
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "50%",
                    padding: "4px 8px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {notifications.length}
                </span>
              )}
            </IconButton>
            {showNotifications && (
              <NotificationsPopup
                notifications={notifications}
                //onNotificationClick ={handleNotificationClick}
                onClose={() => setShowNotifications(false)}
              />
            )}
          </div>

          {/* <Notifications sx={{ fontSize: "25px" }} /> */}






          {/* <Help sx={{ fontSize: "25px" }} /> */}
          <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <IconButton
              onClick={() => {
                navigate("/messenger");
                navigate(0);
              }}
            >
              <Message sx={{ fontSize: "25px", color: "white" }} />
              <Button
                sx={{
                  padding: 0,
                  margin: 0,
                  fontSize: "16px",
                  textTransform: "none",
                  color: "darkGray",
                  fontWeight: "bold",
                  ":hover": {
                    color: "#F582A7",
                  },
                }}
              >
                MESSENGER
              </Button>
            </IconButton>

              {/* Notifications Icon */}
              <div className="relative" ref={notificationsRef}>
              <IconButton
                onClick={toggleNotifications}
                sx={{ color: "#ffffff" }}
                aria-label="View notifications"
              >
                <Notifications sx={{ fontSize: "25px", color: "white" }} />
                {notifications.length > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -5,
                      right: -5,
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "50%",
                      padding: "4px 8px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {notifications.length}
                  </span>
                )}
              </IconButton>
              {showNotifications && (
                <NotificationsPopup
                  notifications={notifications}
                //  onNotificationClick ={onClick}
                  onClose={() => setShowNotifications(false)}
                />
              )}
            </div>
  
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => {
                   dispatch(setLogout()); // Updates Redux state
                   navigate("/login"); // Redirects to login page
                  // toast.success("Logged out successfully!");
                }}
                >
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;