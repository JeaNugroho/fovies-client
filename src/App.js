import React from 'react';
import { BrowserRouter as Router, Link } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Routes from "./Routes";
import brandPic from "./fovies_pic_logo-removebg-preview.png";
import brandName from "./fovies_name_logo-removebg-preview.png";
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App container">
        {/* <div className="navbar-fovies rounded p-0"> */}
          <Navbar className="navbar-fovies rounded px-3 py-1" fluid collapseOnSelect>
              <Navbar.Brand>
                <Link to="/">
                  <img 
                    className="align-middle" 
                    src={ brandPic } 
                    alt="fovies-pic-logo" 
                    height="34rem" 
                  />
                  <img 
                    className="align-middle" 
                    src={ brandName } 
                    alt="fovies-name-logo" 
                    height="20rem" 
                  />
                </Link>
              </Navbar.Brand>

              <Nav className="ml-auto">
                <LinkContainer to="/signup">
                  <NavItem className="nav-link mx-2">
                    <i class="fas fa-user-plus fa-2x"></i>
                  </NavItem>
                </LinkContainer>
                <LinkContainer to="/login">
                  <NavItem className="nav-link ml-2">
                    <i class="fas fa-sign-in-alt fa-2x"></i>
                  </NavItem>
                </LinkContainer>
              </Nav>
          </Navbar>
        {/* </div> */}
        <Routes />
      </div>
    </Router>
  );
}

export default App;
