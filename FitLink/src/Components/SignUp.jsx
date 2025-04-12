import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import sign_up_picture from "../assets/jonathan-borba-R0y_bEUjiOM-unsplash.jpg";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    special: false,
  });
  const navigate = useNavigate();

  // Update password criteria as user types.
  useEffect(() => {
    const { password } = formData;
    setPasswordCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [formData.password]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isPasswordValid = () =>
    passwordCriteria.length && passwordCriteria.uppercase && passwordCriteria.special;

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match!");
      return;
    }
  
    if (!isPasswordValid()) {
      alert("Password does not meet the required criteria!");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:7000/api/accounts/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Signup failed:", errorData);
        alert("Signup failed. Please try again.");
      } else {
        const data = await response.json();
        console.log("Signup successful:", data);
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        navigate("/email-verification");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An error occurred. Please try again later.");
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
            <h1 className="text-3xl font-bold text-center mb-2">Sign Up</h1>
            <p className="text-sm text-center mb-6">Create your account</p>
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
                className="mb-2 p-2 border border-gray-300 rounded"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
              />
              {/* Live Password Requirements Checklist */}
              <div className="mb-4 text-sm">
                <p className={passwordCriteria.length ? "text-green-600" : "text-red-600"}>
                  • At least 8 characters long
                </p>
                <p className={passwordCriteria.uppercase ? "text-green-600" : "text-red-600"}>
                  • At least 1 uppercase character
                </p>
                <p className={passwordCriteria.special ? "text-green-600" : "text-red-600"}>
                  • At least 1 special character
                </p>
              </div>
              <label htmlFor="confirm_password" className="mb-1 font-medium text-gray-700">Confirm Password</label>
              <input
                className="mb-6 p-2 border border-gray-300 rounded"
                name="confirm_password"
                type="password"
                value={formData.confirm_password}
                onChange={handleInputChange}
                placeholder="Confirm your password"
              />
              <button
                type="submit"
                className="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
              >
                Submit
              </button>
              <p className="text-sm text-center mt-4">
                Already have an account?{" "}
                <Link to="/signin" className="text-purple-600 font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      {/* Mobile Layout: Form centered on background image */}
      <div className="lg:hidden h-full flex items-center justify-center" 
           style={{ 
             backgroundImage: `url(${sign_up_picture})`,
             backgroundSize: 'cover',
             backgroundPosition: 'center'
           }}>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-2">Sign Up</h1>
          <p className="text-sm text-center mb-6">Create your account</p>
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
              className="mb-2 p-2 border border-gray-300 rounded"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
            />
            {/* Live Password Requirements Checklist */}
            <div className="mb-4 text-sm">
              <p className={passwordCriteria.length ? "text-green-600" : "text-red-600"}>
                • At least 8 characters long
              </p>
              <p className={passwordCriteria.uppercase ? "text-green-600" : "text-red-600"}>
                • At least 1 uppercase character
              </p>
              <p className={passwordCriteria.special ? "text-green-600" : "text-red-600"}>
                • At least 1 special character
              </p>
            </div>
            <label htmlFor="confirm_password" className="mb-1 font-medium text-gray-700">Confirm Password</label>
            <input
              className="mb-6 p-2 border border-gray-300 rounded"
              name="confirm_password"
              type="password"
              value={formData.confirm_password}
              onChange={handleInputChange}
              placeholder="Confirm your password"
            />
            <button
              type="submit"
              className="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              Submit
            </button>
            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link to="/signin" className="text-purple-600 font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
