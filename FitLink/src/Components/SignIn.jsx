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
  
      if (response.ok) {
        // Backend login successful - normal flow
        const data = await response.json();
        console.log("Sign-in successful:", data);
  
        // Save backend tokens
        localStorage.setItem("token", data.jwt);
        localStorage.setItem("userId", data.data._id);
        
        // Now sign in with Firebase
        try {
          const firebaseUserCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
          const firebaseUser = firebaseUserCredential.user;
          localStorage.setItem("verified", firebaseUser.emailVerified);
  
          // Check verification and navigate
          if (!firebaseUser.emailVerified) {
            navigate("/email-verify");
          } else {
            navigate("/Home");
          }
        } catch (error) {
          console.log("No Firebase account but backend login successful... creating Firebase account");
          await createUserWithEmailAndPassword(auth, formData.email, formData.password);
          const firebaseUserCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
          const firebaseUser = firebaseUserCredential.user;
  
          if (!firebaseUser.emailVerified) {
            navigate("/email-verify");
          } else {
            navigate("/Home");
          }
        }
      } else {
        // Backend login failed - could be a password reset scenario
        const errorData = await response.json();
        console.log("Backend login failed:", errorData);
        
        // Try Firebase login
        try {
          console.log("Trying Firebase authentication...");
          const firebaseUserCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
          const firebaseUser = firebaseUserCredential.user;
          
          console.log("Firebase auth successful - syncing password with backend");
          
          // Firebase login worked, Call sync endpoint
          const syncResponse = await fetch("http://localhost:7000/api/accounts/sync-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
              firebaseUID: firebaseUser.uid  // Send Firebase UID for verification
            }),
          });
          
          if (syncResponse.ok) {
            const syncData = await syncResponse.json();
            console.log("Password synchronized successfully");
            
            // Save tokens from sync response
            localStorage.setItem("token", syncData.jwt);
            localStorage.setItem("userId", syncData.data._id);
            localStorage.setItem("verified", firebaseUser.emailVerified);
            
            // Navigate based on verification status
            if (!firebaseUser.emailVerified) {
              navigate("/email-verify");
            } else {
              navigate("/Home");
            }
          } else {
            console.error("Failed to sync password with backend");
            alert("Authentication error. Please try again.");
          }
        } catch (firebaseError) {
          // Both backend and Firebase auth failed
          console.error("Firebase auth also failed:", firebaseError);
          alert("Sign-in failed. Please check your credentials.");
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
