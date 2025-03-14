import { Box, Typography, useMediaQuery, CircularProgress, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "components/navbar";
import Friend from "tools/Friend";
import WidgetWrapper from "tools/WidgetWrapper";
import { BASE_URL } from "helper.js";

const SearchPage = () => {
  const loggedInUser = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);
  const { userName } = useParams();
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const searchUser = async () => {
    setLoading(true);
    setDataFetched(false);

    try {
      const response = await fetch(`${BASE_URL}/users/search/${userName}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
      setDataFetched(true);
    }
  };

  useEffect(() => {
    searchUser();
  }, [userName]);

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="3rem 10%"
        display="flex"
        justifyContent="center"
      >
        <WidgetWrapper
          sx={{
            width: isNonMobileScreens ? "50%" : "90%",
            padding: "2rem",
            borderRadius: "1rem",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            mb={3}
            sx={{ textAlign: "center", color: "#333" }}
          >
            Search Results
          </Typography>

          
          {loading ? (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              height="200px"
            >
              <CircularProgress sx={{ color: "black", width: "60px", height: "60px" }} />
              <Typography mt={2} sx={{ color: "black", fontWeight: "bold", fontSize: "1.2rem" }}>
                Searching...
              </Typography>
            </Box>
          ) : (
            <>
              
              {users.length > 0 ? (
                <Box display="flex" flexDirection="column" gap="1.5rem">
                  {users.map((user) => (
                    <Box
                      key={user._id}
                      sx={{
                        transition: "0.3s ease-in-out",
                        padding: "10px",
                        borderRadius: "12px",
                        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                        "&:hover": {
                          backgroundColor: "#111",
                          color: "white",
                          transform: "scale(1.02)",
                          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
                        },
                      }}
                    >
                      <Friend
                        friendId={user._id}
                        name={`${user.firstName} ${user.lastName}`}
                        subtitle={user.occupation}
                        userPicturePath={user.picturePath}
                        iconColor="white"
                        onClick={() => navigate(`/profile/${user._id}`)}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (

                <Box textAlign="center" mt={5}>
                  <Typography sx={{ fontSize: "1.5rem", fontWeight: "bold", color: "#555" }}>
                    User not found!
                  </Typography>
                  <Button
                    onClick={() => navigate("/home")}
                    sx={{
                      backgroundColor: "silver",
                      color: "black",
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                      padding: "10px 20px",
                      textTransform: "uppercase",
                      marginTop: "2rem",
                      borderRadius: "0.75rem",
                      "&:hover": {
                        backgroundColor: "#c147e9",
                        color: "white",
                      },
                    }}
                  >
                    Back to Home
                  </Button>
                </Box>
              )}
            </>
          )}
        </WidgetWrapper>
      </Box>
    </Box>
  );
};

export default SearchPage;
