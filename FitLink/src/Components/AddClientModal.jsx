import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import pencil_icon from "../assets/Pencil Icon.png";
import plus_circle from "../assets/plusCircleWhite.png";
import left_arrow from "../assets/leftArrowWhite.png";

const AddClientModal = ({ onClose }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    weight: "",
    height: "",
    sex: "",
    email: "",
    phoneNumber: "",
    goalWeight: "",
    activityLevel: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClient = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be signed in to add a client.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:7000/api/accounts/client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });
  
      if (!response.ok) {
        const text = await response.text();
        console.error("Add client failed:", text);
        alert("Failed to add client.");
        return;
      }
  
      const result = await response.json();
      if (result.success) {
        onClose();
      } else {
        alert(result.message || "Failed to add client.");
      }
    } catch (error) {
      console.error("Error adding client:", error);
      alert("An error occurred while adding the client.");
    }
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "space-between",
  };

  const columnItemStyle = {
    marginBottom: "50px",
    boxShadow: "0px 1px 3px #2e2e2e",
    backgroundColor: "#CCCCCC",
    borderColor: "#734BF4",
    borderWidth: "2px",
    fontFamily: "Inter, sans-serif",
  };

  const circleStyle = {
    position: "absolute",
    top: "200px",
    right: "350px",
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    backgroundColor: "#7CC9F7",
    boxShadow: "0 3px 6px #9b9b9b",
  };

  const rectangleStyle = {
    position: "absolute",
    bottom: "20px",
    left: "-30px",
    width: "130px",
    height: "40px",
    borderRadius: "22px",
    backgroundColor: "#F18B21",
    boxShadow: "0 3px 6px #9b9b9b",
  };

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-start justify-center pt-10 z-50">
      <div className="bg-white rounded-lg w-3/4 relative m-8 max-h-screen overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 z-10"
        >
          <FaTimes size={24} />
        </button>

        <div className="flex flex-col p-8">
          <div
            style={{
              zIndex: 0,
              backgroundColor: "#F8F8F8",
              alignItems: "center",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "150px",
              marginLeft: 0,
              paddingLeft: 0,
            }}
          ></div>
          <h1
            className="text-5xl font-bold text-left mb-20 mt-9"
            style={{ position: "relative", zIndex: 1, fontFamily: "Inter, sans-serif" }}
          >
            Add a Client
          </h1>
          <h2 className="text-3xl font-bold mb-1 text-left" style={{ fontFamily: "Inter, sans-serif" }}>
            Enter Client Information
          </h2>

          <div className="w-3/4 bg-white p-8 rounded-lg shadow-lg relative">
            <div className="ml-12">
              <div style={containerStyle}>
                <div style={{ padding: "10px", textAlign: "left" }}>
                  <label htmlFor="firstName" className="input-label">First Name:</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} style={columnItemStyle} className="w-65 rounded-lg p-2" />

                  <label htmlFor="lastName" className="input-label">Last Name:</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} style={columnItemStyle} className="w-65 rounded-lg p-2" />

                  <label htmlFor="dob" className="input-label">Date of Birth (mm/dd/yyyy):</label>
                  <input name="dob" value={form.dob} onChange={handleChange} style={columnItemStyle} className="w-65 rounded-lg p-2" />

                  <label htmlFor="weight" className="input-label">Weight (lbs):</label>
                  <input name="weight" value={form.weight} onChange={handleChange} style={columnItemStyle} className="w-65 rounded-lg p-2" />

                  <label htmlFor="height" className="input-label">Height (in):</label>
                  <input name="height" value={form.height} onChange={handleChange} style={columnItemStyle} className="w-65 rounded-lg p-2" />

                  <label htmlFor="sex" className="input-label">Sex:</label>
                  <select name="sex" value={form.sex} onChange={handleChange} style={columnItemStyle} className="w-65 rounded-lg p-2">
                    <option value="">Select -Sex-</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>N/A</option>
                  </select>
                </div>

                <div style={{ width: "60%", padding: "10px", textAlign: "left" }}>
                  <label htmlFor="email" className="input-label">Email:</label>
                  <input name="email" value={form.email} onChange={handleChange} style={columnItemStyle} className="w-65 rounded-lg p-2" />

                  <label htmlFor="phoneNumber" className="input-label">Phone Number:</label>
                  <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} style={columnItemStyle} className="w-65 rounded-lg p-2" />

                  <label htmlFor="goalWeight" className="input-label">Goal Weight:</label>
                  <input name="goalWeight" value={form.goalWeight} onChange={handleChange} style={columnItemStyle} className="w-65 rounded-lg p-2" />

                  <label htmlFor="activityLevel" className="input-label">Activity Level:</label>
                  <select name="activityLevel" value={form.activityLevel} onChange={handleChange} style={columnItemStyle} className="w-65 rounded-lg p-2">
                    <option value="">Select -Activity Level-</option>
                    <option>Sedentary</option>
                    <option>Slightly active</option>
                    <option>Moderately active</option>
                    <option>Very active</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={onClose} className="bg-black text-white px-4 py-2 rounded-xl flex items-left">
                <img className="h-5 w-5 mr-2 mt-1" src={left_arrow} alt="Back" />
                Back
              </button>

              <button onClick={handleAddClient} className="bg-black text-white px-4 py-2 rounded-xl flex items-left">
                <img className="h-7 w-7 mr-2" src={plus_circle} alt="Add Client" />
                Add Client
              </button>
            </div>
          </div>

          <div style={circleStyle}>
            <button style={rectangleStyle}>
              <label className="input-label text-black text-right mr-3 mt-2" style={{ fontFamily: "Inter, sans-serif" }}>
                Edit Color
                <img className="h-7 w-7 relative top-[-27px] right-[-10px]" src={pencil_icon} alt="Edit" />
              </label>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClientModal;
