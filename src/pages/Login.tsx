import React from 'react'
import { useState } from 'react';
import App from '../App';
import cat from './cat.jpg'
import { Link } from 'react-router-dom';
import useLogin from '../hooks/useLogin';

export default function Login() {
  const [userInput, setUserInput] = useState('')
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const {login, error, isPending} = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(email, password)
  }

  return (
    <div className = "login-container"> 
        <img className = "cat" src = {cat}/>
        {error && <p className = "error-login">{error}</p>}
        <form onSubmit = {handleSubmit}>
          <div>
            <label className = "email-container">
              Email
            <input className = "email" 
            type="email" 
            onChange = {(e) => {setEmail(e.target.value)}}
            value = {email}
            />
            </label>
          </div>
          <div>
            <label className = "pw-container">
              Password
            <input className = "pw" 
            type="password" 
            onChange = {(e) => setPassword(e.target.value) }
            value = {password}
            />
            </label>
          </div>
            {isPending ? 
            <button className = "login-button" disabled>Loading...</button> :
            <button className = "login-button">Login</button> }
            <h3 className = "member">Not a member? 
            
            <span>
              <Link to = "/signup" className = "signup-member-button">
                <h3 className = "signup-member">Sign Up</h3>
              </Link>
            </span>
            </h3>
            
        </form>
    </div>


  )
}
