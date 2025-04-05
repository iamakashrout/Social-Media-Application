import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "components/homepage";
import ProfilePage from "components/ProfilePage";
import SearchPage from "components/SearchPage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import Auth from "components/Auth/auth";
import Messenger from "components/Messenger/Messenger";
import ForgotPassword from "components/Auth/ForgotPassword.jsx";  
import VerifyOtp from "components/Auth/VerifyOtp.jsx";  
import ResetPassword from "components/Auth/ResetPassword.jsx"; 
import VerifyOtpRegister from "components/Auth/VerifyOtpRegister";
import EditProfile from "components/EditProfile";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import StoriesPage from "components/Stories/Stories";
import CreateStory from "components/Stories/CreateStory";

//DEPLOYMENT READY YAYY !


function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  //persistent login
  const dispatch = useDispatch();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      dispatch(setLogin({ user: JSON.parse(storedUser), token: storedToken }));
    }
  }, [dispatch]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
          <Route path="/" element={isAuth ? <Navigate to="/home" /> : <Auth />} />
          {/* <Route path="/" element={<Auth />} /> */}
          <Route path="/verifyRegister-otp/:email" element={<VerifyOtpRegister />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp/:email" element={<VerifyOtp />} />  
          <Route path="/reset-password/:email" element={<ResetPassword />} />
            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            /> 
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />
            <Route
              path="/search/:userName"
              element={isAuth ? <SearchPage /> : <Navigate to="/" />}
            />
            <Route
              path="/messenger"
              element={isAuth ? <Messenger /> : <Navigate to="/" />}
            />
            <Route
              path="/edit-profile/:userId"
              element={isAuth ? <EditProfile /> : <Navigate to="/" />}
            />
            <Route
              path="/stories/view"
              element={isAuth ? <StoriesPage /> : <Navigate to="/" />}
            />
            <Route
              path="/stories/create"
              element={isAuth ? <CreateStory /> : <Navigate to="/" />}
            />

          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

/*function App() {
  const [currentForm, setCurrentForm] = useState("login");
  const [registeredName, setRegisteredName] = useState('');
  const [registeredImage, setRegisteredImage] = useState('');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };

  const handleRegisterSuccess = (name, image) => {
    setRegisteredName(name);
    setRegisteredImage(image);
    setCurrentForm("homepage");
  };

  const renderForm = () => {
    if (currentForm === "login") {
      return <Login onFormSwitch={toggleForm} />;
    } else if (currentForm === "register") {
      return <Register onFormSwitch={toggleForm} onRegisterSuccess={handleRegisterSuccess} />;
    } else if (currentForm === "homepage") {
      return <Homepage name={registeredName} image={registeredImage} />;
    }
  };

  return (
    <div className="App">
      {renderForm()}
    </div>
  );
}*/
