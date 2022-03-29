import React, {useContext, useLayoutEffect, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import './transfer.css';

import search_payee from "../material/pictures/search_payee.png";
import search_id from "../material/pictures/search_id.png";
import choosing from "../material/pictures/choosing.png";

import {LoginStatusContext} from "../context/LoginContext";
import {LoginIDContext} from "../context/LoginContext";
import {userPayeeContext} from "../context/UserContext";


const Transfer = () =>{
    Axios.defaults.withCredentials = true;
    const navigate = useNavigate()

    const {loginStatus, setLoginStatus} = useContext(LoginStatusContext);
    const {loginID, setLoginID} = useContext(LoginIDContext);
    const {userPayee, setUserPayee} = useContext(userPayeeContext);
    const [transferChoice, setTransferChoice] = useState("")
    const [transfer_payee, setTransfer_payee] = useState("")
    const [transfer_amount, setTransfer_Amount] = useState(0)
    const [transfer_errormsg, setTransfer_Errormsg] = useState("")

    const get_payee = () => {
        Axios.post("http://localhost:3003/get_payee",{
        searchingID: loginID})
        .then((response) => {
            if (response.data){
                setUserPayee(response.data)
            }
        })
    }

    const transfer_by_payee = () =>{
        get_payee()
        setTransferChoice("by_payee")
    }

    const transfer_money = () =>{
        if (!transfer_amount || transfer_amount == 0){
            return setTransfer_Errormsg("Invalid transfer amount.")
        }
        if (!transfer_payee){
            return setTransfer_Errormsg("Please select a payee.")
        }
        Axios.post("http://localhost:3003/check_balance",{
        payerID: loginID,
        check_amount: transfer_amount})
        .then((response) =>{
            if (response.data.length > 0){
                console.log("OK")
                Axios.post("http://localhost:3004/transfer",{
                transfer_payerID: loginID,
                transfer_amount: transfer_amount,
                transfer_payeeID: transfer_payee})
            }else{
                console.log("NOT OK")
            }
        })
    }

    useLayoutEffect(() => {
        if (!loginStatus){
            navigate('/login')
        }
    })

    return(
        <div className="transfer">
            { transferChoice === "" &&
            <div className="transfer_choice_container">
                <div className="transfer_choice" onClick={transfer_by_payee}>
                    <div className="transfer_choice_icon">
                        <img src={search_payee} width='120' alt=""/>
                    </div>
                    <div className="transfer_choice_title">
                        Select Payee
                    </div>
                </div>
                <div className="transfer_choice" onClick={() => setTransferChoice("by_id")}>
                    <div className="transfer_choice_icon">
                        <img src={search_id} width='120' alt=""/>
                    </div>
                    <div className="transfer_choice_title">
                        Select ID
                    </div>
                </div>
            </div>
            }

            { transferChoice === "by_payee" &&
            <div className="by_payee">
                <div className="transfer_payee_list">
                    <div className="transfer_payee_bar">
                        <div className="transfer_payee_information">
                            <div className="transfer_goback"><a className="fas fa-arrow-alt-circle-left" href="/transfer"></a></div>
                            <div className="profile_payee_id">Payee ID</div>
                            <div className="profile_payee_name">Payee Name</div>
                        </div>
                        {userPayee.map(data => {
                            return(
                                <div className="transfer_payee_choose" onClick={() => setTransfer_payee(data.payee_id)}>
                                    {transfer_payee == data.payee_id ?
                                    <div className="transfer_tickbox"><input type="radio" checked="checked" /></div>
                                    :
                                    <div className="transfer_not_tickbox"><input type="radio" /></div>
                                    }
                                    <div className="profile_userdata">{data.payee_id}</div>
                                    <div className="profile_userdata">{data.payee_name}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="transfer_container">
                    <div className="transfer_payee_choice">
                        Choose your payee
                    </div>
                    <div className="transfer_choice_icon">
                        <img src={choosing} width='120' alt=""/>
                    </div>
                    <div className="transfer_current">
                        Current Payee ID
                    </div>
                    <div className="transfer_current_id">
                        {transfer_payee == "" ? "-" : transfer_payee}
                    </div>
                    <div className="transfer_amount">
                        <div>HKD Amount</div>
                        <div className="transfer_amount_input"><input type="number" onChange={(e) => {setTransfer_Amount(e.target.value);}} />
                        </div>
                    </div>
                    <div className="transfer_confirm" onClick={transfer_money}>
                        Confirm
                    </div>
                </div>
            </div>
            }
        </div>
    )
}

export default Transfer