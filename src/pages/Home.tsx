import React from 'react'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import "../home.css"
import cat from './cat.jpg'
import Navsidebar from '../Components/Navsidebar';
import Games from './Games';



export default function Home() {

  return (
    <div className = "container">
      <Navsidebar />
      <Games />
    </div>
  )
}