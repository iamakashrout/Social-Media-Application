import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import app from "../../firebase.js";
import { BASE_URL } from "helper.js";
import logo from '../OneWorld.png'; 
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { toast } from "react-hot-toast";

import "./auth.css";


const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.mixed().notRequired(),  //pic optional
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};


const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sendOtpRe = async (userData) => {
    try {
      toast.loading("Verifying...");
      const response = await fetch(`${BASE_URL}/auth/sendOtp-register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      toast.dismiss();
      if (!response.ok) throw new Error("Failed to send OTP");
      toast.success("OTP sent successfully!");
      navigate(`/verifyRegister-otp/${userData.email}`);
    } catch (error) {
      toast.error(error.message);
    }
  };
  
/*
  const register = async (values, onSubmitProps) => {
    const formData = new FormData();
    // for (let key in values) {
    //   formData.append(key, values[key]);
    // }

    for (let key in values) {
      if (values[key]) formData.append(key, values[key]); // Append only non-empty fields
    }

    const userData = {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      password: values.password,
      location: values.location,
      occupation: values.occupation,
      picturePath: `${BASE_URL}/uploads/default_profile_image.png`, // Will be updated later
    };

    const storage = getStorage(app);
    const fileName = new Date().getTime() + values.picture?.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, values.picture);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error("Upload error:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          formData.append("picturePath", downloadURL);
          userData.picturePath = downloadURL;
          const otpSent = await sendOtpRe(userData);
          if (!otpSent) return; 

          toast.loading("Registering...");

          fetch(`${BASE_URL}/auth/register`, {
            method: "POST",
            body: formData,
          }).then(async (response) => {
            const data = await response.json();
            toast.dismiss();

            if (response.status !== 201) {
              toast.error("Email already in use");
              return;
            }

            // await sendOtpRe(values.email);
            onSubmitProps.resetForm();
            setIsLogin(true);
            toast.success("Registered successfully!");
          });
        });
      }
    );
  }; */


  //structured register code
  // const register = async (values, onSubmitProps) => {
  //   const formData = new FormData();
  //   for (let key in values) {
  //     if (values[key]) formData.append(key, values[key]); // Append only non-empty fields
  //   }
  
  //   const userData = {
  //     email: values.email,
  //     firstName: values.firstName,
  //     lastName: values.lastName,
  //     password: values.password,
  //     location: values.location,
  //     occupation: values.occupation,
  //     picturePath: `${BASE_URL}/uploads/default_profile_image.png`, // Default pic if no picture
  //   };
  
  //   // Only upload if a picture is selected
  //   if (values.picture) {
  //     const storage = getStorage(app);
  //     const fileName = new Date().getTime() + values.picture.name;
  //     const storageRef = ref(storage, fileName);
  //     const uploadTask = uploadBytesResumable(storageRef, values.picture);
  
  //     uploadTask.on(
  //       "state_changed",
  //       (snapshot) => {
  //         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         console.log(`Upload is ${progress}% done`);
  //       },
  //       (error) => {
  //         console.error("Upload error:", error);
  //       },
  //       async () => { //Changed to async function to wait for upload
  //         const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  //         formData.append("picturePath", downloadURL);
  //         userData.picturePath = downloadURL;
  //         await handleRegistration(userData, formData, onSubmitProps); 
  //       }
  //     );
  //   } else {
  //     //If no picture is selected, proceed with registration immediately
  //     await handleRegistration(userData, formData, onSubmitProps);
  //   }
  // };
  
  const register = async (values, onSubmitProps) => {
    console.log("Starting registration process...");
    const formData = new FormData();
    for (let key in values) {
      if (values[key]) formData.append(key, values[key]); 
    }
  
    console.log("Form data prepared:", values);
  
    const userData = {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      password: values.password,
      location: values.location,
      occupation: values.occupation,
      picturePath: `${BASE_URL}/uploads/default_profile_image.png`, 
    };
  
    console.log("User data before image upload:", userData);
    if (values.picture) {
      try {
        console.log("Uploading image to Cloudinary...");
        const imageFormData = new FormData();
        imageFormData.append("file", values.picture);
        imageFormData.append("upload_preset", "OneWorld");
        imageFormData.append("cloud_name", "ddenfqz4u");
  
        const res = await fetch("https://api.cloudinary.com/v1_1/ddenfqz4u/image/upload", {
          method: "POST",
          body: imageFormData,
        });
  
        const uploadedImage = await res.json();
        console.log("Cloudinary response:", uploadedImage);
  
        if (uploadedImage.url) {
          formData.append("picturePath", uploadedImage.url);
          userData.picturePath = uploadedImage.url;
          console.log("Image uploaded successfully, updated userData:", userData);
        }
      } catch (error) {
        console.error("Cloudinary upload error:", error);
      }
    }
  
    console.log("Final user data before registration:", userData);
    console.log("Submitting registration request...");
    await handleRegistration(userData, formData, onSubmitProps);
    console.log("Registration process completed.");
  };
  
  //Moved the registration logic to a separate function
  const handleRegistration = async (userData, formData, onSubmitProps) => {
    const otpSent = await sendOtpRe(userData);
    if (!otpSent) return;
  
    toast.loading("Registering...");
    fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      body: formData,
    }).then(async (response) => {
      const data = await response.json();
      toast.dismiss();
  
      if (response.status !== 201) {
        toast.error("Email already in use");
        return;
      }
  
      onSubmitProps.resetForm();
      setIsLogin(true);
      toast.success("Registered successfully!");
    });
  };

  
  const login = async (values, onSubmitProps) => {
    toast.loading("Logging in...");

    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    toast.dismiss();

    if (response.status !== 200) {
      toast.error("Invalid credentials");
      return;
    }

    const data = await response.json();
    onSubmitProps.resetForm();

    // Store user and token in localStorage
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);

    dispatch(setLogin({ user: data.user, token: data.token }));
    navigate("/home");
    toast.success("Logged in successfully!");
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) {
      await login(values, onSubmitProps);
    } else {
      await register(values, onSubmitProps);
    }
  };

  return (
    
    
    <div className="container">
      <img 
  src={logo} 
  alt="Logo" 
  className="w-16 h-16" 
  style={{ width: "70px" , height: "70px", marginBottom: "-250px",marginTop: "20px"  }} // Adjust size as needed
/>
      <h1 className="brand-title">
      
<br></br>
        <span className="one">One</span>
        <span className="world">World.</span>
      </h1>
      <p className="tagline">Explore. Engage. Empower.</p>
      <h2 className="auth-heading">{isLogin ? "Login" : "Signup"}</h2>
<div className="toggle-switch">
  <div
    className={`toggle-track ${isLogin ? "login-mode" : "signup-mode"}`}
    onClick={() => setIsLogin(!isLogin)}
  >
    <div className="toggle-knob"></div>
  </div>
</div>



      <div className="form-container">
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
          validationSchema={isLogin ? loginSchema : registerSchema}
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm }) => (
            <form onSubmit={handleSubmit} className="auth-form-container">
              {!isLogin && (
                <>
                  <label htmlFor="firstName" style={{ fontSize: "1.5rem"}}>First Name</label>
                  <input name="firstName" placeholder="First Name" onBlur={handleBlur} onChange={handleChange} value={values.firstName} />
                  <label htmlFor="lastName" style={{ fontSize: "1.5rem" }}>Last Name</label>
                  <input name="lastName" placeholder="Last Name" onBlur={handleBlur} onChange={handleChange} value={values.lastName} />
                  <label htmlFor="location" style={{ fontSize: "1.5rem" }}>Location</label>
                  <input name="location" placeholder="City Name" onBlur={handleBlur} onChange={handleChange} value={values.location} />
                  <label htmlFor="occupation" style={{ fontSize: "1.5rem" }}>Occupation</label>
                  <input name="occupation" placeholder="Your Occupation" onBlur={handleBlur} onChange={handleChange} value={values.occupation} />
                  
                  <div>
                    <Dropzone
                      acceptedFiles=".jpg,.jpeg,.png"
                      multiple={false}
                      onDrop={(acceptedFiles) => {
                        console.log("Selected file:", acceptedFiles[0]); // ✅ Debugging log
                        setFieldValue("picture", acceptedFiles[0]);
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps()} className="dropzone">
                          <input {...getInputProps()} />
                          <p>{values.picture ? values.picture.name : "Add a profile picture"}</p>
                        </div>
                      )}
                    </Dropzone>
                  </div>
                </>
              )}

              <label htmlFor="email" style={{ fontSize: "1.5rem", marginBottom: "4px", display: "block" }}>
  Email
</label>
              <input name="email" placeholder="youremail@gmail.com" onBlur={handleBlur} onChange={handleChange} value={values.email} />

              <label htmlFor="password" style={{ fontSize: "1.5rem" }}>Password</label>
              <input type="password" name="password" placeholder="********" onBlur={handleBlur} onChange={handleChange} value={values.password} />

              <button type="submit" className="auth-button">{isLogin ? "LOGIN" : "REGISTER"}</button>

              {isLogin && (
             <div style={{ textAlign: "center", marginTop: "10px" }}> {/* Added marginTop for spacing */}
             <button
               type="button"
               className="link-btn normal-case"
               onClick={() => navigate("/forgot-password")}
             >
               Forgot Password?
             </button>
           </div>
         )}
              <button className="link-btn normal-case" onClick={() => { setIsLogin(!isLogin); resetForm(); }}>
  {isLogin ? "Don't have an account? Register here!" : "Already have an account? Login here!"}
</button>

            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Auth;