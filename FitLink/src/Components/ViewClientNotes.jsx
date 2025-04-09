import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaSave } from 'react-icons/fa';

const ViewClientNotes = ({ client, onClose, onSaveNote, onDeleteNote }) => {
  const [newNoteMode, setNewNoteMode] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    console.log('Current client notes:', client.notes);
  }, [client.notes]);

  const handleAddNewNote = () => {
    setNewNoteMode(true);
    setNoteTitle('');
    setNoteContent('');
    setEditingNoteId(null);
  };

  const handleEditNote = (note) => {
    setEditingNoteId(note._id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNewNoteMode(false);
  };

  const handleCancelEdit = () => {
    setNewNoteMode(false);
    setEditingNoteId(null);
  };

  const handleSave = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      alert('Please enter both title and content');
      return;
    }

    setIsProcessing(true);
    console.log('Saving note:', { title: noteTitle, content: noteContent });

    try {
      await onSaveNote({
        clientId: client._id,
        title: noteTitle,
        content: noteContent,
        noteId: editingNoteId
      });
      handleCancelEdit();
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (noteId) => {
    // if (window.confirm('Are you sure you want to delete this note?')) {
      setIsProcessing(true);
      console.log('Deleting note:', noteId);
      
      try {
        await onDeleteNote(client._id, noteId);
      } catch (error) {
        console.error('Error deleting note:', error);
      } finally {
        setIsProcessing(false);
      }
    // }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Notes for {client.firstName} {client.lastName}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            disabled={isProcessing}
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mb-4">
          {(newNoteMode || editingNoteId) ? (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <input
                type="text"
                placeholder="Note Title"
                className="w-full p-2 mb-2 border rounded"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                disabled={isProcessing}
              />
              <textarea
                placeholder="Write your note here..."
                className="w-full p-2 border rounded min-h-[150px]"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                disabled={isProcessing}
                data-gramm="false"
                data-gramm_editor="false"
                data-enable-grammarly="false"
              />
              <div className="flex justify-end mt-2 gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border rounded flex items-center gap-2"
                  disabled={isProcessing}
                >
                  <FaTimes /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-black text-white rounded flex items-center gap-2 disabled:opacity-50"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    'Processing...'
                  ) : (
                    <>
                      <FaSave /> {editingNoteId ? 'Update Note' : 'Save Note'}
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleAddNewNote}
              className="mb-4 px-4 py-2 bg-black text-white rounded flex items-center gap-2"
              disabled={isProcessing}
            >
              <FaPlus /> Add New Note
            </button>
          )}

          {client.notes?.length > 0 ? (
            <div className="space-y-4">
              {client.notes
                .slice() // Create a copy to avoid mutating original array
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((note) => (
                <div key={note._id} className="border border-gray-200 rounded-lg p-4">
                  {editingNoteId === note._id ? null : (
                    <>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{note.title}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(note.updatedAt).toLocaleDateString()} •{' '}
                            {new Date(note.updatedAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditNote(note)}
                            className="text-blue-600 hover:text-blue-800"
                            disabled={isProcessing}
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(note._id)}
                            className="text-red-600 hover:text-red-800"
                            disabled={isProcessing}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 p-3 bg-gray-50 rounded">
                        <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            !newNoteMode && (
              <div className="text-center py-8">
                <p className="text-gray-500">No notes found for this client.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Add your first note using the button above
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewClientNotes;