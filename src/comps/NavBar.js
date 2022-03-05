import React, {Component} from 'react';
import './navBar.css';
import { NavItem } from "./NavItem";
import {LoginButton} from "./NavButton"


class Navbar extends Component{
    state = { clicked: false }

    handleClick = () => {
        this.setState({clicked: !this.state.clicked})
    }

    render() {

        return(
            <nav className="navbar">
                <div className="navbar-logo"><a className="fas fa-piggy-bank" href='/'>PiggyBank</a></div>
                <div className='menu-icon' onClick={this.handleClick}>
                    <i className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
                </div>

                
                <ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu'}>
                    {NavItem.map((item, index) => {
                        return(
                            <li key={index}>
                                <a className={item.cName} href={item.url}>
                                {item.title}</a>
                            </li>
                        )
                    })}
                </ul>
                <LoginButton>Login</LoginButton>
            </nav>
        )
    }
}
export default Navbar;