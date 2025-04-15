// Calendar.jsx
import React, { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  parseISO
} from "date-fns";
import NavBar from "../Components/NavBar";
import { useNavigate } from "react-router-dom";
import { FaAngleLeft, FaAngleRight, FaPlus, FaTimes, FaRegTrashAlt, FaGoogle } from "react-icons/fa";
import { FaArrowsRotate } from "react-icons/fa6";


const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showPrompt, setShowPrompt] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [newEventEndTime, setNewEventEndTime] = useState("");
  const [newEventLocation, setNewEventLocation] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    console.log("Token from URL:", token);
    if (token) {

      localStorage.setItem("token", token);

      // Clean the URL
      navigate("/Calendar", { replace: true });
    }
    const fetchEvents = async () => {
      try {
        const jwt = localStorage.getItem("token");
        const res = await fetch("http://localhost:7000/api/accounts/calendar/events", {
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        });

        if (!res.ok) {
          setShowPrompt(true);
          return;
        }

        const data = await res.json();

        if (data.success && data.events) {
          const formattedEvents = data.events.map(event => ({
            id: event.id,
            title: event.summary,
            date: event.start?.date || event.start?.dateTime,
            end: event.end?.date || event.end?.dateTime,
            location: event.location,
            description: event.description
          }));

          setEvents(formattedEvents);
        } else {
          setShowPrompt(true);
        }
      } catch (err) {
        console.error("Failed to fetch calendar events:", err);
        setShowPrompt(true);
      }
    };

    fetchEvents();
  }, []);

  const addEvent = async () => {
    const jwt = localStorage.getItem("token");
    const localStart = new Date(`${format(selectedDate, "yyyy-MM-dd")}T${newEventTime}`);
    const localEnd = new Date(`${format(selectedDate, "yyyy-MM-dd")}T${newEventEndTime}`);
    const estStart = new Date(localStart.toLocaleString("en-US", { timeZone: "America/New_York" }));
    const estEnd = new Date(localEnd.toLocaleString("en-US", { timeZone: "America/New_York" }));

    const newEvent = {
      summary: newEventTitle,
      location: newEventLocation,
      description: newEventDescription,
      start: { dateTime: estStart.toISOString(), timeZone: "America/New_York" },
      end: { dateTime: estEnd.toISOString(), timeZone: "America/New_York" },
      extendedProperties: { private: { appId: "fitlink" } }
    };

    const res = await fetch("http://localhost:7000/api/accounts/calendar/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`
      },
      body: JSON.stringify(newEvent)
    });

    const data = await res.json();
    if (data.success) {
      setEvents(prev => [
        ...prev,
        {
          id: data.event.id, // <-- Store the real Google event ID
          title: newEvent.summary,
          date: estStart.toISOString(),
          end: estEnd.toISOString(),
          location: newEvent.location,
          description: newEvent.description
        }
      ]);

      setNewEventTitle("");
      setNewEventTime("");
      setNewEventEndTime("");
      setNewEventLocation("");
      setNewEventDescription("");
      setSelectedDate(null);
    }
  };

  const updateEvent = async () => {
    const jwt = localStorage.getItem("token");
    const localStart = new Date(`${format(selectedDate, "yyyy-MM-dd")}T${newEventTime}`);
    const localEnd = new Date(`${format(selectedDate, "yyyy-MM-dd")}T${newEventEndTime}`);
    const estStart = new Date(localStart.toLocaleString("en-US", { timeZone: "America/New_York" }));
    const estEnd = new Date(localEnd.toLocaleString("en-US", { timeZone: "America/New_York" }));

    const updatedEvent = {
      summary: newEventTitle,
      location: newEventLocation,
      description: newEventDescription,
      start: { dateTime: estStart.toISOString(), timeZone: "America/New_York" },
      end: { dateTime: estEnd.toISOString(), timeZone: "America/New_York" },
    };

    const res = await fetch(`http://localhost:7000/api/accounts/calendar/event/${editingEvent.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`
      },
      body: JSON.stringify(updatedEvent)
    });

    const data = await res.json();
    if (data.success) {
      setEvents(events.map(e => e.id === editingEvent.id
        ? { ...updatedEvent, id: editingEvent.id, title: updatedEvent.summary, date: estStart.toISOString() }
        : e
      ));
      clearEventForm();
    }
  };
  const clearEventForm = () => {
    setNewEventTitle("");
    setNewEventTime("");
    setNewEventEndTime("");
    setNewEventLocation("");
    setNewEventDescription("");
    setSelectedDate(null);
    setEditingEvent(null);
  };



  const deleteEvent = async (eventId) => {
    const jwt = localStorage.getItem("token");
    await fetch(`http://localhost:7000/api/accounts/calendar/event/${eventId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    setEvents(events.filter(e => e.id !== eventId));
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center px-4 py-2 border-b border-purple-900 bg-white mt-15">
      <button onClick={() => setCurrentDate(subMonths(currentDate, 1))}><FaAngleLeft className="cursor-pointer text-2xl text-purple-600 hover:text-purple-800" /></button>
      <h2 className="text-center text-2xl font-bold mb-0 text-purple-900">{format(currentDate, "MMMM yyyy")}</h2>
      <button onClick={() => setCurrentDate(addMonths(currentDate, 1))}><FaAngleRight className="cursor-pointer text-2xl text-purple-600 hover:text-purple-800" /></button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const dateFormat = "EEE";
    const startDate = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="px-2 py-1 md:px-6 md:py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="grid grid-cols-7 bg-gray-100 p-2 border-l border-r">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        const cloneDay = new Date(day);
        const dayEvents = events.filter(event => isSameDay(new Date(event.date), cloneDay));

        days.push(
          <button
            key={day.toISOString()}
            className={`p-2 border h-24 relative text-sm overflow-hidden cursor-pointer text-left w-full ${!isSameMonth(day, monthStart) ? "bg-gray-100 text-gray-400" : "bg-white"
              }`}
            onClick={() => {
              setSelectedDate(cloneDay);
              setShowModal(true); // Show the modal automatically when a day is clicked
            }}
          >
            <div className="absolute top-1 left-1 text-xs font-medium uppercase tracking-wider">{formattedDate}</div>
            <div className="absolute top-6 left-0 right-0 overflow-y-auto text-xs space-y-1 max-h-16">
              {dayEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="bg-purple-100 rounded ml-1 mr-1 px-1 h-5 text-purple-700 font-bold truncate flex justify-between items-center tracking-wider"
                >
                  <span onClick={(e) => {
                    e.stopPropagation();
                    setEditingEvent(event);
                    setSelectedDate(new Date(event.date));
                    setNewEventTitle(event.title);
                    setNewEventTime(format(new Date(event.date), "HH:mm"));
                    setNewEventEndTime(format(new Date(event.end), "HH:mm")); // You'll need to include `end` in the event object when storing.
                    setNewEventLocation(event.location || "");
                    setNewEventDescription(event.description || "");
                    setShowModal(true);
                  }}>
                    {event.title}
                  </span>

                </div>
              ))}
            </div>
          </button>
        );

        day = addDays(day, 1);
      }

      rows.push(
        <div key={day} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }

    return <div className="border-t grid bg-gray-300">{rows}</div>;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-20 bg-black">
        <NavBar />
      </div>
      <div className="flex-1 overflow-y-auto">
        <header className="ml-5 bg-white shadow-sm">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800 ">
              My Calendar
            </h1>

          </div>
        </header>
        <div className="max-w-5xl mx-auto mt-4 shadow rounded bg-grey-100">
          {showPrompt ? (
            <div className="mt-15 p-4 text-center font-semibold text-red-600">
              <p>You must log in with Google to use the calendar. <br /> Our calendar links to your Google calendar therefore you must login with a valid Google account for this feature to work.</p>
              <div className="flex justify-center">
                <button
                  onClick={async () => {
                    const jwt = localStorage.getItem("token");
                    const res = await fetch("http://localhost:7000/api/accounts/link/google/init", {
                      headers: {
                        Authorization: `${jwt}`,
                      },
                    });
                    const data = await res.json();
                    if (data.url) {
                      window.location.href = data.url;
                    }
                  }}
                  className="mt-5 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center border-2 border-purple-700"
                >
                  <FaGoogle className="mr-3" /> Log in with Google
                </button>
                </div>
            </div>
          ) : (
            <>
              {renderHeader()}
              {renderDays()}
              {renderCells()}


              {showModal && selectedDate && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="p-5 bg-white rounded-2xl shadow-lg mt-8 mb-8">
                    <h3 className="text-center text-xl font-semibold mb-0 text-purple-900 mt-5">Add Event for {format(selectedDate, "PPP")}</h3>
                    <input
                      type="text"
                      className="w-full rounded p-2 border-2 border-purple-300 text-sm h-9 font-medium mt-2"
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      placeholder="Event Title"
                    />
                    <input
                      type="time"
                      className="w-full rounded p-2 border-2 border-purple-300 text-sm h-9 font-medium mt-2"
                      value={newEventTime}
                      onChange={(e) => setNewEventTime(e.target.value)}
                      placeholder="Start Time"
                    />
                    <input
                      type="time"
                      className="w-full rounded p-2 border-2 border-purple-300 text-sm h-9 font-medium mt-2"
                      value={newEventEndTime}
                      onChange={(e) => setNewEventEndTime(e.target.value)}
                      placeholder="End Time"
                    />
                    <input
                      type="text"
                      className="w-full rounded p-2 border-2 border-purple-300 text-sm h-9 font-medium mt-2"
                      value={newEventLocation}
                      onChange={(e) => setNewEventLocation(e.target.value)}
                      placeholder="Location (Optional)"
                    />
                    <textarea
                      className="w-full rounded p-2 border-2 border-purple-300 text-sm font-medium mt-2"
                      value={newEventDescription}
                      onChange={(e) => setNewEventDescription(e.target.value)}
                      placeholder="Notes (Optional)"
                    />
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={clearEventForm}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center border-2 border-purple-700"
                      >
                        <FaTimes className="mr-2" /> Cancel
                      </button>

                      <div className="flex gap-3">
                        {editingEvent && (
                          <button
                            onClick={() => {
                              deleteEvent(editingEvent.id);
                              clearEventForm();
                            }}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center border-2 border-purple-700"
                          >
                            <FaRegTrashAlt className="mr-2" /> Delete Event
                          </button>
                        )}

                        {editingEvent ? (
                          <button
                            onClick={updateEvent}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center border-2 border-purple-700"
                          >
                            <FaArrowsRotate className="mr-2" /> Update Event
                          </button>
                        ) : (
                          <button
                            onClick={addEvent}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center border-2 border-purple-700"
                          >
                            <FaPlus className="mr-2" /> Add Event
                          </button>
                        )}
                      </div>
                    </div>


                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
