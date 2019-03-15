import React from "react";
import PropTypes from "prop-types";
import { Navbar, Nav, NavItem } from "react-bootstrap";
import { Link } from "react-router-dom";

const TopNavbar = (props) => {
  return (
    <Navbar inverse collapseOnSelect>
      <Navbar.Collapse>
        {props.showNavItems &&
          <Nav pullRight>
            <Link to="/home">
              <Navbar.Text>Home</Navbar.Text>
            </Link>
            <Link to="/about">
              <Navbar.Text>About</Navbar.Text>
            </Link>
            <Link to="/contact">
              <Navbar.Text>Contact</Navbar.Text>
            </Link>
            <Link to="/secret">
              <Navbar.Text>Secret</Navbar.Text>
            </Link>
          </Nav>
        }
        <Nav pullRight>
          <NavItem onClick={props.onSignOut}>Sign Out</NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

TopNavbar.propTypes = {
  onSignOut: PropTypes.func.isRequired,
  showNavItems: PropTypes.bool.isRequired
};

export default TopNavbar;
