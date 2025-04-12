import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import sign_up_picture from "../assets/jonathan-borba-R0y_bEUjiOM-unsplash.jpg";
import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
  
    try {
      // Call your backend login endpoint.
      const response = await fetch("http://localhost:7000/api/accounts/login", {
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
        console.error("Sign-in failed:", errorData);
        alert("Sign-in failed. Please try again.");
      } else {
        const data = await response.json();
        console.log("Sign-in successful:", data);

        // Save backend tokens.
        localStorage.setItem("token", data.jwt);
        localStorage.setItem("userId", data.data._id);
        
        // Now sign in with Firebase.

        try {
          const firebaseUserCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
          const firebaseUser = firebaseUserCredential.user;
          console.log(firebaseUser);
          localStorage.setItem("verified", firebaseUser.emailVerified);

          // Check if the user’s Firebase email is verified.
          if (!firebaseUser.emailVerified) {
            // If not verified, redirect to EmailVerificationPage.
            navigate("/email-verify");
          } else {
            // If verified, proceed as normal.
            navigate("/Home");
          }
        
        } catch (error) {
          console.log("no firebase account but signed in successful... creating firebase account...");
          await createUserWithEmailAndPassword(auth, formData.email, formData.password);
          const firebaseUserCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
          const firebaseUser = firebaseUserCredential.user;

          // Check if the user’s Firebase email is verified.
          if (!firebaseUser.emailVerified) {
            // If not verified, redirect to EmailVerificationPage.
            navigate("/email-verify");
          } else {
            // If verified, proceed as normal.
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
    <div className="flex h-screen items-center justify-center">
      <img
        className="w-3/5 h-screen object-cover"
        src={sign_up_picture}
        alt="Fitness Woman Standing"
      />
      <div className="w-full h-screen place-content-center bg-agreeable-grey">
        <div className="w-3/4 h-auto rounded-lg m-auto flex flex-col items-start bg-white">
          <div className="w-full m-0 py-8">
            <h1 className="text-3xl font-bold text-center mb-2">Sign In</h1>
            <p className="text-sm text-center">Welcome Back</p>
            <form onSubmit={handleSubmit} className="w-4/5 mx-auto flex flex-col">
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
              <button
                type="submit"
                className="btn-primary bg-primary w-full h-10 mt-8 mb-2 rounded-m"
              >
                Sign In
              </button>
              <div className="flex justify-between items-center">
                <p className="text-sm">
                  Don't have an account yet?{" "}
                  <Link to="/signup" className="text-primary font-bold">
                    Sign Up
                  </Link>
                </p>
                <Link to="/password-reset" className="text-sm text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
