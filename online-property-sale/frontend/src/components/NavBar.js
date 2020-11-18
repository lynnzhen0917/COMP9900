import React from "react";
import NavBarBefore from './NavBarBefore';
import NavBarAfter from "./NavBarAfter";
import { isLoggedIn } from './auth.js'


const Log = () => {
    // different navbar versions
    if (isLoggedIn()) {
        return (
            <NavBarAfter name={localStorage.getItem("firstname")}/>
        )
    } else {
        return (
            <NavBarBefore />
        )
    }
}

const NavBar = () => {

    return (
        <Log />  
    )
}

export default NavBar;



