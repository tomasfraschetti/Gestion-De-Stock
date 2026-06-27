import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import { StockProvider } from './context/StockContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StockProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StockProvider>
  </StrictMode>


)
