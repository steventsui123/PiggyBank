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
    const [userType, setUserType] = useState("")


    const [payeeAdd, setPayeeAdd] = useState(false)
    const [userPayee, setUserPayee] = useState([])
    const [payeeAdd_ID, setPayeeAdd_ID] = useState("")
    const [payeeAdd_Name, setPayeeAdd_Name] = useState("")
    const [payeeAdd_Msg, setPayeeAdd_Msg] = useState("")

    const [userCurrentPassword, setUserCurrentPassword] = useState("")

    const [userOldPassword, setUserOldPassword] = useState("")
    const [userNewPassword, setUserNewPassword] = useState("")
    const [userConfirmNewPassword, setUserConfirmNewPassword] = useState("")

    const [ResetPasswordMsg, setResetPasswordMsg] = useState("")

    const [userTerminatePassword, setUserTerminatePassword] = useState("")

    
    const [checkPasswordFailMsg, setcheckPasswordFailMsg] = useState("")


    const [profile_button, set_profile_button] = useState("information");
    const [credit_button, set_credit_button] = useState(false);


    const navigate = useNavigate()

    const credit_rating = (balance,debt) =>{
        if(balance === 0 && debt === 0){
            return setUserCredit("Not Applicable")
        }if(balance === 0 && debt > balance){
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
                    setUserType(response.data[0].type);
                    credit_rating(response.data[0].balance,response.data[0].debt);
                }
            })
            get_payee()
        }

        if (!userEmail && !userFirstName && !userLastName){
            GetInformation()
        }
    })

    const switch_payee_add = () => {
        setPayeeAdd(!payeeAdd)
        setPayeeAdd_Msg("")
    }
    
    const get_payee = () => {
        Axios.post("http://localhost:3003/get_payee",{
        searchingID: loginID})
        .then((response) => {
            //console.log(response.data)
            if (response.data){
                setUserPayee(response.data)
            }
        })
        setPayeeAdd_ID("")
        setPayeeAdd_Name("")
    }

    const add_payee = async() => {
        if (payeeAdd_ID == ""){
            return setPayeeAdd_Msg("Payee ID can not be empty.")
        }
        if (payeeAdd_ID == loginID){
            return setPayeeAdd_Msg("You can not register yourself as payee.")
        }
        await Axios.post("http://localhost:3003/check_payee",{
            user_id_checkpayee: loginID,
            check_payee_id: payeeAdd_ID
        }).then((checkresult) =>{
            if(checkresult.data != ''){
                setPayeeAdd_Msg("Payee already registered on your list.")
            }else{
                Axios.post("http://localhost:3003/check_user",{
                payee_id_checkuser: payeeAdd_ID
                }).then((checkuser_result) =>{
                    if(checkuser_result.data != ''){
                        Axios.post("http://localhost:3003/add_payee",{
                            user_id_addpayee: loginID,
                            add_payee_id: payeeAdd_ID,
                            add_payee_name: payeeAdd_Name
                        })
                        switch_payee_add()
                    }else{
                        setPayeeAdd_Msg("Payee ID does not exist.")
                    }
                    get_payee()
                })
            }
        })
    }

    const delete_payee = (payeeID) => {
        var payee_ID = payeeID
        Axios.post("http://localhost:3003/delete_payee", {
            user_id_deletepayee: loginID,
            payee_id: payee_ID
        }).then(() => {
            get_payee()
        })
    }

    const enable2FA = () => {
        Axios.post("http://localhost:3001/check_password",{
            user_id_checkpassword: loginID,
            input_password: userCurrentPassword})
            .then((response_enable2FA) => {
                if (response_enable2FA.data === "Check Password Passed"){
                    Axios.post("http://localhost:3003/enable_2FA",{user_id_enable2FA: loginID})
                    .then(setUser2FA(!user2FA))
                    setcheckPasswordFailMsg("")
                }else{
                    setcheckPasswordFailMsg("Password Incorrect, please try it again")
                }
            })
    }

    const disable2FA = () =>{
        Axios.post("http://localhost:3001/check_password",{
            user_id_checkpassword: loginID,
            input_password: userCurrentPassword})
            .then((response_disable2FA) => {
                if (response_disable2FA.data === "Check Password Passed"){
                    Axios.post("http://localhost:3003/disable_2FA",{user_id_disable2FA: loginID})
                    .then(setUser2FA(!user2FA))
                    setcheckPasswordFailMsg("")
                }else{
                    setcheckPasswordFailMsg("Password Incorrect, please try it again")
                }
            })
        }

    const resetpassword = () =>{
        if (userNewPassword != userConfirmNewPassword){
            return setResetPasswordMsg("Password and confirm password does not match.")
        }
        if (userNewPassword.length < 8){
            return setResetPasswordMsg("New Password should contain at least 8characters long.")
        }
        Axios.post("http://localhost:3001/check_password",{
            user_id_checkpassword: loginID,
            input_password: userOldPassword})
            .then((response_resetpassword) => {
                if (response_resetpassword.data === "Check Password Passed"){
                    Axios.post("http://localhost:3001/change_password",{
                        newpassword: userNewPassword,
                        targetEmail: userEmail
                    }).then(() => {
                        window.alert("Password changed successful")
                        window.location.href = '/profile';
                    })
                }else{
                    return setResetPasswordMsg("Incorrect Old Passowrd.")
                }
            })
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
                        <button className="billing_button" onClick={() => set_profile_button("billing")}>Billing</button>
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
                            <div className="profile_type">Account Type </div>
                            <div className="profile_userdata">{userType}</div>
                        </div>}

                        {profile_button === "billing" &&
                        <div className="profile_billing">
                            <div className="profile_billing_plan">
                                <div className="profile_billing_Row">
                                    <div className="profile_plan_name">Subscription</div>
                                    <div className="profile_plan_date">Date</div>
                                    <div className="profile_billing_action">Action</div>
                                </div>
                                <div className="profile_userdata">HKD {userBalance}</div>
                            </div>
                            <div className="profile_billing_loan">
                                <div className="profile_billing_Row">
                                    <div className="profile_loan_amount">Loan Amount</div>
                                    <div className="profile_loan_date">Date</div>
                                    <div className="profile_billing_status">Status</div>
                                </div>
                            </div>
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
                        <div id="payee">
                            <div className="profile_payee_information">
                                <div className="profile_payee_id">Payee ID</div>
                                <div className="profile_payee_name">Payee Name</div>
                                <div className="profile_payee_edit" onClick={() => switch_payee_add()}><div className="profile_payee_edittxt">Add </div><i className="fas fa-plus-square"></i></div>
                            </div>
                            {userPayee.map(data => {
                                return(
                                    <div className="profile_payee_information">
                                        <div className="profile_userdata">{data.payee_id}</div>
                                        <div className="profile_userdata">{data.payee_name}</div>
                                        <div className="profile_payee_editbutton" onClick={() => delete_payee(data.payee_id)}>
                                            <div className="profile_payee_edittxt">Remove </div>
                                            <i className="fas fa-times-circle"></i></div>
                                    </div>
                                )
                            })}
                            {payeeAdd ?
                            <div className="profile_payee_add">
                                <div className="payee_id_add"><input type="text" placeholder="Payee ID" onChange={(e) =>{
                                    setPayeeAdd_ID(e.target.value) 
                                }}/></div>
                                <div className="payee_name_add"><input type="text" placeholder="Payee Name(Optional)" onChange={(e) =>{
                                    setPayeeAdd_Name(e.target.value)
                                }}/></div>
                                <div className="payee_add_button">
                                    <div className="payee_confirm_button" onClick={() => add_payee()}>Confirm </div>
                                    <div className="payee_cancel_button" onClick={() => switch_payee_add()}>Cancel </div>
                                </div>
                                <div className="payee_add_msg">{payeeAdd_Msg}</div>
                            </div>
                            :""
                            }
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
                                setUserCurrentPassword(e.target.value);
                                }} className="profile_2FApassword"/>
                                <div><button className="profile_resetpassword_button" onClick={enable2FA}> Enable Two Factor Authenication </button></div>
                            </div>) : 
                            (<div>
                                <div className="profile_2FA_enabled">Two-factor authentication is enabled.</div>
                                <div className="profile_2FA_txt">To disable 2FA, please verify with your current password.</div>
                                <input type="password" placeholder="Current Password" onChange={(e) => {
                                setUserCurrentPassword(e.target.value);
                                }} className="profile_2FApassword"/>
                                <div><button className="profile_disable2FA_button" onClick={disable2FA}> Disable Two Factor Authenication </button></div>
                            </div>)}
                            <div className="profile_checkPasswordFail">{ checkPasswordFailMsg ? checkPasswordFailMsg : ""}</div>
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
                                <div className="profile_checkPasswordFail">{ResetPasswordMsg}</div>
                                <div>
                                    <button className="profile_resetpassword_button" onClick={resetpassword}> Update Password </button>
                                </div>
                            </div>
                        </div>}

                        {profile_button === "dangerzone" &&
                        <div className="profile_dangerzone_information">
                            <div className="profile_terminate">Terminate Account</div>
                            <div className="profile_warning">WARNING: Please be noticed that all your information will be deleted once you terminate your account.</div>
                            <div className="profile_verify_terminate1">To terminate your account, please enter your current password.</div>
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