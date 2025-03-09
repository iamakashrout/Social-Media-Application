import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { BASE_URL } from "helper.js";
import "./VerifyOtpRegister.css";

const VerifyOtpRegister = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [attempts, setAttempts] = useState(0);
  const { email } = useParams();
  const navigate = useNavigate();

  const handleChange = (index, event) => {
    const value = event.target.value;
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== "" && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus(); // Move to next input
      }
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus(); // Move to previous input
    }
    if (event.key === "Enter") {
      verifyOtp(); // Submit OTP when Enter is pressed
    }
  };

  const verifyOtp = async () => {
    const enteredOtp = otp.join("");
    if (!enteredOtp || enteredOtp.length !== 6) {
      toast.error("Please enter the complete OTP.");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/auth/verify-register/${email}`, { otp: enteredOtp });

      if (response.status === 200) {
        toast.success("OTP verified! Redirecting...");
        navigate("/"); // Redirect to home page
      } else {
        handleFailedAttempt(response.data.message || "Invalid OTP. Try again.");
      }
    } catch (error) {
      handleFailedAttempt(error.response?.data?.message || "Error verifying OTP.");
    }
  };

  const handleFailedAttempt = (message) => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (newAttempts >= 3) {
      toast.error("Too many failed attempts. Redirecting to login.");
      navigate("/");
    } else {
      toast.error(message);
    }
  };


  return (
    <div className="verify-otp-container">
      <div className="verify-otp-card">
        <h2>OTP Verification</h2>
        <p>
          A One-Time Password (OTP) has been sent to your email: <br />
          <strong>{email}</strong>
        </p>
        <p>Enter the OTP below to verify your account.</p>
        <div className="otp-input-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="otp-input"
            />
          ))}
        </div>
        <button className="verify-otp-btn" onClick={verifyOtp}>
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyOtpRegister;
