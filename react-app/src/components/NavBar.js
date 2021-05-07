import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import LogoutButton from './auth/LogoutButton';
import AsyncSearch from './AsyncSearch'

const NavBar = ({ setAuthenticated }) => {
  const user = useSelector( state => state.session.user )

  const authLinks = (
    <div className='flex-container'>
      <a className='nav-link' to="/" exact={true}>
        Portfolio
      </a>
      <LogoutButton />
    </div>
  )

  let linkDisplay;
  user ? linkDisplay = authLinks : linkDisplay = ""

  return (
    <div className='nav-container'>
      <div style={{ 'justifyContent': 'flex-end', 'paddingRight':'15px' }}className="nav-item">
        <a href='/'><img className='nav-logo' src="https://github.com/eramsay20/robinhunt/blob/main/assets/banner.png?raw=true"></img></a>
      </div>
      <div style={{ 'justifyContent': 'flex-start' }} className="nav-item">
          <AsyncSearch />
      </div>
      <div className="nav-item">
      </div>
      <div className="nav-item">
          {linkDisplay}
      </div>
    </div>
  );
}

export default NavBar;