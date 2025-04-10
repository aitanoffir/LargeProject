import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaSave } from 'react-icons/fa';

const ViewClientNotes = ({ client, onClose, onSaveNote, onDeleteNote }) => {
  const [newNoteMode, setNewNoteMode] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    console.log('Current client notes:', client.notes);
  }, [client.notes]);

  const handleAddNewNote = () => {
    setNewNoteMode(true);
    setNoteTitle('');
    setNoteContent('');
    setEditingNoteId(null);
    setErrors(prev => ({ ...prev, note: null }));
  };

  const handleEditNote = (note) => {
    setEditingNoteId(note._id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNewNoteMode(false);
    setErrors(prev => ({ ...prev, note: null }));
  };

  const handleCancelEdit = () => {
    setNewNoteMode(false);
    setEditingNoteId(null);
    setErrors(prev => ({ ...prev, note: null }));
  };

  const handleSave = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      setErrors(prev => ({ ...prev, note: 'Please enter both title and content' }));
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
    setIsProcessing(true);
    console.log('Deleting note:', noteId);
    
    try {
      await onDeleteNote(client._id, noteId);
    } catch (error) {
      console.error('Error deleting note:', error);
    } finally {
      setIsProcessing(false);
    }
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
                onChange={(e) => {
                  setNoteTitle(e.target.value);
                  setErrors(prev => ({ ...prev, note: null }));
                }}
                disabled={isProcessing}
              />
              <textarea
                placeholder="Write your note here..."
                className="w-full p-2 border rounded min-h-[150px]"
                value={noteContent}
                onChange={(e) => {
                  setNoteContent(e.target.value);
                  setErrors(prev => ({ ...prev, note: null }));
                }}
                disabled={isProcessing}
                data-gramm="false"
                data-gramm_editor="false"
                data-enable-grammarly="false"
              />
              {/* Error text shown below the textarea */}
              {errors.note && (
                <p className="text-red-600 text-xs mt-2 font-medium">{errors.note}</p>
              )}
              <div className="flex justify-end mt-2 gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 border rounded flex items-center gap-2"
                  disabled={isProcessing}
                >
                  <FaTimes /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 bg-black text-white rounded flex items-center gap-2 disabled:opacity-50"
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
              className="bg-purple-600 hover:bg-purple-700 mb-4 px-4 py-2 text-white rounded flex items-center gap-2"
              disabled={isProcessing}
            >
              <FaPlus /> Add New Note
            </button>
          )}

          {client.notes?.length > 0 ? (
            <div className="space-y-4">
              {client.notes
                .slice()
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
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 flex items-center gap-1 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit</span>
                        </button>
                          <button
                            onClick={() => handleDelete(note._id)}
                            className="text-red-600 hover:text-red-800"
                            disabled={isProcessing}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
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
