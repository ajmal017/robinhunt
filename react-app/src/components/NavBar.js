import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import LogoutButton from './auth/LogoutButton';
import AsyncSearch from './AsyncSearch'

const NavBar = ({ setAuthenticated }) => {
  const user = useSelector( state => state.session.user )
  const feather = require('../front-assets/feather_icon.png')

  const authLinks = (
    <div className='flex-container'>
      <a className='nav-link' href="/" exact={true}>
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
        <a href='/'><img className='nav-logo' src={feather}></img></a>
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