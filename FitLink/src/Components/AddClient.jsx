import React, { useState } from "react";
import "../index.css";
import { FaBorderAll } from "react-icons/fa";
import pencil_icon from "../assets/Pencil Icon.png";
import plus_circle from "../asset/plusCircleWhite.png";

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
      boxShadow: '0px 1px 3px #2e2e2e',
      backgroundColor: "#CCCCCC",
      borderColor: "#734BF4",
      borderWidth: "2px",
      fontFamily: 'Inter, sans-serif', 
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
      bottom: '20px',
      left: '-30px',
      width: '130px', 
      height: '40px', 
      borderRadius: '22px',
      backgroundColor: '#F18B21', 
      boxShadow: '0 3px 6px #9b9b9b',
    };


  return (
    <div className = "flex flex-col p-8">
      <div style={{zindex: 0, backgroundColor: '#F8F8F8', alignItems: 'center',position: "absolute",top: 0, left: 0, width: "100vw", height: "150px", marginLeft: 0, paddingLeft: 0 }}></div>
      <h1 className= "text-4xl font-bold text-left mb-20 mt-9" style = {{position:'relative', zindex: 1, fontFamily: 'Inter, sans-serif'}}>Add a Client</h1>
      <h2 className = "text-2xl font-bold mb-1 text-left" style ={{fontFamily: 'Inter, sans-serif'}}>Enter Client Information</h2>

      <div className = "w-3/4 bg-white p-8 rounded-lg shadow-lg">
        <div className = "ml-12">
          <div style={containerStyle}>
            <div style={leftColumnStyle}>
              <label for="name" className = "input-label" style = {{fontFamily: 'Inter, sans-serif'}}>Name:</label>
              <input style={{...columnItemStyle}} type = "text" className = "w-65 rounded-lg p-2"/>

              <label for="DOB" className = "input-label" style = {{fontFamily: 'Inter, sans-serif'}}>Date of Birth: (mm/dd/year)</label>
              <input style={{...columnItemStyle}} type = "text" className = "w-65 rounded-lg p-2"/>

              <label for="weight" className = "input-label" style = {{fontFamily: 'Inter, sans-serif'}}>Weight (in pounds):</label>
              <input style={{...columnItemStyle}} type = "text" className = "w-65 rounded-lg p-2"/>

              <label for="height" className = "input-label" style = {{fontFamily: 'Inter, sans-serif'}}>Height (in inches):</label>
              <input style={{...columnItemStyle}} type = "text" className = "w-65 rounded-lg p-2"/>

              <label for="sex" className = "input-label" style = {{fontFamily: 'Inter, sans-serif'}}>Sex:</label>
              <select style={{...columnItemStyle}} type = "text" className = "w-65 rounded-lg p-2">
                <option>Select -Sex-</option>
                <option>Male</option>
                <option>Female</option>
                <option>N/A</option>
              </select>

            </div>
            <div style={rightColumnStyle}>
              <label for="email" className="input-label" style = {{fontFamily: 'Inter, sans-serif'}}>Email:</label>
              <input style={{...columnItemStyle}} type = "text" className = "w-65 rounded-lg p-2"/>

              <label for="phone" className = "input-label" style = {{fontFamily: 'Inter, sans-serif'}}>Phone Number:</label>
              <input style={{...columnItemStyle}} type = "text" className = "w-65 rounded-lg p-2"/>

              <label for="goalWeight" className = "input-label" style = {{fontFamily: 'Inter, sans-serif'}}>Goal Weight:</label>
              <input style={{...columnItemStyle}} type = "text" className = "w-65 rounded-lg p-2"/>

              <label for="activity" className = "input-label" style = {{fontFamily: 'Inter, sans-serif'}}>Activity Level:</label>
              <select style={{...columnItemStyle}} type = "text" className = "w-65 rounded-lg p-2">
                <option>Select -Activity Level-</option>
                <option>Sedentary</option>
                <option>Slightly active</option>
                <option>Moderately active</option>
                <option>Very active</option>
              </select>

              

            </div>
          </div>
        </div>
        <div className = "flex justify-between mt-6">
          <button className = "bg-black text-right text-white px-4 py-2 rounded-xl">Back</button>
          <button className = "bg-black text-left text-white px-8 py-2 rounded-xl">Add Client
            <img src={plus_circle}></img>
          </button>
        </div>
      </div>  
      
      <div style={circleStyle}>
        <button style={rectangleStyle}>
          <label className = "input-label text-black text-right mr-3 mt-2" style = {{fontFamily: 'Inter, sans-serif'}}>Edit Color
            <img className="h-7 w-7  relative top-[-27px] right-[-10px]" src={pencil_icon}></img>
          </label>
          
        </button>
      </div>
      
       
    </div>
  )
}

export default AddClient;


/* 
 Fitness Experience
<label for="fitness" className = "input-label" style = {{fontFamily: 'Inter, sans-serif'}}>Fitness Experience:</label>
              <select style={{...columnItemStyle, boxShadow: '0px 1px 3px #2e2e2e', backgroundColor: "#CCCCCC", borderColor: "#734BF4", borderWidth: "2px", fontFamily: 'Inter, sans-serif'}} type = "text" className = "w-65 rounded-lg p-2">
                <option>Select -Fitness Experience-</option>
              </select>

<div style={rectangleStyle}>
        <label className = "input-label text-right mr-3 mt-2" style = {{fontFamily: 'Inter, sans-serif'}}>Edit Color</label>
      </div>*/