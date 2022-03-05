import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import './App.css';
import Navbar from './comps/NavBar';
import LoginNavbar from './comps/LoginNavBar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import Service from './pages/Service';
import Feature from './pages/Feature';
import Login from './login/Login';
import Register from './login/Register';
import Profile from './pages/Profile';
import ResetPassword from './login/ResetPassword';
import NotFound from './pages/NotFound';

import Account from './pages/FAQ/Account';
import Development from './pages/FAQ/Development';
import General from './pages/FAQ/General';
import Insurance from './pages/FAQ/Insurance';
import Loan from './pages/FAQ/Loan';
import Transaction from './pages/FAQ/Transaction';
import Estatement from './pages/FAQ/Estatement';
import Security from './pages/FAQ/Security'

import {LoginStatusContext} from "./context/LoginContext";
import {LoginIDContext} from "./context/LoginContext";

function App() {

  const [loginStatus, setLoginStatus] = useState(false);
  const [loginID, setLoginID] = useState(null);

  Axios.defaults.withCredentials = true;

    useEffect(()=> {
        Axios.get("http://localhost:3001/loggedin")
        .then((response) => {
              setLoginStatus(response.data.loggedIn);
            if (response.data.user){
              setLoginID(response.data.user[0].user_id)
            }else{
              setLoginID(0)
            }
        })
    })

  return (
    <BrowserRouter>
    <LoginStatusContext.Provider value={{loginStatus, setLoginStatus}}>
      <LoginIDContext.Provider value={{loginID, setLoginID}}>
        {loginStatus ? (<LoginNavbar />) : (<Navbar />) }
        <Routes>
          <Route path='/' element={<Home />} exact />
          <Route path='/about' element={<About />}/>
          <Route path='/service' element={<Service />}/>
          <Route path='/feature' element={<Feature />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/profile' element={<Profile />}/>
          <Route path='/resetpassword' element={<ResetPassword />}/>
          <Route path='*' element={<NotFound />}/>

          <Route path='/support=account' element={<Account />}/>
          <Route path='/support=development' element={<Development />}/>
          <Route path='/support=general' element={<General />}/>
          <Route path='/support=insurance' element={<Insurance />}/>
          <Route path='/support=loan' element={<Loan />}/>
          <Route path='/support=transaction' element={<Transaction />}/>
          <Route path='/support=estatement' element={<Estatement />}/>
          <Route path='/support=security' element={<Security />}/>
        </Routes>
        </LoginIDContext.Provider>
      </LoginStatusContext.Provider>
    </BrowserRouter>
  );
}



export default App;
