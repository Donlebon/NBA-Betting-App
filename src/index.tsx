import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './login.css';
import { AuthContextProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);
