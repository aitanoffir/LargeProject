// AddNotesModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const AddNotesModal = ({ client, onClose }) => {
  const [noteContent, setNoteContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/sessionNotes', {
        client: client._id,
        notes: noteContent,
        date: new Date()
      }, {
        headers: { Authorization: token }
      });
      
      onClose();
      alert('Note added successfully!');
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Failed to add note. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4">Add Session Notes</h2>
        <p className="mb-4">For {client.firstName} {client.lastName}</p>
        
        <form onSubmit={handleSubmit}>
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            className="w-full h-32 p-3 border rounded mb-4"
            placeholder="Enter session notes..."
            required
          />
          
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNotesModal;