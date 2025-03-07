import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { BASE_URL } from "helper.js";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { email } = useParams(); 
  const navigate = useNavigate();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const resetPassword = async () => {
    if (!newPassword) {
      toast.error("Please enter a new password.");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/auth/reset-password/${email}`, { newPassword });

      if (response.status === 200) {
        toast.success("Password reset successfully!");
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
<div className="reset-password-container">
      <div className="reset-password-card">
        <h2>Reset Password</h2>

        {/* Input Field */}
        <div className="input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            className="reset-password-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        {/* Show Password Button Below Input */}
        <button type="button" className="show-password-btn" onClick={toggleShowPassword}>
          {showPassword ? "Hide Password" : "Show Password"}
        </button>

        {/* Reset Password Button */}
        <button className="reset-password-btn" onClick={resetPassword}>
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
