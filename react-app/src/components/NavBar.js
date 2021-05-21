import React from 'react';
import { useSelector } from 'react-redux';
import LogoutButton from './auth/LogoutButton';
import AsyncSearch from './AsyncSearch'

const NavBar = () => {
  const user = useSelector( state => state.session.user )
  const feather = require('../front-assets/logo_animation.gif')

  // planning to add history tabs showing transaction history for logged in user
  const authLinks = (
    <>
      <a className='nav-link' href="/">
        Portfolio
      </a>
      <a className='nav-link' href="/history">
        History
      </a>
      <LogoutButton />
    </>
  )

  let linkDisplay;
  user ? linkDisplay = authLinks : linkDisplay = ""

  return (
    <div className='nav-container'>
      <div style={{ 'justifyContent': 'flex-end', 'paddingRight':'15px' }}className="nav-item">
        <a href='/'><img alt='feather-animation' className='nav-logo' src={feather}></img></a>
      </div>
      <div style={{ 'justifyContent': 'flex-start' }} className="nav-item">
          <AsyncSearch />
      </div>
      <div className="nav-item">
          {linkDisplay}
      </div>
      <div className="nav-item">
      </div>
    </div>
  );
}

export default NavBar;