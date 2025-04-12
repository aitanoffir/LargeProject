import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import sign_up_picture from "../assets/jonathan-borba-R0y_bEUjiOM-unsplash.jpg";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:7000/api/accounts/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Sign-in failed:", errorData);
        alert("Sign-in failed. Please try again.");
      } else {
        const data = await response.json();
        console.log("Sign-in successful:", data);
        localStorage.setItem("token", data.jwt);
        localStorage.setItem("userId", data.data._id);
  
        try {
          const firebaseUserCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
          const firebaseUser = firebaseUserCredential.user;
          localStorage.setItem("verified", firebaseUser.emailVerified);
          if (!firebaseUser.emailVerified) {
            navigate("/email-verify");
          } else {
            navigate("/Home");
          }
        } catch (error) {
          console.log("No Firebase account but signed in successfully... creating Firebase account...");
          await createUserWithEmailAndPassword(auth, formData.email, formData.password);
          const firebaseUserCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
          const firebaseUser = firebaseUserCredential.user;
          if (!firebaseUser.emailVerified) {
            navigate("/email-verify");
          } else {
            navigate("/Home");
          }
        }
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left-side image remains the same */}
      <img
        className="w-3/5 h-screen object-cover"
        src={sign_up_picture}
        alt="Fitness Woman Standing"
      />
      {/* Right-side form container */}
      <div className="w-2/5 h-screen flex items-center justify-center bg-agreeable-grey">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-2">Sign In</h1>
          <p className="text-sm text-center mb-6">Welcome Back</p>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <label htmlFor="email" className="mb-1 font-medium text-gray-700">Email</label>
            <input
              className="mb-4 p-2 border border-gray-300 rounded"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
            <label htmlFor="password" className="mb-1 font-medium text-gray-700">Password</label>
            <input
              className="mb-6 p-2 border border-gray-300 rounded"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
            />
            <button
              type="submit"
              className="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              Sign In
            </button>
            <div className="flex justify-between items-center mt-4 text-sm">
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className="text-purple-600 font-bold hover:underline">
                  Sign Up
                </Link>
              </p>
              <Link to="/password-reset" className="text-purple-600 hover:underline">
                Forgot Password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
