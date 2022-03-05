import React from "react";
import './support.css';
import {highlightbtn} from './General'

const Estatement = () => {
    return (
        <React.Fragment>
        <div className="supportheader">
        <div className="supporttitle">Frequently Asked Questions</div>
        <div className="supporttitle2">Any problem, please contact Rudy Yen at email: <div className="email" onClick={() => window.location = 'mailto:rudyyen.work@gmail.com'}><i className="far fa-envelope"></i>rudyyen.work@gmail.com </div></div>
        <div className="supportbar">
            <a className='general-btn' href='support=general'> <i className="far fa-question-circle"></i> General</a>
            <a className='account-btn' href='support=account'> <i className="fas fa-user-circle"></i> Account</a>
            <a className='transfer-btn' href='support=transaction'> <i className="fas fa-donate"></i> Transaction</a>
            <a className='loan-btn' href='support=loan'> <i className="fas fa-hand-holding-usd"></i> Loan</a>
            <a className='insurance-btn' href='support=insurance'> <i className="fas fa-user-shield"></i> Insurance</a>
            <a className='development-btn' href='support=development'> <i className="fas fa-file-code"></i> Development</a>
            <a className='security-btn' href='support=security'> <i className="fas fa-lock"></i> Security</a>
            <a className='estatement-btn' href='support=estatement' style={highlightbtn}> <i className="fas fa-print"></i> E-Statement</a>
        </div>
        </div>
        <h1>
            E-Statement
        </h1>
        </React.Fragment>

    )
}

export default Estatement;