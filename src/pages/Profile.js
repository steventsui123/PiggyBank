import React, {useContext, useLayoutEffect, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import './profile.css';

import {LoginStatusContext} from "../context/LoginContext";
import {LoginIDContext} from "../context/LoginContext";

const Profile = () => {
    Axios.defaults.withCredentials = true;

    const {loginStatus, setLoginStatus} = useContext(LoginStatusContext);
    const {loginID, setLoginID} = useContext(LoginIDContext);

    const [userFirstName, setUserFirstName] = useState("");
    const [userLastName, setUserLastName] = useState("");
    const [userEmail, setUserEmail] = useState("")
    const [userBalance, setUserBalance] = useState("");
    const [userDebt, setUserDebt] = useState("");
    const [userCredit, setUserCredit] = useState("")
    const [user2FA, setUser2FA] = useState("")

    const [userOldPassword, setUserOldPassword] = useState("")
    const [userNewPassword, setUserNewPassword] = useState("")
    const [userConfirmNewPassword, setUserConfirmNewPassword] = useState("")

    const [userTerminatePassword, setUserTerminatePassword] = useState("")

    const [profile_button, set_profile_button] = useState("information");
    const [credit_button, set_credit_button] = useState(false);

    const navigate = useNavigate()

    const credit_rating = (balance,debt) =>{
        if(balance == 0 && debt == 0){
            return setUserCredit("Not Applicable")
        }if(balance == 0 && debt > balance){
            return setUserCredit("D")
        }if(debt/balance >= 3){
            return setUserCredit("C")
        }if(debt/balance >= 2){
            return setUserCredit("CC")
        }if(debt/balance >= 1){
            return setUserCredit("CCC")
        }if(debt/balance >= 0.5 && balance < 10000){
            return setUserCredit("B")
        }if(debt/balance >= 0.4 && balance < 100000){
            return setUserCredit("BB")
        }if(debt/balance >= 0.3 && balance < 1000000){
            return setUserCredit("BBB")
        }if(debt/balance >= 0.2 && balance < 5000000){
            return setUserCredit("A")
        }if(debt/balance >= 0.1 && balance < 10000000){
            return setUserCredit("AA")
        }
        return setUserCredit("AAA")
    }

    const logout = () => {
        setLoginStatus(false)
        setLoginID(0)
        Axios.get("http://localhost:3001/logout")
        .then((err) => {
              console.log(err)
        })
        navigate('/')
    }

    
    useLayoutEffect(() => {
        if (!loginStatus){
            navigate('/login')
        }
    })

    useEffect( () => {
        const GetInformation = async () =>{
            await Axios.post("http://localhost:3003/get_info",{
            searchingID: loginID})
            .then((response) => {
                console.log(response.data[0])
                if (response.data){
                    setUserFirstName(response.data[0].firstname);
                    setUserLastName(response.data[0].lastname);
                    setUserEmail(response.data[0].email);
                    setUserBalance(response.data[0].balance);
                    setUserDebt(response.data[0].debt);
                    setUser2FA(response.data[0]["2FA"]);
                    credit_rating(response.data[0].balance,response.data[0].debt)
                }
            })
        }
        if (!userEmail && !userFirstName && !userLastName){
            GetInformation()
        }
    })

    return (
        <div className="Profile">
            <div className="AccountContainer1">
                <div className="AccountContainerRow1">
                    <div className="ProfileTitle1">
                        <div className="far fa-user-circle"> Name</div>
                        <div className="profile_name">{userFirstName} {userLastName}</div>
                    </div>
                    <div className="ProfileTitle2">
                        <div className="far fa-id-badge"> PiggyBank ID</div>
                        <div className="profile_piggybankid">{loginID}</div>
                    </div>
                    <div className="ProfileTitle3">
                        <div className="fas fa-dollar-sign"> Savings</div>
                        <div className="profile_savings">HKD {userBalance}</div>
                    </div>
                </div>

                <div className="profile_Row2_Row3">
                    <div className="AccountContainerRow2">
                        <button className="information_button" onClick={() => set_profile_button("information")}>Information</button>
                        <button className="balance_button" onClick={() => set_profile_button("balance")}>Balance</button>
                        <button className="payee_button" onClick={() => set_profile_button("payee")}>Payee</button>
                        <button className="security_button" onClick={() => set_profile_button("security")}>Security</button>
                        <button className="dangerzone_button" onClick={() => set_profile_button("dangerzone")}>Danger Zone</button>
                    </div>
                    
                    <div className="AccountContainerRow3">
                        {profile_button === "information" &&
                        <div className="profile_information">
                        <div className="profile_firstname">Firstname </div>
                        <div className="profile_userdata">{userFirstName}</div>
                        <div className="profile_lastname">Lastname </div>
                        <div className="profile_userdata">{userLastName}</div>
                        <div className="profile_email">Email </div>
                        <div className="profile_userdata">{userEmail}</div>
                        <div className="profile_id">PiggBank ID </div>
                        <div className="profile_userdata">{loginID}</div>
                        </div>}

                        {profile_button === "balance" &&
                        <div>
                        <div className="profile_information">
                        <div className="profile_balance">Balance </div>
                        <div className="profile_userdata">HKD {userBalance}</div>
                        <div className="profile_debt">Debt </div>
                        <div className="profile_userdata">HKD {userDebt}</div>
                        <div className="profile_credit">Credit Rating <i className="fas fa-info-circle" onClick={() => set_credit_button(!credit_button)}/></div>
                        <div className="profile_userdata">{userCredit}</div>
                        </div>
                        { credit_button ? (<div className="profile_credit_info">Credit Rating is the evaluation of user credit risk based on the user's balance and debt. See more detail on <a href="/feature" >Here</a>.</div>) : ""}
                        </div>
                        }

                        {profile_button === "payee" &&
                        <div className="profile_payee_information">
                        <div className="profile_payee_id">Payee ID</div>
                        <div className="profile_payee_name">Payee Name</div>
                        <div className="profile_payee_edit"><div className="profile_payee_edittxt">Add </div><i className="fas fa-plus-square"></i></div>
                        <div className="profile_userdata">{userFirstName}</div>
                        <div className="profile_userdata">{userLastName}</div>
                        <div className="profile_payee_editbutton"><div className="profile_payee_edittxt">Remove </div> <i className="fas fa-times-circle"></i></div>
                        </div>}

                        {profile_button === "security" &&
                        <div className="profile_security">
                        <div className="profile_2FA">Two Factor Authenication</div>
                        <div className="profile_2FA_txt">Two-factor authentication (2FA) is a security control by additional verifcation. See more detail on <a href="feature">Here</a>.</div>
                        { !user2FA ? 
                        (<div>
                            <div className="profile_no2FA">Two-factor authentication is not enabled yet.</div>
                            <div className="profile_2FA_txt">To enable 2FA, please verify with your current password.</div>
                            <input type="password" placeholder="Current Password" onChange={(e) => {
                            setUserTerminatePassword(e.target.value);
                            }} className="profile_2FApassword"/>
                            <div><button className="profile_resetpassword_button" > Enable Two Factor Authenication </button></div>
                        </div>) : ""}
                        <div className="profile_changepassword">Change Password</div>
                            <div className="profile_resetpassword">
                                <input type="password" placeholder="Old Password" onChange={(e) => {
                                    setUserOldPassword(e.target.value);
                                }} className="profile_oldpassword"/>
                                <input type="password" placeholder="New Password" onChange={(e) => {
                                    setUserNewPassword(e.target.value);
                                }} className="profile_newpassword"/>
                                <input type="password" placeholder="Confirm New Password" onChange={(e) => {
                                    setUserConfirmNewPassword(e.target.value);
                                }} className="profile_confirmnewpassword"/>
                                <div>
                                    <button className="profile_resetpassword_button" > Update Password </button>
                                </div>
                            </div>
                        </div>}

                        {profile_button === "dangerzone" &&
                        <div className="profile_dangerzone_information">
                            <div className="profile_terminate">Terminate Account</div>
                            <div className="profile_warning">WARNING: Please be noticed that all your information will be deleted once you terminate your account.</div>
                            <div className="profile_terminate_form">
                                <input type="password" placeholder="Current Password" onChange={(e) => {
                                        setUserTerminatePassword(e.target.value);
                                    }} className="profile_oldpassword"/>
                                <div className="profile_verify_terminate">To verify, please type "terminate my account" below</div>
                                <input type="text" onChange={(e) => {
                                        setUserTerminatePassword(e.target.value);
                                    }} className="profile_oldpassword"/>
                            </div>
                                <button className="profile_terminate_button"> Terminate your account </button>
                        </div>}
                        
                    </div>
                </div>

                <div className="AccountContainerRow4">
                    <div className="account_operation_title">Account Operation</div>
                    <div className="account_operation_container">
                        <div className="account_operation_transaction">
                            <div className="account_operation_Img">
                                <i className="fas fa-coins"></i>
                            </div>
                            Transfer
                        </div>
                        <div className="account_operation_withdrawl">
                            <div className="account_operation_Img">
                                <i className="fas fa-search-dollar"></i>
                            </div>
                            Withdrawl
                        </div>
                        <div className="account_operation_deposit">
                            <div className="account_operation_Img">
                                <i className="fas fa-donate"></i>
                            </div>
                            Deposit
                        </div>
                        <div className="account_operation_logout" onClick={logout}>
                            <div className="account_operation_Img">
                                <i className="fas fa-sign-out-alt"></i>
                            </div>
                            Logout
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Profile;