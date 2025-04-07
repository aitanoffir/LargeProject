// CreateNote.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa"; 
import "../notes.css";

export default function CreateNote() {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const navigate = useNavigate();

  const handleSave = () => {
    // Create a new note object
    const newNote = { title, content: note };
    
    // Get existing notes from localStorage, or initialize an empty array
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];

    // Add the new note to the saved notes array
    savedNotes.push(newNote);

    // Save the updated notes array back to localStorage
    localStorage.setItem("notes", JSON.stringify(savedNotes));

    // Redirect to the Notes page
    navigate("/Notes");
  };

  const handleBack = () => {
    navigate("/Notes");
  };

  return (
    <div className="main-container">
      <h1 className="create-note">Create Note</h1>
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
        placeholder="Write your note here..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      ></textarea>
      <div className="flex-row-ed">
        <button className="backButton" onClick={handleBack}>
          <FaArrowLeft className="button-icon" />
          <span>Back</span>
        </button>
        <button className="saveButton" onClick={handleSave}>
          <FaSave className="button-icon" />
          <span>Save Note</span>
        </button>
      </div>
    </div>
  );
}