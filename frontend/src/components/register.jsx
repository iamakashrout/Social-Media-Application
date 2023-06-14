import React, { useState } from "react";

export const Register = (props) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [age, setAge] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState("");
  const [imageURL, setImageURL] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      setImageURL(event.target.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Enter First name</label>
        <input
          value={firstName}
          name="FirstName"
          onChange={(e) => setFirstName(e.target.value)}
          id="firstname"
          placeholder="first Name"
        />
        <label htmlFor="name">Enter Last name</label>
        <input
          value={lastName}
          name="LastName"
          onChange={(e) => setLastName(e.target.value)}
          id="lastname"
          placeholder="last Name"
        />
        <label htmlFor="email">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="youremail@gmail.com"
          id="email"
          name="email"
        />
        <label htmlFor="password">Password</label>
        <input
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          type="password"
          placeholder="********"
          id="password"
          name="password"
        />
        <label htmlFor="name">Location</label>
        <input
          value={location}
          name=";location"
          onChange={(e) => setLocation(e.target.value)}
          id="location"
          placeholder="city name"
        />
        <label htmlFor="name">Age</label>
        <input
          value={age}
          name="age"
          onChange={(e) => setAge(e.target.value)}
          id="age"
          placeholder="age"
        />
        <label htmlFor="image">Upload Image</label>
        <div>
          <input
            type="file"
            id="image"
            onChange={(e) => handleImageUpload(e)}
            accept="image/*"
          />
          <img src={imageURL} alt="Uploaded" />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <button className="link-btn" onClick={() => props.onFormSwitch("login")}>
        Already have an account? Login here.
      </button>
    </div>
  );
};
