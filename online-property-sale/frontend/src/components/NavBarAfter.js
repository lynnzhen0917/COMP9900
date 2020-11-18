import React from "react";
import { Navbar, Nav, NavDropdown, DropdownButton, Dropdown } from "react-bootstrap";
import { deleteTokens } from './auth'

// refer to the bootstrap navbar component

const NavBarAfter = (props) => {
  // navbar after login
  // include dashboard for different user types
  // include user name
  
  return (
    <Navbar className="navbar fixed-top navbar-dark bg-dark">
      <Navbar.Brand href="/">
        <i className="fa fa-building" />
        FVC5
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <NavDropdown
            title="seller"
            id="basic-nav-dropdown dropdown-menu-align-right"
          >
            <NavDropdown.Item href="/newpost">
              Post new property
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/currentpost">
              My current post
            </NavDropdown.Item>
            <NavDropdown.Item href="/historypost">
              Completed post
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="bidder" id="basic-nav-dropdown">
            <NavDropdown.Item href="/currentbid">
              My current bid
            </NavDropdown.Item>
            <NavDropdown.Item href="/historybid">
              Completed bid
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="observer" id="basic-nav-dropdown">
            <NavDropdown.Item href="/currentobserve">
              My current observation
            </NavDropdown.Item>
            <NavDropdown.Item href="/historyobserve">
              Completed auction
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>

      <Nav className="mr-auto">
        <Nav.Link href="/">
          <i className="fas fa-home"></i>
        </Nav.Link>
      </Nav>
      <DropdownButton
        alignRight
        title={props.name}
        id="dropdown-menu-align-right"
      >
        <Dropdown.Item href="/profile">Profile</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={() => {
          deleteTokens();
          window.location.replace("/")
        }}>Logout</Dropdown.Item>
      </DropdownButton>
    </Navbar>
  );
};

export default NavBarAfter;
