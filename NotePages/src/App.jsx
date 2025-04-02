import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from 'react';
import CreateNote from './Components/CreateNote';
import Notes from "./Components/Notes";
import ViewNote from "./Components/ViewNote";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/Notes" />} />
        <Route path="/CreateNote" element={<CreateNote />} />
        <Route path="/Notes" element={<Notes />} />
        <Route path="/ViewNote/:id" element={<ViewNote />} />
      </Routes>
    </Router>
  );
}

export default App;
