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
  Button
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
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "tools/FlexBetween";

import React, { useEffect, useRef } from "react";
import { Bell } from "lucide-react"; // Bell icon for notifications
import { BASE_URL } from "../helper.js";
import NotificationsPopup from "./NotificationsPopup";
//import Notifs from "./Notifications";

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

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${BASE_URL}/notif/view/${userEmail}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          console.log("data to navbar : ", data);
          setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

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
        Authorization: `Bearer ${token}`,
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
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="#F582A7"
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
            gap="3rem"
            padding="0.1rem 1.5rem"
          >
            <InputBase
             placeholder="Search..."
            onChange={(e) => setSearchedUser(e.target.value)}
            value={searchedUser}
            onKeyDown={(e) => {
            if (e.key === "Enter") {
            navigate(`/search/${searchedUser}`);
            navigate(0);
           }
           }} //search when Enter is pressed
          />

            <IconButton
              onClick={() => {
                navigate(`/search/${searchedUser}`);
                navigate(0);
              }}
            >
              <Search />
            </IconButton>
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
              navigate(`/messenger`);
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
                navigate(`/messenger`);
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
                <MenuItem onClick={() => dispatch(setLogout())}>
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
