import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Routes from "./Routes";
import { AppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";
import { Auth } from "aws-amplify";
import brandPic from "./fovies_pic_logo-removebg-preview.png";
import brandName from "./fovies_name_logo-removebg-preview.png";
import './App.css';

const App = () => {
  const history = useHistory();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  // const [currentUserAvatarState, setCurrentUserAvatarState] = useState("");

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      // console.log("HEWWO");
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (error) {
      if (error !== "No current user") {
        onError(error);
      }
    }

    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();

    userHasAuthenticated(false);

    localStorage.removeItem("currentUserAvatar");

    history.push("/login");
  }

  return (
    !isAuthenticating && 
    (<div className="App container">
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
          { isAuthenticated 
            ? (<>
              <Nav.Link className="mx-2">
                <LinkContainer to="/users/me/videos">
                  <img className="user-avatar rounded-circle" src={ localStorage.getItem("currentUserAvatar") } alt="profile-pic" />
                </LinkContainer>
              </Nav.Link>
              <Nav.Link className="ml-2" onClick={ handleLogout }>
                  <i className="fas fa-sign-out-alt fa-2x"></i>
              </Nav.Link>
              </>)
            : (<>
              <LinkContainer to="/signup">
                <NavItem className="nav-link mx-2">
                  <i className="fas fa-user-plus fa-2x"></i>
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/login">
                <NavItem className="nav-link ml-2">
                  <i className="fas fa-sign-in-alt fa-2x"></i>
                </NavItem>
              </LinkContainer>
            </>) }
        </Nav>
      </Navbar>

      <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
        <Routes />
      </AppContext.Provider>
    </div>)
  );
}

export default App;
