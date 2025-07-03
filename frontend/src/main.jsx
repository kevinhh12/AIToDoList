import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { ToDoProvider } from './context/ToDoContext.tsx'
import { AIProvider } from './context/AIContext.tsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AIProvider>
        <ToDoProvider >
          <App />
        </ToDoProvider> 
      </AIProvider>
    </AuthProvider>
  </StrictMode>,
)
