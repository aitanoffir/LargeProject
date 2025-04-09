import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegTrashAlt, FaRegFolderOpen, FaArrowLeft } from "react-icons/fa";
import NavBar from "../Components/NavBar";

const Notes = () => {
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
    <div className="flex h-screen bg-gray-100">
      <NavBar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">My Notes</h1>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/Clients")}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center"
              >
                <FaArrowLeft className="mr-2" /> Back to Clients
              </button>
              <button
                onClick={() => navigate("/CreateNote")}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
              >
                + Create New Note
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Title', 'Date Modified', 'Preview', 'View/Edit', 'Delete'].map(header => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {notes.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No notes available. Create one!
                    </td>
                  </tr>
                ) : (
                  notes.map((note, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{note.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date().toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{note.content.slice(0, 50)}...</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => navigate(`/ViewNote/${index}`)}
                          className="text-blue-500 hover:underline flex items-center"
                        >
                          <FaRegFolderOpen className="mr-1" /> View
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaRegTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notes;
