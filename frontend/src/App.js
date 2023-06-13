import React, { useState } from "react";
import "./App.css";
import { Login } from "./components/login";
import { Register } from "./components/register";
import Homepage from "./components/homepage";


function App() {
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
}

export default App;
