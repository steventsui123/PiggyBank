import React, {useState} from "react";
import './support.css';
import { GeneralItem } from "./FAQItem";

export const highlightbtn = {
    color: `rgb(0, 0, 0)`,
    background: `rgba(255, 223, 79, 0.99)`};


const General = () => {

const [clicked, setClicked] = useState(false)

const toggle = (index) => {
    if(clicked === index){
        return setClicked(null)
    }
    setClicked(index)
}
    
    return (
        <React.Fragment>
        <div className="supportheader">
        <div className="supporttitle">Frequently Asked Questions</div>
        <div className="supporttitle2">Any problem, please contact Rudy Yen at email: <div className="email" onClick={() => window.location = 'mailto:rudyyen.work@gmail.com'}><i className="far fa-envelope"></i>rudyyen.work@gmail.com </div></div>
        <div className="supportbar">
            <a className='general-btn' href='support=general' style={highlightbtn}> <i className="far fa-question-circle"></i> General</a>
            <a className='account-btn' href='support=account'> <i className="fas fa-user-circle"></i> Account</a>
            <a className='transfer-btn' href='support=transaction'> <i className="fas fa-donate"></i> Transaction</a>
            <a className='loan-btn' href='support=loan'> <i className="fas fa-hand-holding-usd"></i> Loan</a>
            <a className='insurance-btn' href='support=insurance'> <i className="fas fa-user-shield"></i> Insurance</a>
            <a className='development-btn' href='support=development'> <i className="fas fa-file-code"></i> Development</a>
            <a className='security-btn' href='support=security'> <i className="fas fa-lock"></i> Security</a>
            <a className='estatement-btn' href='support=estatement'> <i className="fas fa-print"></i> E-Statement</a>
        </div>
        </div>
        <div className='FAQContainer'>
            {GeneralItem.map((item, index) => {
                return(
                    <>
                    <div className="questionsBar" onClick={() => toggle(index)} key={index}>
                    <div className="questions">{item.question}</div>
                    <span>{clicked === index ? <div className="arrow"><i className="fas fa-chevron-up" /></div> : <div className="arrow"><i className="fas fa-chevron-down" /></div>}</span>
                    </div>
                    {clicked === index ? (
                    <div className="answersBar">
                    <div className="answers">{item.answer}</div>
                    </div>
                    ) : null }
                    </>
                )
            })}
        </div>
        </React.Fragment>
    )
}

export default General;