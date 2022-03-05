import React, {useState} from "react";
import './navBar.css';
import { LoginBarItem } from "./LoginItem";
import {ProfileButton} from "./NavButton"

const LoginNavBar = () => {

    const [clicked, setClicked] = useState(false)

    const handleClick = () => {
        setClicked(!clicked)
    }

    return(
        <nav className="navbar">
                <div className="navbar-logo"><a className="fas fa-piggy-bank" href='/'>PiggyBank</a></div>
                <div className='menu-icon' onClick={handleClick}>
                    <i className={clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
                </div>

                
                <ul className={clicked ? 'nav-menu active' : 'nav-menu'}>
                    {LoginBarItem.map((item, index) => {
                        return(
                            <li key={index}>
                                <a className={item.cName} href={item.url}>
                                {item.title}</a>
                            </li>
                        )
                    })}
                </ul>
                <ProfileButton>Profile</ProfileButton>
            </nav>
    )
}

export default LoginNavBar;