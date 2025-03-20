import React, { useState } from "react";
import "../index.css";
import sign_up_picture from '../assets/jonathan-borba-R0y_bEUjiOM-unsplash.jpg'

const SignUp = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
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
              <label for="confirm_password" className="input-label">
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
                Already have an account? <a>Log In</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
