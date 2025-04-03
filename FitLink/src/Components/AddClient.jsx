import React, { useState } from "react";
import { FaBorderAll } from "react-icons/fa";

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
      fitness: "",
    });

    const containerStyle = {
      display: 'flex',
      justifyContent: 'space-between',
    };
  
    const leftColumnStyle = {
      padding: '10px',
      textAlign: 'left',
    };
  
    const rightColumnStyle = {
      width: '60%',
      padding: '10px',
      textAlign: 'left',
    };
  
    const columnItemStyle = {
      marginBottom: '50px',  
    };

    const circleStyle = {
      position: 'absolute',
      top: '200px', 
      right: '350px', 
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      backgroundColor: '#7CC9F7', 
      boxShadow: '0 3px 6px #9b9b9b', 
    };

    const rectangleStyle = {
      position: 'absolute',
      top: '330px',
      right: '460px',
      width: '115px', 
      height: '40px', 
      borderRadius: '22px',
      backgroundColor: '#F18B21', 
      boxShadow: '0 3px 6px #9b9b9b',
    };


  return (
    <div className = "flex flex-col p-8">
      <div style={{zindex: 0, backgroundColor: '#F8F8F8', alignItems: 'center',position: "absolute",top: 0, left: 0, width: "100vw", height: "150px", marginLeft: 0, paddingLeft: 0 }}></div>
      <h1 className= "text-4xl font-bold text-left mb-20 mt-9" style = {{position:'relative', zindex: 1}}>Add a Client</h1>
      <h2 className = "text-2xl font-bold mb-1 text-left">Enter Client Information</h2>

      <div className = "w-3/4 bg-white p-8 rounded-lg shadow-lg">
        <div className = "ml-12">
          <div style={containerStyle}>
            <div style={leftColumnStyle}>
              <label for="name" className = "input-label">Name:</label>
              <input style={{...columnItemStyle, boxShadow: '0px 1px 3px #2e2e2e', backgroundColor: "#CCCCCC", borderColor: "#734BF4", borderWidth: "2px" }} type = "text" className = "w-65 rounded-lg p-2"/>

              <label for="DOB" className = "input-label">Date of Birth: (mm/dd/year)</label>
              <input style={{...columnItemStyle, boxShadow: '0px 1px 3px #2e2e2e', backgroundColor: "#CCCCCC", borderColor: "#734BF4", borderWidth: "2px" }} type = "text" className = "w-65 rounded-lg p-2"/>

              <label for="weight" className = "input-label">Weight (in pounds):</label>
              <input style={{...columnItemStyle, boxShadow: '0px 1px 3px #2e2e2e', backgroundColor: "#CCCCCC", borderColor: "#734BF4", borderWidth: "2px" }} type = "text" className = "w-65 rounded-lg p-2"/>

              <label for="height" className = "input-label">Height (in inches):</label>
              <select style={{...columnItemStyle, boxShadow: '0px 1px 3px #2e2e2e', backgroundColor: "#CCCCCC", borderColor: "#734BF4", borderWidth: "2px" }} type = "text" className = "w-65 rounded-lg p-2">
                <option>Select -Height-</option>
              </select>

              <label for="sex" className = "input-label">Sex:</label>
              <select style={{...columnItemStyle, boxShadow: '0px 1px 3px #2e2e2e', backgroundColor: "#CCCCCC", borderColor: "#734BF4", borderWidth: "2px" }} type = "text" className = "w-65 rounded-lg p-2">
                <option>Select -Sex-</option>
                <option>Male</option>
                <option>Female</option>
                <option>N/A</option>
              </select>

            </div>
            <div style={rightColumnStyle}>
              <label for="email" className="input-label">Email</label>
              <input style={{...columnItemStyle, boxShadow: '0px 1px 3px #2e2e2e', backgroundColor: "#CCCCCC", borderColor: "#734BF4", borderWidth: "2px" }} type = "text" className = "w-65 rounded-lg p-2"/>

              <label for="phone" className = "input-label">Phone Number:</label>
              <input style={{...columnItemStyle, boxShadow: '0px 1px 3px #2e2e2e', backgroundColor: "#CCCCCC", borderColor: "#734BF4", borderWidth: "2px" }} type = "text" className = "w-65 rounded-lg p-2"/>

              <label for="goalWeight" className = "input-label">Goal Weight:</label>
              <select style={{...columnItemStyle, boxShadow: '0px 1px 3px #2e2e2e', backgroundColor: "#CCCCCC", borderColor: "#734BF4", borderWidth: "2px" }} type = "text" className = "w-65 rounded-lg p-2">
                <option>Select -Goal Weight-</option>
              </select>

              <label for="activity" className = "input-label">Activity Level:</label>
              <select style={{...columnItemStyle, boxShadow: '0px 1px 3px #2e2e2e', backgroundColor: "#CCCCCC", borderColor: "#734BF4", borderWidth: "2px" }} type = "text" className = "w-65 rounded-lg p-2">
                <option>Select -Activity Level-</option>
              </select>

              <label for="fitness" className = "input-label">Fitness Experience</label>
              <select style={{...columnItemStyle, boxShadow: '0px 1px 3px #2e2e2e', backgroundColor: "#CCCCCC", borderColor: "#734BF4", borderWidth: "2px" }} type = "text" className = "w-65 rounded-lg p-2">
                <option>Select -Fitness Experience-</option>
              </select>

            </div>
          </div>
        </div>
        <div className = "flex justify-between mt-6">
          <button className = "bg-black text-white px-4 py-2 rounded-md">
            Back
          </button>
          <button className = "bg-black text-white px-4 py-2 rounded-md">
            Add Client
          </button>
        </div>
      </div>  
      
      <div style={circleStyle}></div>
      <div style={rectangleStyle}>
        <label className = "input-label text-right mr-3 mt-2">Edit Color</label>
      </div>
       
    </div>
  )
}

export default AddClient;
