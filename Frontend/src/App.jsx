import './App.css'
import { Routes, Route } from 'react-router-dom'
import Inicio from "./pages/Inicio"
import StockManager from "./pages/StockManager"
import ContadorVentas from "./pages/ContadorVentas"
import Navbar from "./Navbar"

function App() {
  return (
    <div style={{ position: 'relative', minHeight: '100svh' }}>
      <Routes>
        <Route path='/' element={<Inicio />} />
        <Route path='/StockManager' element={<StockManager />} />
        <Route path='/Contador' element={<ContadorVentas />} />
      </Routes>
      <Navbar />
    </div>
  )
}

export default App
