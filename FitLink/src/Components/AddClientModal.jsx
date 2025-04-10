import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import pencil_icon from "../assets/Pencil Icon.png";
import plus_circle from "../assets/plusCircleWhite.png";
import left_arrow from "../assets/leftArrowWhite.png";

const AddClientModal = ({ onClose }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    weight: "",
    height: "",
    sex: "",
    email: "",
    phoneNumber: "",
    goalWeight: "",
    activityLevel: "",
    workoutSchedule: [],
    color: "#7CC9F7"
  });

  const [errors, setErrors] = useState({});

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 5; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = new Date(2023, 0, 1, hour, minute);
        options.push(time.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }));
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const convertTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    return (hours % 12 + (period === 'PM' ? 12 : 0)) * 60 + minutes;
  };

  const handlePhoneChange = (e) => {
    const input = e.target.value.replace(/\D/g, '').substring(0, 10);
    let formatted = input;
    if (input.length > 3) formatted = `${input.slice(0, 3)}-${input.slice(3)}`;
    if (input.length > 6) formatted = `${formatted.slice(0, 7)}-${formatted.slice(7)}`;
    setForm(prev => ({...prev, phoneNumber: formatted }));
    setErrors(prev => ({...prev, phoneNumber: null }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    if (name === 'email') {
      setErrors(prev => ({
        ...prev,
        email: validateEmail(value) ? null : "Invalid email format"
      }));
    }
  };

  const handleDayToggle = (day, isChecked) => {
    const newSchedule = isChecked
      ? [...form.workoutSchedule, { day, startTime: '', endTime: '' }]
      : form.workoutSchedule.filter(d => d.day !== day);
    setForm(prev => ({...prev, workoutSchedule: newSchedule }));
    setErrors(prev => ({...prev, workoutTime: null }));
  };

  const handleTimeChange = (day, field, e) => {
    const newValue = e.target.value;
    const updated = form.workoutSchedule.map(d => {
      if (d.day === day) {
        const newSchedule = { ...d, [field]: newValue };
        
        if (newSchedule.startTime && newSchedule.endTime) {
          const startMins = convertTimeToMinutes(newSchedule.startTime);
          const endMins = convertTimeToMinutes(newSchedule.endTime);
          
          if (startMins >= endMins) {
            setErrors(prev => ({
              ...prev,
              workoutTime: `End time must be after start time for ${day}`
            }));
          } else {
            setErrors(prev => ({ ...prev, workoutTime: null }));
          }
        }
        return newSchedule;
      }
      return d;
    });
    setForm(prev => ({...prev, workoutSchedule: updated }));
  };

  const handleAddClient = async () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    if (!validateEmail(form.email)) newErrors.email = "Invalid email format";
    if (!form.phoneNumber || form.phoneNumber.length < 12) newErrors.phoneNumber = "Invalid phone number";
    if (!form.firstName) newErrors.firstName = "First name required";
    if (!form.lastName) newErrors.lastName = "Last name required";

    // Validate workout schedule completeness
    const invalidWorkouts = form.workoutSchedule.filter(ws => 
      !ws.startTime || !ws.endTime
    );
    if (invalidWorkouts.length > 0) {
      newErrors.workoutSchedule = "Please provide both start and end times for all selected days";
    }

    // Validate workout times
    const invalidTimes = form.workoutSchedule.filter(ws => {
      if (!ws.startTime || !ws.endTime) return false;
      const startMins = convertTimeToMinutes(ws.startTime);
      const endMins = convertTimeToMinutes(ws.endTime);
      return startMins >= endMins;
    });

    if (invalidTimes.length > 0) {
      newErrors.workoutTime = "End times must be after start times for all workouts";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const token = localStorage.getItem("token");
    const trainerId = localStorage.getItem("userId");
    if (!token || !trainerId) {
      alert("You must be signed in to add a client.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:7000/api/accounts/client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          ...form,
          trainer: trainerId,
        }),
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
    marginBottom: "20px",
    boxShadow: "0px 1px 3px #2e2e2e",
    backgroundColor: "#CCCCCC",
    borderColor: "#734BF4",
    borderWidth: "2px",
    fontFamily: "Inter, sans-serif",
  };

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-5/8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 z-10"
        >
          <FaTimes size={24} />
        </button>

        <div className="flex flex-col p-8 items-center">
          <div
            style={{
              zIndex: 0,
              backgroundColor: "#F8F8F8",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "150px",
            }}
          ></div>
          
        
          <div className="w-3/4 bg-white p-1 rounded-lg shadow-lg relative mx-auto">
          <h2 className="text-center text-xl font-bold" style={{ fontFamily: "Inter, sans-serif" }}>
              Add Client Information
            </h2>
            <div className="ml-12 mr-12">
              <div style={containerStyle}>
                <div style={{ width: "45%", padding: "5px", textAlign: "left" }}>
                  {errors.firstName && <p className="text-red-500 text-sm -mb-2">{errors.firstName}</p>}
                  <label htmlFor="firstName" className="input-label">First Name:</label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    style={columnItemStyle}
                    className={`w-full rounded-lg p-2 ${errors.firstName ? 'border-red-500' : ''}`}
                  />

                  {errors.lastName && <p className="text-red-500 text-sm -mb-2">{errors.lastName}</p>}
                  <label htmlFor="lastName" className="input-label">Last Name:</label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    style={columnItemStyle}
                    className={`w-full rounded-lg p-2 ${errors.lastName ? 'border-red-500' : ''}`}
                  />

                  <label htmlFor="age" className="input-label">Age:</label>
                  <input
                    name="age"
                    type="number"
                    value={form.age}
                    onChange={handleChange}
                    style={columnItemStyle}
                    className="w-full rounded-lg p-2"
                  />

                  <label htmlFor="weight" className="input-label">Weight (lbs):</label>
                  <input
                    name="weight"
                    type="number"
                    value={form.weight}
                    onChange={handleChange}
                    style={columnItemStyle}
                    className="w-full rounded-lg p-2"
                  />

                  <label htmlFor="height" className="input-label">Height (in):</label>
                  <input
                    name="height"
                    type="number"
                    value={form.height}
                    onChange={handleChange}
                    style={columnItemStyle}
                    className="w-full rounded-lg p-2"
                  />

                  <label htmlFor="sex" className="input-label">Sex:</label>
                  <select
                    name="sex"
                    value={form.sex}
                    onChange={handleChange}
                    style={columnItemStyle}
                    className="w-full rounded-lg p-2"
                  >
                    <option value="">Select -Sex-</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>N/A</option>
                  </select>
                </div>

                <div style={{ width: "45%", padding: "5px", textAlign: "left" }}>
                  {errors.email && <p className="text-red-500 text-sm -mb-2">{errors.email}</p>}
                  <label htmlFor="email" className="input-label">Email:</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="this@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full rounded-lg p-2 ${errors.email ? 'border-red-500' : ''}`}
                    style={columnItemStyle}
                  />

                  {errors.phoneNumber && <p className="text-red-500 text-sm -mb-2">{errors.phoneNumber}</p>}
                  <label htmlFor="phoneNumber" className="input-label">Phone Number:</label>
                  <input
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="123-456-7890"
                    maxLength="12"
                    className={`w-full rounded-lg p-2 ${errors.phoneNumber ? 'border-red-500' : ''}`}
                    style={columnItemStyle}
                  />

                  <label htmlFor="goalWeight" className="input-label">Goal Weight (lbs):</label>
                  <input
                    name="goalWeight"
                    type="number"
                    value={form.goalWeight}
                    onChange={handleChange}
                    style={columnItemStyle}
                    className="w-full rounded-lg p-2"
                  />

                  <label htmlFor="activityLevel" className="input-label">Activity Level:</label>
                  <select
                    name="activityLevel"
                    value={form.activityLevel}
                    onChange={handleChange}
                    style={columnItemStyle}
                    className="w-full rounded-lg p-2"
                  >
                    <option value="">Select -Activity Level-</option>
                    <option>Sedentary</option>
                    <option>Slightly active</option>
                    <option>Moderately active</option>
                    <option>Very active</option>
                  </select>

                  <div className="mt-3">
                    <label className="input-label block mb-2">Profile Color</label>
                    <div className="relative inline-block">
                      <div
                        className="w-16 h-16 rounded-full border-2 border-purple-500 cursor-pointer relative overflow-hidden"
                        style={{ backgroundColor: form.color }}
                        onClick={() => document.getElementById('colorInput').click()}
                      >
                        <input
                          type="color"
                          id="colorInput"
                          className="absolute opacity-0 w-full h-full cursor-pointer"
                          value={form.color}
                          onChange={(e) => setForm(prev => ({...prev, color: e.target.value}))}
                        />
                        <img
                          src={pencil_icon}
                          alt="Edit color"
                          className="absolute bottom-1 right-1 w-6 h-6 p-1 bg-white rounded-full shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-1 col-span-2">
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                  Workout Schedule
                </h3>
                <div className="grid grid-cols-7 gap-2 bg-gray-100 p-4 rounded-lg" style={{
                  boxShadow: "0px 1px 3px #2e2e2e",
                  borderColor: "#734BF4",
                  borderWidth: "2px"
                }}>
                  {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => (
                    <div 
                      key={day} 
                      className="border p-2 rounded-lg bg-white transition-all"
                      style={{
                        borderColor: form.workoutSchedule.some(d => d.day === day) ? "#734BF4" : "#CCCCCC",
                        borderWidth: "2px"
                      }}
                    >
                      <label className="flex items-center mb-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="mr-2 w-4 h-4 accent-purple-600"
                          checked={form.workoutSchedule.some(d => d.day === day)}
                          onChange={(e) => handleDayToggle(day, e.target.checked)}
                        />
                        <span className="font-semibold text-sm">{day.slice(0, 3)}</span>
                      </label>
                      
                      {form.workoutSchedule.some(d => d.day === day) && (
                        <div className="space-y-2">
                          <select
                            className={`w-full text-sm p-1 rounded bg-gray-100 border ${
                              errors.workoutTime && errors.workoutTime.includes(day) 
                                ? 'border-red-500' 
                                : 'border-gray-300 focus:border-purple-500'
                            }`}
                            value={form.workoutSchedule.find(d => d.day === day)?.startTime || ''}
                            onChange={(e) => handleTimeChange(day, 'startTime', e)}
                          >
                            <option value="">Start Time</option>
                            {timeOptions.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                          
                          <select
                            className={`w-full text-sm p-1 rounded bg-gray-100 border ${
                              errors.workoutTime && errors.workoutTime.includes(day) 
                                ? 'border-red-500' 
                                : 'border-gray-300 focus:border-purple-500'
                            }`}
                            value={form.workoutSchedule.find(d => d.day === day)?.endTime || ''}
                            onChange={(e) => handleTimeChange(day, 'endTime', e)}
                          >
                            <option value="">End Time</option>
                            {timeOptions.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {errors.workoutSchedule && (
                  <div className="mt-4 text-red-500 text-sm">
                    ⚠️ {errors.workoutSchedule}
                  </div>
                )}
                {errors.workoutTime && (
                  <div className="mt-2 text-red-500 text-sm">
                    ⚠️ {errors.workoutTime}
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-3 mb-3">
                <button onClick={onClose} className="bg-black text-white px-4 py-2 rounded-xl flex items-left">
                  <img className="h-5 w-5 mr-2 mt-1" src={left_arrow} alt="Back" />
                  Back
                </button>

                <button onClick={handleAddClient} className="bg-black text-white px-4 py-2 rounded-xl flex items-left">
                  <img className="h-7 w-7 mr-2 mt-0" src={plus_circle} alt="Add Client" />
                  Add Client
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClientModal;