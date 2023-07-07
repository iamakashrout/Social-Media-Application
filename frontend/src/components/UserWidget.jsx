import {
    ManageAccountsOutlined,
    EditOutlined,
    LocationOnOutlined,
    WorkOutlineOutlined,
  } from "@mui/icons-material";
  import { Box, Typography, Divider, useTheme } from "@mui/material";
  import UserImage from "tools/UserImage";
  import FlexBetween from "tools/FlexBetween";
  import WidgetWrapper from "tools/WidgetWrapper";
  import { useSelector } from "react-redux";
  import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
  import { BASE_URL } from "helper.js";
  
  const UserWidget = ({ userId, picturePath }) => {
    const [user, setUser] = useState(null);
    const { palette } = useTheme();
    const navigate = useNavigate();
    const token = useSelector((state) => state.token);
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;
  
    const getUser = async () => {
      const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);
    };
  
    useEffect(() => {
      getUser();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
    if (!user) {
      return null;
    }
  
    const {
      firstName,
      lastName,
      location,
      occupation,
      viewedProfile,
      impressions,
      friends,
    } = user;
  
    return (
      <WidgetWrapper>
        {/* FIRST ROW */}
        <FlexBetween
          gap="0.5rem"
          pb="1.1rem"
          onClick={() => navigate(`/profile/${userId}`)}
        >
          <FlexBetween gap="1rem">
            <UserImage image={picturePath} />
            <Box>
              <Typography
                variant="h4"
                color={dark}
                fontWeight="bold"
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                    fontWeight: "bold"
                  },
                }}
              >
                {firstName} {lastName}
              </Typography>
              <Typography color={medium}>{friends.length} friends</Typography>
            </Box>
          </FlexBetween>
          <ManageAccountsOutlined />
        </FlexBetween>
  
        <Divider />
  
        {/* SECOND ROW */}
        <Box p="1rem 0">
          <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
            <LocationOnOutlined fontSize="large" sx={{ color: main }} />
            <Typography color={medium}>{location}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap="1rem">
            <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
            <Typography color={medium}>{occupation}</Typography>
          </Box>
        </Box>
      </WidgetWrapper>
    );
  };
  
  export default UserWidget;
  