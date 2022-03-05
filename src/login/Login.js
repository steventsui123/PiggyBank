import React, { useState, useContext, useLayoutEffect} from "react";
import { LoginStatusContext } from "../context/LoginContext";
import { useNavigate } from "react-router-dom";
import Axios from 'axios';
import './login.css';



export default function Login(){

    const navigate = useNavigate()
    Axios.defaults.withCredentials = true;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {loginStatus, setLoginStatus} = useContext(LoginStatusContext);
    const [loginDisplay, setLoginDisplay] = useState("");

    useLayoutEffect(() => {
        if (loginStatus){
            navigate('/profile')
            window.location.reload()
        }
    })

    const login_post = () => {
        Axios.post('http://localhost:3001/login', {
            email: email, 
            password: password,

        }).then((response) => {

            if (response.data.auth) {
                setLoginStatus(true)
                localStorage.setItem("token", response.data.token)
                navigate('/profile')
            }else{
                setLoginDisplay("Email Address / Password does not exist")
                setLoginStatus(false)
            }
        })
    }

    const userAuth = () => {
        Axios.get("http://localhost:3001/auth", {
            headers: {
                "x-access-token" : localStorage.getItem("token")
            }
        }).then((response) => {
            console.log (response.data);
        })
    }

    const [mask, setMask] = useState(true)

    const PasswordToggle = () => {
    
        setMask(!mask)
    }
    
    return (
        <div className="login">
        <div className="loginContainer">
            <div className="logintitle">Login</div>
                <div className="email">
                    <input type="text" placeholder="Email Address" onChange={(e) => {
                        setEmail(e.target.value);
                    }} className="emailType"/>
                </div>
                <div className="password">
                    <input type={mask ? "password" : "text"} placeholder="Passsword" onChange={(e) => {
                        setPassword(e.target.value);
                    }} className="passwordType"/>
                    <span className={mask ? "far fa-eye" : "far fa-eye-slash"} onClick={PasswordToggle}/>
                </div>
                <div className="msg">{loginDisplay ? loginDisplay : ""}</div>
            <div>
            <button className="loginbutton" onClick={login_post}> Login </button>
            </div>
            <div>
                <a className="go-register" href="/register">Don't have an account?</a>
                <a className="resetpassword" href="/resetpassword">Forgot Password</a>
            </div>
        </div>
        </div>
    )
}