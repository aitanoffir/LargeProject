import React, { useState } from "react";

const AddClient = () => {

  const [formData, setFormData] = useState({
      name: "",
      email: "",
      DOB: "",
      phone: "",
      weight: "",
      goalWeight: "",
      height: "",
      activity: "",
      sex: "",
    });


  return (
    <div className = "flex flex-col items-center p-8">
      <h1 className = "text-7xl font-bold mb-4">Add a Client</h1>


      <div className = "w-3/4 bg-white p-8 rounded-lg shadow-lg">
        <h2 className = "text-2xl font-bold mb-4">Enter Client Information</h2>
        
        <form className = "grid grid-cols-2 gap-4">
          <div>
            <label for="name" className = "input-label">Name:</label>
            <input type = "text" className = "w-full border rounded-md p-2" />
          </div>
          <div>
            <label for="email" className="input-label">Email</label>
            <input type = "email" className = "w-full border rounded-md p-2" />
          </div>
          <div>
            <label for="DOB" className = "input-label">Date of Birth: (mm/dd/year)</label>
            <input type = "text" className = "w-full border rounded-md p-2" />
          </div>
          <div>
            <label for="phone" className = "input-label">Phone Number:</label>
            <input type = "text" className = "w-full border rounded-md p-2" />
          </div>
          <div>
            <label for="weight" className = "input-label">Weight (in pounds):</label>
            <input type = "number" className = "w-full border rounded-md p-2" />
          </div>
          <div>
            <label for="goalWeight" className = "input-label">Goal Weight:</label>
            <select className = "w-full border rounded-md p-2">
              <option>Select -Goal Weight-</option>
            </select>
          </div>
          <div>
            <label for="height" className = "block">Height (in inches):</label>
            <select className = "w-full border rounded-md p-2">
              <option>Select -Height-</option>
            </select>
          </div>
          <div>
            <label for="activity" className = "block">Activity Level:</label>
            <select className = "w-full border rounded-md p-2">
              <option>Select -Activity Level-</option>
            </select>
          </div>
          <div>
            <label for="sex" className = "block">Sex:</label>
            <select className = "w-full border rounded-md p-2">
              <option>Select -Fitness Experience-</option>
            </select>
          </div>
        </form>
        <div className = "flex justify-between mt-6">
          <button className = "bg-black text-white px-4 py-2 rounded-md">
            Back
          </button>
          <button className = "bg-black text-white px-4 py-2 rounded-md">
            Add Client
          </button>
        </div>
      </div>     
    </div>
  )
}

export default AddClient;
