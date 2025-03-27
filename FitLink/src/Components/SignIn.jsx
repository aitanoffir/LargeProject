import React, { useState } from "react";
import sign_up_picture from "../assets/jonathan-borba-R0y_bEUjiOM-unsplash.jpg";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://fit-link.xyz:7000/api/accounts/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Signup failed:", errorData);
        alert("Signup failed. Please try again.");
      } else {
        const data = await response.json();
        console.log("Signup successful:", data);
        alert("Sign In successful!");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An error occurred. Please try again later.");
    }
  };
  

  return (
    <div className="flex h-screen items-center justify-center">
      <img
        className="w-3/5 h-screen object-cover "
        src={sign_up_picture}
        alt="Fitness Woman Standing"
      />
      <div className="w-full h-screen place-content-center bg-agreeable-grey">
        <div className="w-3/4 h-auto rounded-lg m-auto flex flex-col items-start bg-white">
          <div className="w-full m-0 py-8">
            <h1 className="text-3xl font-bold text-center mb-2">Sign In</h1>
            <p className="text-sm text-center">Welcome Back</p>
            <form
              onSubmit={handleSubmit}
              className="w-4/5 mx-auto flex flex-col"
            >
              <label for="email" className="input-label">
                Email
              </label>
              <input
                className="input-field"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <label for="password" className="input-label">
                Password
              </label>
              <input
                className="input-field"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <button
                type="submit"
                className="btn-primary bg-primary w-full h-10 mt-8 mb-2 rounded-m"
              >
                Sign In
              </button>
              <p className="text-sm ">Don't have an account yet? Sign Up</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
