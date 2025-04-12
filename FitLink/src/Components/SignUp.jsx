import React, { useState } from "react";
import "../index.css";
import { Link, useNavigate } from "react-router-dom";
import sign_up_picture from "../assets/jonathan-borba-R0y_bEUjiOM-unsplash.jpg";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check for matching passwords.
    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match!");
      return;
    }
  
    try {
      // Call your backend signup endpoint.
      const response = await fetch("http://localhost:7000/api/accounts/", {
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
  
        // Create a Firebase account as well.
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
  
        // After signup, navigate to the Email Verification page so the user can verify their email.
        navigate("/email-verification");
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
            <h1 className="text-3xl font-bold text-center mb-2">Sign Up</h1>
            <p className="text-sm text-center mb">Create your account</p>
            <form
              onSubmit={handleSubmit}
              className="w-4/5 m-auto flex flex-col "
            >
              <label htmlFor="email" className="input-label">
                Email
              </label>
              <input
                className="input-field"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <input
                className="input-field"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <label htmlFor="confirm_password" className="input-label">
                Confirm Password
              </label>
              <input
                className="input-field"
                name="confirm_password"
                type="password"
                value={formData.confirm_password}
                onChange={handleInputChange}
              />
              <button
                type="submit"
                className="btn-primary w-full h-10 mt-8 mb-2 rounded-m"
              >
                Submit
              </button>
              <p className="text-sm">
                Already have an account?{" "}
                <Link to="/signin" className="text-primary font-bold">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
