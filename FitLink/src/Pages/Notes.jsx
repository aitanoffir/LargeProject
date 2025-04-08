import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegTrashAlt, FaRegFolderOpen, FaArrowLeft } from "react-icons/fa";
import NavBar from "../Components/NavBar";
import "../notes.css";

function Notes() {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(savedNotes);
  }, []);

  const handleDelete = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  return (
    <div className="flex">
      {/* Add the NavBar */}
      <NavBar />

      {/* Main content */}
      <div className="notes-container flex-1">
        <h1 className="notes-title">Notes</h1>
        
        {/* Buttons container */}
        <div className="notes-header-container">
          <button className="backButtonNotes" onClick={() => navigate("/Clients")}> 
            <FaArrowLeft /> Back
          </button>
          
          <button className="create-note-button" onClick={() => navigate("/CreateNote")}>
            + Create New Note
          </button>
        </div>

        <div className="notes-table">
          <div className="notes-header">
            <span>Note Title</span>
            <span>Date Modified</span>
            <span>Note</span>
            <span>View/Edit Note</span>
            <span>Delete</span>
          </div>

          {notes.length === 0 ? (
            <p>No notes available. Create one!</p>
          ) : (
            notes.map((note, index) => (
              <div key={index} className="note-row">
                <span>{note.title}</span>
                <span>{new Date().toLocaleDateString()}</span>
                <span className="note-preview">{note.content.slice(0, 50)}...</span>
                <button className="view-note-button" onClick={() => navigate(`/ViewNote/${index}`)}>
                  <FaRegFolderOpen /> View Note
                </button>
                <button className="delete-note-button" onClick={() => handleDelete(index)}>
                  <FaRegTrashAlt />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Notes;