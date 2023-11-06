import React from 'react'
import { Link } from 'react-router-dom'


export default function Navbar() {

  return (
    <div className = "nav-container">
      <Link to = "/NBA-Betting-App/" className = "nav-buttons">
            <h1>NBA Betting Tracker</h1>
      </Link>
      <div className = "login-section">
          <Link to = "/login" className = "nav-buttons">
              <h2 className = "login">Login</h2>
          </Link>
          <Link to = "/signup" className = "nav-buttons">
              <h2 className = "signup">Signup</h2>
          </Link>
        </div>
    </div>
  )
}


