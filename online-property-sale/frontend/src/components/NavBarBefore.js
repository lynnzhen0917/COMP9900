import React from 'react'
import { Navbar, Nav } from "react-bootstrap";

// refer to the bootstrap navbar and nav component

const NavBarBefore = () => {
  // navbar before login
  // include sign in and sign up function
  return (
    <Navbar className="navbar fixed-top navbar-dark bg-dark">
      <Navbar.Brand href="/">
        <i className="fa fa-building" />
        FVC5
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>
      <Nav className="mr-auto">
        <Nav.Link href="/">
          <i className="fas fa-home"></i>
        </Nav.Link>
        <Nav.Link href="/signin">
          <form className="form-inline">
            <button className="btn btn-sm btn-outline-secondary" type="button">
              Sign In
            </button>
          </form>
        </Nav.Link>
        <Nav.Link href="/register">
          <form className="form-inline">
            <button className="btn btn-sm btn-light" type="button">
              Sign Up
            </button>
          </form>
        </Nav.Link>
      </Nav>
    </Navbar>
  );
  
}

export default NavBarBefore;
