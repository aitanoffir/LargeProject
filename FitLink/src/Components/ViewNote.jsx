// ViewNote.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa"; 
import "../notes.css";

function ViewNote() {
  const { id } = useParams(); // Get the note ID from the URL
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  
  useEffect(() => {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const currentNote = notes[id]; // Get the note by index
    if (currentNote) {
      setTitle(currentNote.title);
      setNote(currentNote.content);
    } else {
      // If no note found, redirect or show an error
      navigate("/Notes"); // Redirect to Notes page if note not found
    }
  }, [id, navigate]);

  const handleSaveChanges = () => {
    const updatedNote = { title, content: note };
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes[id] = updatedNote; // Update the note at the specified index

    localStorage.setItem("notes", JSON.stringify(notes)); // Save updated notes to localStorage
    navigate("/Notes"); // Redirect back to the Notes page after saving changes
  };

  const handleBack = () => {
    navigate("/Notes"); // Navigate back to the Notes page
  };

  return (
    <div className="main-container">
      <h1 className="create-note">Edit Note</h1>
      <div className="flex-row-bf">
        <label className="title" htmlFor="note-title">Title: </label>
        <input
          id="note-title"
          type="text"
          className="textbox"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <textarea
        className="text-box"
        placeholder="Edit your note here..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      ></textarea>
      <div className="flex-row-ed">
        <button className="backButton" onClick={handleBack}>
          <FaArrowLeft className="button-icon" />
          <span>Back</span>
        </button>
        <button className="saveButton" onClick={handleSaveChanges}>
          <FaSave className="button-icon" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}

export default ViewNote;