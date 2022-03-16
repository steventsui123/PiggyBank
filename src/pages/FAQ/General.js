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
        <a className='general-btn' href='support=general' style={highlightbtn}> <i className="far fa-question-circle"></i><div className="supportchoice"> General</div></a>
            <a className='account-btn' href='support=account'> <i className="fas fa-user-circle"></i><div className="supportchoice"> Account</div></a>
            <a className='transfer-btn' href='support=transaction'> <i className="fas fa-donate"></i><div className="supportchoice"> Transaction</div></a>
            <a className='loan-btn' href='support=loan'> <i className="fas fa-hand-holding-usd"></i><div className="supportchoice"> Loan</div></a>
            <a className='insurance-btn' href='support=insurance'> <i className="fas fa-user-shield"></i><div className="supportchoice"> Insurance</div></a>
            <a className='development-btn' href='support=development'> <i className="fas fa-file-code"></i><div className="supportchoice"> Development</div></a>
            <a className='security-btn' href='support=security'> <i className="fas fa-lock"></i><div className="supportchoice"> Security</div></a>
            <a className='estatement-btn' href='support=estatement'> <i className="fas fa-print"></i><div className="supportchoice"> E-Statement</div></a>
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