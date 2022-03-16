import React from "react";
import './support.css';
import {highlightbtn} from './General'

const Loan = () => {
    return (
        <React.Fragment>
        <div className="supportheader">
        <div className="supporttitle">Frequently Asked Questions</div>
        <div className="supporttitle2">Any problem, please contact Rudy Yen at email: <div className="email" onClick={() => window.location = 'mailto:rudyyen.work@gmail.com'}><i className="far fa-envelope"></i>rudyyen.work@gmail.com </div></div>
        <div className="supportbar">
            <a className='general-btn' href='support=general'> <i className="far fa-question-circle"></i><div className="supportchoice"> General</div></a>
            <a className='account-btn' href='support=account'> <i className="fas fa-user-circle"></i><div className="supportchoice"> Account</div></a>
            <a className='transfer-btn' href='support=transaction'> <i className="fas fa-donate"></i><div className="supportchoice"> Transaction</div></a>
            <a className='loan-btn' href='support=loan' style={highlightbtn}> <i className="fas fa-hand-holding-usd"></i><div className="supportchoice"> Loan</div></a>
            <a className='insurance-btn' href='support=insurance'> <i className="fas fa-user-shield"></i><div className="supportchoice"> Insurance</div></a>
            <a className='development-btn' href='support=development'> <i className="fas fa-file-code"></i><div className="supportchoice"> Development</div></a>
            <a className='security-btn' href='support=security'> <i className="fas fa-lock"></i><div className="supportchoice"> Security</div></a>
            <a className='estatement-btn' href='support=estatement'> <i className="fas fa-print"></i><div className="supportchoice"> E-Statement</div></a>
        </div>
        </div>
        <h1>
        Loan
        </h1>
        </React.Fragment>
    )
}

export default Loan;