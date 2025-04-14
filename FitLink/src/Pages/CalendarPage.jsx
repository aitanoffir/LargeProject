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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const jwt = localStorage.getItem("jwt");
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
    const jwt = localStorage.getItem("jwt");
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
    const jwt = localStorage.getItem("jwt");
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
    const jwt = localStorage.getItem("jwt");
    await fetch(`http://localhost:7000/api/accounts/calendar/event/${eventId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    setEvents(events.filter(e => e.id !== eventId));
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center px-4 py-2 border-b bg-white">
      <button onClick={() => setCurrentDate(subMonths(currentDate, 1))}>&lt;</button>
      <h2 className="text-2xl font-semibold text-gray-800">{format(currentDate, "MMMM yyyy")}</h2>
      <button onClick={() => setCurrentDate(addMonths(currentDate, 1))}>&gt;</button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const dateFormat = "EEE";
    const startDate = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-sm font-semibold text-gray-600">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="grid grid-cols-7 bg-gray-100 p-2">{days}</div>;
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
            className={`p-2 border h-24 relative text-sm overflow-hidden cursor-pointer text-left w-full ${
              !isSameMonth(day, monthStart) ? "bg-gray-100 text-gray-400" : "bg-white"
            }`}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <div className="text-xs font-bold">{formattedDate}</div>
            <div className="absolute top-6 left-0 right-0 overflow-y-auto text-xs space-y-1 max-h-16">
              {dayEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="bg-blue-100 rounded px-1 text-blue-700 truncate flex justify-between items-center"
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
                  }}>
                    {event.title}
                  </span>

                  <button className="ml-2 text-red-500" onClick={(e) => { e.stopPropagation(); deleteEvent(event.id); }}>x</button>
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

    return <div className="border-t border-l grid gap-px bg-gray-300">{rows}</div>;
  };

  return (
    <div className="flex h-screen">
      <div className="w-20 bg-black">
        <NavBar />
      </div>
      <div className="flex-1 overflow-y-auto">
      <header className="bg-white shadow-sm px-6 py-6 ml-20">
          <h1 className="text-2xl font-semibold text-gray-800">My Calendar</h1>
        </header>
        <div className="max-w-5xl mx-auto mt-4 shadow rounded bg-white">
          {showPrompt ? (
            <div className="p-4 text-center text-red-600">
              <p>You must log in with Google to use the calendar.</p>
              <button
                onClick={async () => {
                  const jwt = localStorage.getItem("jwt");
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
                className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Log in with Google
              </button>
            </div>
          ) : (
            <>
              {renderHeader()}
              {renderDays()}
              {renderCells()}
              {selectedDate && (
                <div className="p-4 border-t">
                  <h3 className="font-semibold">Add Event for {format(selectedDate, "PPP")}</h3>
                  <input
                    type="text"
                    className="border p-2 rounded w-full mt-2"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="Event Title"
                  />
                  <input
                    type="time"
                    className="border p-2 rounded w-full mt-2"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    placeholder="Start Time"
                  />
                  <input
                    type="time"
                    className="border p-2 rounded w-full mt-2"
                    value={newEventEndTime}
                    onChange={(e) => setNewEventEndTime(e.target.value)}
                    placeholder="End Time"
                  />
                  <input
                    type="text"
                    className="border p-2 rounded w-full mt-2"
                    value={newEventLocation}
                    onChange={(e) => setNewEventLocation(e.target.value)}
                    placeholder="Location (Optional)"
                  />
                  <textarea
                    className="border p-2 rounded w-full mt-2"
                    value={newEventDescription}
                    onChange={(e) => setNewEventDescription(e.target.value)}
                    placeholder="Notes (Optional)"
                  />
                  {editingEvent ? (
                    <button onClick={updateEvent} className="mt-2 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
                      Update Event
                    </button>
                  ) : (
                    <button onClick={addEvent} className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                      Add Event
                    </button>
                  )}
                  <button onClick={clearEventForm} className="mt-2 ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
                    Cancel
                  </button>

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
