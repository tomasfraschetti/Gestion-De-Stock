import './App.css'
import { Routes, Route } from 'react-router-dom'
import Inicio from "./pages/Inicio"
import StockManager from "./pages/StockManager"
import ContadorVentas from "./pages/ContadorVentas"
import Navbar from "./components/Navbar"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <div style={{ position: 'relative', minHeight: '100svh' }}>
      <Routes>
        <Route path='/' element={<Inicio />} />
        <Route path='/StockManager' element={<StockManager />} />
        <Route path='/Contador' element={<ContadorVentas />} />
      </Routes>
      <Navbar />
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  )
}

export default App

