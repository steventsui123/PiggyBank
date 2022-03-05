import React from "react";
import './navButton.css'

const STYLES = [
    'btn--primary',
    'btn--outline'
]

const SIZES = [
    'btn--medium',
    'btn--large'
]

export const LoginButton = ({
    children,
    type,
    onClick,
    buttonStyle,
    buttonSize
}) => {
    const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0]

    const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0]

    return(
        <a className={`btn ${checkButtonStyle} ${checkButtonSize}`} href='/login' onClick={onClick} type={type} >
            {children} <i className="fas fa-sign-in-alt"></i>
        </a>
    )

}

export const ProfileButton = ({
    children,
    type,
    onClick,
    buttonStyle,
    buttonSize
}) => {
    const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0]

    const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0]

    return(
        <a className={`btn ${checkButtonStyle} ${checkButtonSize}`} href='/profile' onClick={onClick} type={type} >
            {children} <i className="fas fa-user-circle"></i>
        </a>
    )

}