import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#13131F',
          color: '#C8C8E8',
          border: '1px solid #1E1E30',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '14px',
        },
        success: {
          iconTheme: { primary: '#F5C842', secondary: '#0D0D14' },
        },
      }}
    />
  </React.StrictMode>
)
