import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import LogoutButton from './auth/LogoutButton';

const NavBar = ({ setAuthenticated }) => {
  const user = useSelector( state => state.session.user )

  const authLinks = (
    <>
      <NavLink to="/" exact={true} activeClassName="active">
        Home
      </NavLink>
      <NavLink to="/users" exact={true} activeClassName="active">
        Users
      </NavLink>
      <LogoutButton />
    </>
  )

  const unauthLinks = (
    <>
      <NavLink to="/login" exact={true} activeClassName="active">
        Login
      </NavLink>
      <NavLink to="/sign-up" exact={true} activeClassName="active">
        Sign Up
      </NavLink>
    </>
  )

  let linkDisplay;
  user ? linkDisplay = authLinks : linkDisplay = unauthLinks


  return (
    <nav>
      { user && linkDisplay }
    </nav>
  );
}

export default NavBar;