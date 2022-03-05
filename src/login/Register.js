import React, { useState } from "react";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import './register.css';


const Register = () => {

    const navigate = useNavigate()

    const [emailReg, setEmailReg] = useState('')
    const [passwordReg, setPasswordReg] = useState('')
    const [Confirmpassword, setConfirmPassword] = useState('')
    const [firstnameReg, setfirstnameReg] = useState('')
    const [lastnameReg, setlastnameReg] = useState('')

    const [confirmPasswordMsg, setConfirmPasswordMsg] = useState('')
    const [emailMsg, setEmailMsg] = useState('')
    const [passwordMsg, setPasswordMsg] = useState('')
    const [userInfoMsg, setuserInfoMsg] = useState('')
    const [mask, setMask] = useState(true);
    const [mask2, setMask2] = useState(true);

    
    const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const infoRegex = /^[a-zA-Z0-9 ]+$/
    const PasswordToggle = () => {setMask(!mask)}
    const ConfirmPasswordToggle = () => {setMask2(!mask2)}

    const checkReg = async () => {
        setPasswordMsg("")
        setEmailMsg("")
        setuserInfoMsg("")
        setConfirmPasswordMsg("")

        Axios.post('http://localhost:3001/registered',{
            cemail: emailReg
        }).then((response) =>{
            if(response.data[0]){
                setEmailMsg("Email Address already existed.")
            }
        })

        if (Confirmpassword !== passwordReg){
            setConfirmPasswordMsg("Password and cofirm password does not match.")}
        if(!passwordReg){
            setPasswordMsg("Password is required.")}
        if (!emailReg){
            setEmailMsg("Email Adress is required.")}
        if (!firstnameReg || !lastnameReg){
            setuserInfoMsg("User Information is required.")
        }else{
        if(passwordReg.length < 8){
            setPasswordMsg("Password should be at least 8characters long.")}
        if(!emailRegex.test(emailReg)){
            setEmailMsg("Email Address is invalid.")}
        if(!infoRegex.test(firstnameReg) || !infoRegex.test(lastnameReg)){
            setuserInfoMsg("User Information should not contain any special characters except space.")}
        else if(firstnameReg.length > 30 || lastnameReg.length > 20){
            setuserInfoMsg("User Information is too long.")}

        if (passwordReg.length >= 8 && emailRegex.test(emailReg) && infoRegex.test(firstnameReg) && infoRegex.test(lastnameReg) && firstnameReg.length < 30 && lastnameReg.length < 20 && Confirmpassword === passwordReg){
            register_post()
            }
    
        }
    }

    const register_post = () => {

        Axios.post('http://localhost:3001/register', {
            email: emailReg, 
            password: passwordReg,
            firstname: firstnameReg,
            lastname: lastnameReg
        }).then((response) => {
            if (!response.data){
                navigate('/login')
            }
        })
    }

    return (
        <div className="register">
            <div className="regContainer">
                <div className="logintitle">Registeration</div>
                    <h5>User Information</h5>
                <div className="regname">
                    <div className="firstname">
                        <input type="text" placeholder="Firstname" onChange={(e) => {
                            setfirstnameReg(e.target.value);
                        }} className="firstnameType"/>
                        </div>
                        <div className="lasttname">
                        <input type="text" placeholder="Lastname" onChange={(e) => {
                            setlastnameReg(e.target.value);
                        }} className="lastnameType"/>
                    </div>
                    <div className="msg">{userInfoMsg ? userInfoMsg : ""}</div>
                </div>
                    <h5>Account Information</h5>
                <div className="regac">
                    <div className="email">
                        <input type="email" placeholder="Email Address" onChange={(e) => {
                            setEmailReg(e.target.value);
                        }} className="emailType"/>
                    </div>
                        <div className="msg">{emailMsg ? emailMsg : ""}</div>
                    <div className="password">
                        <input type={mask ? "password" : "text"} placeholder="Passsword" onChange={(e) => {
                            setPasswordReg(e.target.value);
                        }} className="passwordType"/>
                        <span className={mask ? "far fa-eye" : "far fa-eye-slash"} onClick={PasswordToggle}/>
                    </div>
                        <div className="msg">{passwordMsg ? passwordMsg : ""}</div>
                    <div className="password">
                        <input type={mask2 ? "password" : "text"} placeholder="Confirm Passsword" onChange={(e) => {
                            setConfirmPassword(e.target.value);
                        }} className="repasswordType"/>
                        <span className={mask2 ? "far fa-eye" : "far fa-eye-slash"} onClick={ConfirmPasswordToggle}/>
                    </div>
                        <div className="msg">{confirmPasswordMsg ? confirmPasswordMsg : ""}</div>
                    </div>
                        <div>
                            <button className="regbutton" onClick={checkReg}> Register </button>
                        </div>
                    <div>
                        <a className="go-login" href="/login">Already have an account?</a>
                    </div>
                </div>
        </div>
    )
}

export default Register;