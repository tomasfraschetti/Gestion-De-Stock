import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Inicio from "./pages/Inicio"
import StockManager from "./pages/StockManager"

function App() {


  return (
    <>
      <Routes>
        <Route path='/' element={<Inicio />}></Route>
        <Route path='/StockManager' element={<StockManager />}></Route>
      </Routes>
    </>
  )
}

export default App
