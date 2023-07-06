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


//DEPLOYMENT READY YAYY !


function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<Auth />} />
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
