import React from 'react'
import "../home.css"
import { Link } from 'react-router-dom'
import cat from "../pages/cat.jpg"
import useLogout from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';


export default function Navsidebar() {
  const {user} = useAuthContext()
  const {logout} = useLogout()

  function logOut(){
    logout()
  }
  return (
    <nav className = "nav">

        <img src= {cat} alt="" className = "user-profile"/>

        <h1>{user.displayName}</h1>

        <Link to = "/" className = "home">
            <h3>Home</h3>
        </Link>

        <Link to = "/bets" className = "bet">
            <h3>Open Bets</h3>
        </Link>

        <Link to = "/profits" className = "profit">
            <h3>Profit</h3>
        </Link>

        <button 
        onClick = {logOut}
        className = "logout">Logout</button>

      </nav>
  )
}
