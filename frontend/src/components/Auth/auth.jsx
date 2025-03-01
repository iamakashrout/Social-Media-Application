import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import app from "../../firebase.js";
import { BASE_URL } from "helper.js";

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
  picture: yup.mixed(),
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

  const register = async (values, onSubmitProps) => {
    const formData = new FormData();
    for (let key in values) {
      formData.append(key, values[key]);
    }

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
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          formData.append("picturePath", downloadURL);
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
        });
      }
    );
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
      <h1 className="brand-title">
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
                      onDrop={(acceptedFiles) => setFieldValue("picture", acceptedFiles[0])}
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

              <button type="submit" className="submit-btn">{isLogin ? "LOGIN" : "REGISTER"}</button>

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
