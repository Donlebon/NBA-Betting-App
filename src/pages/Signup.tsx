import React from 'react'
import App from '../App';
import cat from './cat.jpg'
import { useState } from 'react';
import { projectAuth } from '../firebase/config';
import { useSignup } from '../hooks/useSignup';

export default function Signup() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [displayName, setDisplayName] = useState<string>("")
  const {error, isPending, signup} = useSignup()


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    signup(email, password, displayName)
  }

  return (
    <div className = "login-container"> 
        <img className = "cat" src = {cat}/>
        {error && <p className = "error-signup">{error}</p>}
        <form onSubmit = {handleSubmit}>
          <div>
            <label className = "email-container">
              Email
            <input className = "email" 
            type="email" 
            value = {email}
            onChange = {(e) => setEmail(e.target.value)}
            />
            </label>
          </div>
          <div>
          <label className = "pw-container">
              Password
            <input className = "pw" 
            type="password" 
            value = {password}
            onChange = {(e) => setPassword(e.target.value)}
            />
            </label>
          <label className = "user-container">
              Username
            <input className = "user" 
            type="text" 
            value = {displayName}
            onChange = {(e) => setDisplayName(e.target.value)}
            maxLength = {12}
            />
            </label>
          </div>
            {isPending ? 
            <button className = "login-button" disabled>Loading...</button> :
            <button className = "login-button">Sign Up</button> }
        </form>
    </div>
  )
}
