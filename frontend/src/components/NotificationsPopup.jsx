import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../helper.js";

const NotificationsPopup = ({ notifications, onClose }) => {
  const navigate = useNavigate(); // Initialize navigate
  const token = useSelector((state) => state.token);
   const user = useSelector((state) => state.user);
  const _id = user._id; 
  const userEmail = user.email;

  const [notifs, setNotifs] = useState(notifications);

  const handleRead = async (notifId) => {
    try {
      const notification = notifs.find((notif) => notif._id === notifId);
      if (!notification) return;
  
      // Delete notification API call
      const response = await fetch(`${BASE_URL}/notif/delete/${userEmail}/${notifId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }
  
      // Update state to remove the deleted notification
      setNotifs((prev) => prev.filter((notif) => notif._id !== notifId));
  
    } catch (error) {
      console.error("Error handling notification:", error);
    }
  };

  console.log("notifs: ", notifications);
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50px",
        right: "0",
        backgroundColor: "#FFF4F2",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(114, 46, 186, 0.1) large",
        width: "300px",
        zIndex: 100,
        padding: "10px",
        textAlign: "center"
      }}
    >
      <>
      <Typography fontWeight="bold" fontSize="16px" mb={2}>
        Notifications
      </Typography>



{notifs?.length === 0 ? (
        <Typography>No new notifications</Typography>
      ) : (
        notifs?.map((notif) => (
          <Box key={notif._id} mb={2}>
            <Typography
              width="full"
              size="small"
              sx={{ color: "black", display: "block", textTransform: "none", textAlign: "left", fontSize: "0.8rem", fontWeight: "bold", "&:hover": { backgroundColor: "#FFB6C1" } }}
            >
              {notif.title}
            </Typography>

            <Button
              size="small"
              onClick={() => handleRead(notif._id)}
              sx={{ color: "#7439db", display: "block", textTransform: "none", textAlign: "left", fontSize: "0.7rem", "&:hover": { backgroundColor: "#FFD1DC" } }}
            >
              Mark as read
            </Button>
          </Box>
        ))
      )}




      </>
    </Box>
  );
};

export default NotificationsPopup;
