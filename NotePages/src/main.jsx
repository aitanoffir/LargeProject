import React from 'react';
import ReactDOM from "react-dom/client";
import App from './App';
import "./index.css";
import { createRoot } from 'react-dom/client';

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
