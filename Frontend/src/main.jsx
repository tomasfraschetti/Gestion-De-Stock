import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router-dom"
import { StockProvider } from './context/StockContext.jsx'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

// Registrar Service Worker con auto-update
registerSW({ immediate: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StockProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StockProvider>
  </StrictMode>
)
