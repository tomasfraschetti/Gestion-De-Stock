import './App.css'
import { Routes, Route } from 'react-router-dom'
import Inicio from "./pages/Inicio"
import StockManager from "./pages/StockManager"
import Resumen from "./pages/Resumen"
import ContadorVentas from "./pages/ContadorVentas"
import Navbar from "./Navbar" // Importación directa ahora

function App() {
  return (
    <div className="app-container" style={{ minHeight: '100vh', position: 'relative', paddingBottom: '80px' }}>
      <Routes>
        <Route path='/' element={<Inicio />}></Route>
        <Route path='/StockManager' element={<StockManager />}></Route>
        <Route path='/Resumen' element={<Resumen />}></Route>
        <Route path='/Contador' element={<ContadorVentas />}></Route>
      </Routes>
      <Navbar />
    </div>
  )
}

export default App
