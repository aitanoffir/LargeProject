// Notes.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Notes() {
  const [notes, setNotes] = useState([]);  // Initialize state to store notes
  const navigate = useNavigate();

  // Fetch the saved notes from localStorage when the component mounts
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(savedNotes);
  }, []);

  return (
    <div>
      <h1>Notes</h1>
      <button onClick={() => navigate("/CreateNote")}>Create New Note</button>

      {/* Display the list of notes */}
      <div>
        <h2>Saved Notes:</h2>
        {notes.length === 0 ? (
          <p>No notes available. Create one!</p>
        ) : (
          <ul>
            {notes.map((note, index) => (
              <li key={index}>
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <button onClick={() => navigate(`/ViewNote/${index}`)}>View Note</button>
                <button
                  onClick={() => {
                    // Delete the note from localStorage and update state
                    const updatedNotes = notes.filter((_, i) => i !== index);
                    localStorage.setItem("notes", JSON.stringify(updatedNotes));
                    setNotes(updatedNotes);  // Update state to re-render the list
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Notes;
