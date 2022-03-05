import React, {useState} from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {

    const navigate = useNavigate()
    Axios.defaults.withCredentials = true;
    
    const [email, setEmail] = useState('');
    const [randomcode] = useState(Math.floor(Math.random() * (999999 - 100000) + 100000))
    const [emailSent, setEmailSent] = useState(false);
    const [emailMsg, setEmailMsg] = useState("");
    const [code, setCode] = useState("")
    const [codeMsg, setCodeMsg] = useState("");
    const [isCodeValid, setIsCodeValid] = useState(false);
    const [newpassword, setNewPassword] = useState("");
    const [newconfirmpassword, setNewConfirmPassword] = useState("");
    const [changePasswordMsg, setChangePasswordMsg] = useState("");

    const [mask, setMask] = useState(true);
    const [mask2, setMask2] = useState(true);
    
    const PasswordToggle = () => {setMask(!mask)}
    const ConfirmPasswordToggle = () => {setMask2(!mask2)}
    
    
    const SendEmail = async () => {
        try{
        await Axios.post('http://localhost:3001/registered',{
            cemail: email
        }).then((response) =>{
            if(response.data[0]){
                document.getElementById('resetemail_input').value = ''
                setEmailSent(true);
                Axios.post("http://localhost:3002/reset_email", {
                    targetemail: email,
                    randomcode: randomcode
                })
                Axios.post('http://localhost:3001/store_code', {
                    storeCode: randomcode,
                    storeEmail: email
                })
            }else{
                setEmailSent(false)
                setEmailMsg("This email address is invalid / not registered in database.")
            }
        })
        }catch (error){
            console.log(error)
        }
    }

    const checkCode = () => {
        Axios.post('http://localhost:3001/check_code',{
        code: code
        }).then((response) => {
            if(response){
                setIsCodeValid(true)
                setCodeMsg("")
            }
        })
    }

    const ChangePassword = () => {
        if (newpassword !== newconfirmpassword){
            setChangePasswordMsg("New Password and Cofirm New  Password does not match.")
        }
        if (newpassword.length < 8){
            setChangePasswordMsg("New Password should be at least 8characters long.")
        }
        if (newpassword === newconfirmpassword && newpassword.length >= 8){
        Axios.post("http://localhost:3001/change_password",{
            targetEmail: email,
            newpassword: newpassword
            }).then((response) =>{
                if (response){
                    Axios.post("http://localhost:3002/notice_email",{
                    noticeEmail: email,
                    })
                    navigate('/login')
                }
            })
        }
    }


    return (
        <div className="login">
            <div className="regContainer">
                {!emailSent ? (
                <div>
                    <div className="logintitle">Reset Password</div>
                        <div className="emailBlock">
                            <div>
                                Forgot Password?<br/>
                                Don't worry, enter your Email Address to reset it.
                                </div>
                            <input type="email" id="resetemail_input" placeholder="Email Address" onChange={(e) => {
                                setEmail(e.target.value);
                            }} className="emailType"/>
                        </div>
                            <div className="msg">{emailMsg ? emailMsg : ""}</div>
                        <div>
                            <button className="regbutton" onClick={SendEmail}> Submit </button>
                        </div>
                    </div>
                    ) : (
                    <div>
                    <div className="logintitle">{!isCodeValid ? "Verification" : "Reset Password"}</div>
                        <div className="emailBlock">
                            <div className="verification">
                                {!isCodeValid ?
                                "Verification code has been sent to "+ email : ""}
                            </div>
                                {!isCodeValid ?
                                <input type="text" placeholder="Verification Code" onChange={(e) => {
                                    setCode(e.target.value);
                                }} className="codeType"/>
                            :
                            <div>
                                <div className="password">
                                    <input type={mask ? "password" : "text"} placeholder="New Password" onChange={(e) => {
                                        setNewPassword(e.target.value);
                                    }} className="passwordType"/>
                                    <span className={mask ? "far fa-eye" : "far fa-eye-slash"} onClick={PasswordToggle}/>
                                </div>
                                <div className="password">
                                    <input type={mask2 ? "password" : "text"} placeholder="Confirm New Password" onChange={(e) => {
                                        setNewConfirmPassword(e.target.value);
                                    }} className="repasswordType"/>
                                    <span className={mask2 ? "far fa-eye" : "far fa-eye-slash"} onClick={ConfirmPasswordToggle}/>
                                </div>
                            </div>
                            }
                        </div>
                            <div className="msg">{codeMsg ? codeMsg : ""}</div>
                            <div className="msg">{changePasswordMsg ? changePasswordMsg : ""}</div>
                        <div>
                            <button className="regbutton" onClick={!isCodeValid ? checkCode : ChangePassword }> Submit </button>
                        </div>
                    </div>
                    )}
                        <a className="go-register" href="/login">Return Login Page</a>
                </div>
        </div>
    )
}

export default ResetPassword;