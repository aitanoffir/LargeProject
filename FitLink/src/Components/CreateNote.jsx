import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import NavBar from "../Components/NavBar";

export default function CreateNote() {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const navigate = useNavigate();

  const handleSave = () => {
    const newNote = { title, content: note };
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    savedNotes.push(newNote);
    localStorage.setItem("notes", JSON.stringify(savedNotes));
    navigate("/Notes");
  };

  const handleBack = () => {
    navigate("/Notes");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <NavBar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6 text-gray-800">Create New Note</h1>

          <div className="mb-4">
            <label htmlFor="note-title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="note-title"
              type="text"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your note"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="note-content" className="block text-sm font-medium text-gray-700 mb-1">
              Note
            </label>
            <textarea
              id="note-content"
              className="w-full h-48 px-4 py-2 border rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Write your note here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleBack}
              className="flex items-center bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
            <button
              onClick={handleSave}
              className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
            >
              <FaSave className="mr-2" /> Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
