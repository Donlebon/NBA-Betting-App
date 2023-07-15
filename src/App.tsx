import React from 'react';
import './login.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './Components/Navbar';  
import { useAuthContext } from './hooks/useAuthContext';
import Home from './pages/Home';
import Navsidebar from './Components/Navsidebar';
import OpenBets from './pages/OpenBets';
import Profit from './pages/Profit';
import Games from './pages/Games';

function App() {

  const {user, dispatch, authIsReady} = useAuthContext()

  return (
      <>
      {authIsReady && ( <BrowserRouter>
        {user === null ? (
          <>
            <Navbar/>
            <Routes>
              <Route path = "/" element = {<Login />} />
              <Route path = "/login" element = {<Login />} />
              <Route path = "/signup" element = {<Signup />} />
            </Routes> 
          </>
          ) 
          : 
          (
            <div className = "container">
              <Navsidebar />
              <Routes>
                <Route path = "/" element = {<Games />} />
                <Route path = "/bets" element = {<OpenBets />} />
                <Route path = "/profits" element = {<Profit />} />
              </Routes>
              {/* <Usersidebar /> */}
          </div>
          )
        }
        </BrowserRouter>
      )}
      </>
  )

}


export default App;

