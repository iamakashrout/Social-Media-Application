import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import app from "../../firebase.js";
import { BASE_URL } from "helper.js";

import "./auth.css";
import backgroundImage from "../../images/bgImage.jpg";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { toast } from "react-hot-toast";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string(),
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
  const [pageType, setPageType] = useState("login");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    const fileName = new Date().getTime() + values.picture?.name;
    const storage = getStorage(app);
    const StorageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(StorageRef, values.picture);
    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
      }
    },
      (error) => { },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log(downloadURL);
          formData.append("picturePath", downloadURL);
          toast.loading("loading...");
          fetch(`${BASE_URL}/auth/register`, {
            method: "POST",
            body: formData,
          }).then(async (savedUserResponse) => {
            const savedUser = await savedUserResponse.json();
            if (savedUserResponse.status !== 201) {
              toast.dismiss();
              toast.error("Email already in use");
              return;
            }
            onSubmitProps.resetForm();

            if (savedUser) {
              setPageType("login");
              if (savedUser) {
                setPageType("login");
                toast.dismiss();
                toast.success("Registered successfully");
              }
            }
          })
        })
      }
    )
    /*formData.append("picturePath", values.picture.name);

    const savedUserResponse = await fetch(
      "http://localhost:5000/auth/register",
      {
        method: "POST",
        body: formData,
      }
    );
    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    if (savedUser) {
      setPageType("login");
    }*/
  };

  const login = async (values, onSubmitProps) => {
     toast.loading("loading...");
    const loggedInResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (loggedInResponse.status !== 200) {
      toast.dismiss();
       toast.error("invalid credentials");
       return;
     }
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");
       toast.dismiss();
       toast.success("Logged in succesfully");
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <div className="container">
    <div className="form-container">
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit} className="auth-form-container">
          {isRegister && (
            <>
              <label htmlFor="name" style={{ color: "purple" }}>Enter First name</label>
              <input
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                placeholder="first Name"
                error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                helperText={touched.firstName && errors.firstName}
              />
              <label htmlFor="name" style={{ color: "purple" }}>Enter Last name</label>
              <input
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                placeholder="last Name"
                error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                helperText={touched.lastName && errors.lastName}
              />
              <label htmlFor="name" style={{ color: "purple" }}>Location</label>
              <input
                label="Location"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.location}
                name="location"
                placeholder="city name"
                error={Boolean(touched.location) && Boolean(errors.location)}
                helperText={touched.location && errors.location}
              />
              <label htmlFor="name" style={{ color: "purple" }}>Occupation</label>
              <input
                label="Occupation"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.occupation}
                name="occupation"
                placeholder="your occupation"
                error={
                  Boolean(touched.occupation) && Boolean(errors.occupation)
                }
                helperText={touched.occupation && errors.occupation}
              />
              <div>
                <Dropzone
                  acceptedFiles=".jpg, .jpeg, .png"
                  multiple={false}
                  onDrop={(acceptedFiles) =>
                    setFieldValue("picture", acceptedFiles[0])
                  }
                >
                  {({ getRootProps, getInputProps }) => (
                    <button {...getRootProps()}>
                      <input {...getInputProps()} />
                      {!values.picture ? (
                        <p  style={{ color: "purple" }}>Add picture here</p>
                      ) : (
                        <div>
                          <p>{values.picture.name}</p>
                        </div>
                      )}
                    </button>
                  )}
                </Dropzone>
              </div>
            </>
          )}
          <label htmlFor="email" style={{ color: "purple" }}>Email</label>
          <input
            label="Email"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.email}
            name="email"
            placeholder="youremail@gmail.com"
            error={Boolean(touched.email) && Boolean(errors.email)}
            helperText={touched.email && errors.email}
          />
          <label htmlFor="password" style={{ color: "purple" }}>Password</label>
          <input
            label="Password"
            type="password"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.password}
            name="password"
            placeholder="********"
            error={Boolean(touched.password) && Boolean(errors.password)}
            helperText={touched.password && errors.password}
          />
          <button type="submit" style={{ backgroundColor: "gray", color: "white" }}>{isLogin ? "LOGIN" : "REGISTER"}</button>
          <button className="link-btn"
            onClick={() => {
              setPageType(isLogin ? "register" : "login");
              resetForm();
            }}
          >
            <p style={{ color: "gray" }}>
            {isLogin
              ? "Don't have an account? Sign up here."
              : "Already have an account? Login here."}
            </p>
          </button>
        </form>
       
      )}
    </Formik>
    </div>
    </div>
  );
};

export default Auth;
