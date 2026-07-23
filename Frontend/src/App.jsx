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
    <div className="relative min-h-screen bg-stone-50 lg:pt-14">
      <div className="lg:max-w-6xl lg:mx-auto">
        <Routes>
          <Route path='/' element={<Inicio />} />
          <Route path='/StockManager' element={<StockManager />} />
          <Route path='/Contador' element={<ContadorVentas />} />
        </Routes>
      </div>
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
