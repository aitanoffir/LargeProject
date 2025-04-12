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
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Clear error message on user input for convenience.
    setErrorMessage("");
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear any previous error message.
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:7000/api/accounts/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
  
      if (response.ok) {
        // Backend login successful - normal flow
        const data = await response.json();
        console.log("Sign-in successful:", data);
  
        // Save backend tokens.
        localStorage.setItem("token", data.jwt);
        localStorage.setItem("userId", data.data._id);
        
        // Now sign in with Firebase.
  
        try {
          const firebaseUserCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
          const firebaseUser = firebaseUserCredential.user;
          localStorage.setItem("verified", firebaseUser.emailVerified);
  
          // Check if the user’s Firebase email is verified.
          if (!firebaseUser.emailVerified) {
            navigate("/email-verify");
          } else {
            navigate("/Home");
          }
        } catch (firebaseError) {
          console.log("No Firebase account but signed in successfully... creating Firebase account...");
          await createUserWithEmailAndPassword(auth, formData.email, formData.password);
          const firebaseUserCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
          const firebaseUser = firebaseUserCredential.user;
  
          // Check if the user’s Firebase email is verified.
          if (!firebaseUser.emailVerified) {
            navigate("/email-verify");
          } else {
            navigate("/Home");
          }
        }
      } else {
        // Backend login failed - could be a password reset scenario.
        const errorData = await response.json();
        console.log("Backend login failed:", errorData);
        
        // Try Firebase login
        try {
          console.log("Trying Firebase authentication...");
          const firebaseUserCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
          const firebaseUser = firebaseUserCredential.user;
          
          console.log("Firebase auth successful - syncing password with backend");
          
          // Firebase login worked; call sync endpoint.
          const syncResponse = await fetch("http://localhost:7000/api/accounts/sync-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
              firebaseUID: firebaseUser.uid  // Send Firebase UID for verification.
            }),
          });
          
          if (syncResponse.ok) {
            const syncData = await syncResponse.json();
            console.log("Password synchronized successfully");
            
            // Save tokens from sync response.
            localStorage.setItem("token", syncData.jwt);
            localStorage.setItem("userId", syncData.data._id);
            localStorage.setItem("verified", firebaseUser.emailVerified);
            
            // Navigate based on verification status.
            if (!firebaseUser.emailVerified) {
              navigate("/email-verify");
            } else {
              navigate("/Home");
            }
          } else {
            console.error("Failed to sync password with backend");
            setErrorMessage("Invalid credentials.");
          }
        } catch (firebaseError) {
          // Both backend and Firebase auth failed.
          console.error("Firebase auth also failed:", firebaseError);
          setErrorMessage("Invalid credentials.");
        }
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="relative h-screen w-full">
      {/* Desktop Layout: Two-column layout for md and above */}
      <div className="hidden lg:flex h-full">
        <img
          className="w-3/5 h-full object-cover"
          src={sign_up_picture}
          alt="Fitness Woman Standing"
        />
        <div className="w-2/5 h-full flex items-center justify-center bg-agreeable-grey">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <h1 className="text-3xl font-bold text-center mb-2">Sign In</h1>
            <p className="text-sm text-center mb-2">Welcome Back</p>
            {errorMessage && (
              <p className="text-red-600 text-center mb-4">{errorMessage}</p>
            )}
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
      {/* Mobile Layout: Form centered on a background image */}
      <div className="lg:hidden h-full flex items-center justify-center" 
           style={{ 
             backgroundImage: `url(${sign_up_picture})`, 
             backgroundSize: 'cover', 
             backgroundPosition: 'center' 
           }}>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-2">Sign In</h1>
          <p className="text-sm text-center mb-2">Welcome Back</p>
          {errorMessage && (
            <p className="text-red-600 text-center mb-4">{errorMessage}</p>
          )}
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
