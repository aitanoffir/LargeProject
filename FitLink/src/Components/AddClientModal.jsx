import React, { useState } from "react";
import { FaPlus, FaTimes, FaArrowLeft } from 'react-icons/fa';
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

  const handleDayToggle = (fullDay, isChecked) => {
    const newSchedule = isChecked
      ? [...form.workoutSchedule, { day: fullDay, startTime: '', endTime: '' }]
      : form.workoutSchedule.filter(d => d.day !== fullDay);
    
    setForm(prev => ({...prev, workoutSchedule: newSchedule }));
    setErrors(prev => ({...prev, workoutTime: null }));
  };

  const handleTimeChange = (fullDay, field, e) => {
    const newValue = e.target.value;
    const updated = form.workoutSchedule.map(d => {
      if (d.day === fullDay) {
        const newSchedule = { ...d, [field]: newValue };
        
        if (newSchedule.startTime && newSchedule.endTime) {
          const startMins = convertTimeToMinutes(newSchedule.startTime);
          const endMins = convertTimeToMinutes(newSchedule.endTime);
          
          if (startMins >= endMins) {
            const abbrevDay = Object.entries(dayAbbreviationToFull).find(([abbrev, full]) => full === fullDay)?.[0] || fullDay;
            setErrors(prev => ({
              ...prev,
              workoutTime: `End time must be after start time for ${abbrevDay}`
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

  const dayAbbreviationToFull = {
    Mon: 'Monday',
    Tue: 'Tuesday',
    Wed: 'Wednesday',
    Thu: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
    Sun: 'Sunday'
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
      <div className="bg-white rounded-xl w-3/4 relative max-h-[90vh] overflow-y-auto shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 z-10 transition-colors"
        >
          <FaTimes size={24} />
        </button>
  
        <div className="flex flex-col p-6 items-center">
          <h2 className="text-center text-xl font-bold mb-0 text-purple-900" style={{ fontFamily: "Inter, sans-serif" }}>
            Add Client Information
          </h2>
          
          <div className="w-full bg-white p-4 rounded-xl relative mx-auto">
            <div className="grid grid-cols-3 gap-4">
              {/* Column 1 */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-bold text-purple-900 flex items-center">
                    First Name
                    {errors.firstName && <span className="text-red-600 text-xs font-normal ml-2">{errors.firstName}</span>}
                  </label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full rounded p-2 border-2 border-purple-300 text-sm h-9 font-medium"
                  />
                </div>
  
                <div>
                  <label className="text-sm font-bold text-purple-900 flex items-center">
                    Last Name
                    {errors.lastName && <span className="text-red-600 text-xs font-normal ml-2">{errors.lastName}</span>}
                  </label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full rounded p-2 border-2 border-purple-300 text-sm h-9 font-medium"
                  />
                </div>
  
                <div>
                  <label className="text-sm font-bold text-purple-900">Age</label>
                  <input
                    name="age"
                    type="number"
                    value={form.age}
                    onChange={handleChange}
                    className="w-full rounded p-2 border-2 border-purple-300 text-sm h-9 font-medium"
                  />
                </div>
              </div>
  
              {/* Column 2 */}
              <div className="space-y-3">
                <div>
                  <label className="flex items-center text-sm font-bold text-purple-900">Weight (lbs)</label>
                  <input
                    name="weight"
                    type="number"
                    value={form.weight}
                    onChange={handleChange}
                    className="w-full rounded p-2 border-2 border-purple-300 text-sm h-9 font-medium"
                  />
                </div>
  
                <div>
                  <label className="flex items-center text-sm font-bold text-purple-900">Height (in)</label>
                  <input
                    name="height"
                    type="number"
                    value={form.height}
                    onChange={handleChange}
                    className="w-full rounded p-2 border-2 border-purple-300 text-sm h-9 font-medium"
                  />
                </div>
  
                <div>
                  <label className="text-sm font-bold text-purple-900">Sex</label>
                  <select
                    name="sex"
                    value={form.sex}
                    onChange={handleChange}
                    className="w-full rounded p-2 border-2 border-purple-300 text-sm h-9 font-medium"
                  >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>N/A</option>
                  </select>
                </div>
              </div>
  
              {/* Column 3 */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-bold text-purple-900 flex items-center">
                    Email
                    {errors.email && <span className="text-red-600 text-xs font-normal ml-2">{errors.email}</span>}
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded p-2 border-2 border-purple-300 text-sm h-9 font-medium"
                  />
                </div>
  
                <div>
                  <label className="text-sm font-bold text-purple-900 flex items-center">
                    Phone
                    {errors.phoneNumber && <span className="text-red-600 text-xs font-normal ml-2">{errors.phoneNumber}</span>}
                  </label>
                  <input
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handlePhoneChange}
                    className="w-full rounded p-2 border-2 border-purple-300 text-sm h-9 font-medium"
                  />
                </div>
  
                <div>
                  <label className="text-sm font-bold text-purple-900">Goal Weight (lbs)</label>
                  <input
                    name="goalWeight"
                    type="number"
                    value={form.goalWeight}
                    onChange={handleChange}
                    className="w-full rounded p-2 border-2 border-purple-300 text-sm h-9 font-medium"
                  />
                </div>
              </div>
            </div>
  
            {/* Second Row - Full Width */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <label className="text-sm font-bold text-purple-900">Activity Level</label>
                <select
                  name="activityLevel"
                  value={form.activityLevel}
                  onChange={handleChange}
                  className="w-full rounded p-1 border-2 border-purple-300 text-sm h-9 font-medium"
                >
                  <option value="">Select</option>
                  <option>Sedentary</option>
                  <option>Slightly active</option>
                  <option>Moderately active</option>
                  <option>Very active</option>
                </select>
              </div>
  
              <div className="col-span-2 flex items-end">
                <div>
                  <label className="text-sm font-bold text-purple-900">Profile Color</label>
                  <div className="flex items-center mt-1">
                    <div className="relative">
                      <div
                        className="w-10 h-10 rounded-full border-2 border-purple-500 cursor-pointer mr-2 shadow-sm"
                        style={{ backgroundColor: form.color }}
                        onClick={() => document.getElementById('colorInput').click()}
                      >
                        <input
                          type="color"
                          id="colorInput"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          value={form.color}
                          onChange={(e) => setForm(prev => ({...prev, color: e.target.value}))}
                        />
                        <img
                          src={pencil_icon}
                          alt="Edit color"
                          className="absolute bottom-0 right-0 w-4 h-4 p-0.5 bg-white rounded-full shadow-sm"
                        />
                      </div>
                    </div>
                    <span className="text-xs text-gray-600">Click to change</span>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Workout Schedule */}
              <div className="mt-6">
                <h3 className="text-sm font-bold mb-3 text-purple-900">Workout Schedule</h3>
                <div className="grid grid-cols-7 gap-2 bg-gray-50 p-3 rounded-lg border-2 border-purple-300">
                  {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(abbrevDay => {
                    const fullDay = dayAbbreviationToFull[abbrevDay];
                    
                    return (
                      <div 
                        key={abbrevDay} 
                        className={`border-2 p-2 rounded-lg text-center ${form.workoutSchedule.some(d => d.day === fullDay) ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
                      >
                        <label className="flex flex-col items-center cursor-pointer text-sm font-medium">
                          <input
                            type="checkbox"
                            className="mr-1 w-4 h-4 accent-purple-600"
                            checked={form.workoutSchedule.some(d => d.day === fullDay)}
                            onChange={(e) => handleDayToggle(fullDay, e.target.checked)}
                          />
                          {abbrevDay}
                        </label>
                        
                        {form.workoutSchedule.some(d => d.day === fullDay) && (
                          <div className="mt-2 space-y-2">
                            <select
                              className="w-full text-xs p-1.5 rounded border-2 border-purple-300 font-medium"
                              value={form.workoutSchedule.find(d => d.day === fullDay)?.startTime || ''}
                              onChange={(e) => handleTimeChange(fullDay, 'startTime', e)}
                            >
                              <option value="">Start</option>
                              {timeOptions.map(time => (
                                <option key={time} value={time}>{time.replace(/:\d{3}\s/, ' ')}</option>
                              ))}
                            </select>
                            
                            <select
                              className="w-full text-xs p-1.5 rounded border-2 border-purple-300 font-medium"
                              value={form.workoutSchedule.find(d => d.day === fullDay)?.endTime || ''}
                              onChange={(e) => handleTimeChange(fullDay, 'endTime', e)}
                            >
                              <option value="">End</option>
                              {timeOptions.map(time => (
                                <option key={time} value={time}>{time.replace(/:\d{3}\s/, ' ')}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {errors.workoutSchedule && (
                  <p className="text-red-600 text-xs mt-2 font-medium">{errors.workoutSchedule}</p>
                )}
                {errors.workoutTime && (
                  <p className="text-red-600 text-xs mt-2 font-medium">{errors.workoutTime}</p>
                )}
              </div>
  
            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button 
                onClick={onClose}
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center border-2 border-purple-700"
              >
                <FaArrowLeft className="mr-2" />Back
              </button>
              <button 
                onClick={handleAddClient}
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center border-2 border-purple-700"
              >
                <FaPlus className="mr-2" /> Add Client
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClientModal;