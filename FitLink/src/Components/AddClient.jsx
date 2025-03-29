import React from 'react'

const AddClient = () => {
  return (
    <div className = "flex flex-col items-center p-8">
      <h1 className = "test-3xl font-bold mb-4">Add a Client</h1>


      <div className = "w-3/4 bg-white p-8 rounded-lg shadow-lg">
        <h2 className = "text-xl font-bold mb-4">Enter Client Information</h2>
        
        <form className = "grid grid-cols-2 gap-4">
          <div>
            <label className = "block">Name:</label>
            <input type = "text" className = "w-full border rounded-md p-2" />
          </div>
          <div>
            <label className = "block">Email:</label>
            <input type = "email" className = "w-full border rounded-md p-2" />
          </div>
          <div>
            <label className = "block">Date of Birth: (mm/dd/year)</label>
            <input type = "text" className = "w-full border rounded-md p-2" />
          </div>
          <div>
            <label className = "block">Phone Number:</label>
            <input type = "text" className = "w-full border rounded-md p-2" />
          </div>
          <div>
            <label className = "block">Weight (in pounds):</label>
            <input type = "number" className = "w-full border rounded-md p-2" />
          </div>
          <div>
            <label className = "block">Goal Weight:</label>
            <select className = "w-full border rounded-md p-2">
              <option>Select -Goal Weight-</option>
            </select>
          </div>
          <div>
            <label className = "block">Height (in inches):</label>
            <select className = "w-full border rounded-md p-2">
              <option>Select -Height-</option>
            </select>
          </div>
          <div>
            <label className = "block">Activity Level:</label>
            <select className = "w-full border rounded-md p-2">
              <option>Select -Activity Level-</option>
            </select>
          </div>
          <div>
            <label className = "block">Sex:</label>
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
