import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { signup } from '../../store/session';

const SignUpForm = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user)
  const welcomeImg = require('../../front-assets/welcome_banner.png')
  const background = require('../../front-assets/robinhood_splash_img.jpeg')

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const onSignUp = async (e) => {
    e.preventDefault();
    if (password === repeatPassword) {
      await dispatch(signup(username, email, password));
    }
  };

  const updateUsername = (e) => setUsername(e.target.value);
  const updateEmail = (e) => setEmail(e.target.value);
  const updatePassword = (e) => setPassword(e.target.value);
  const updateRepeatPassword = (e) => setRepeatPassword(e.target.value);

  if (user) {
    return <Redirect to="/" />;
  }

  const redirect_message = '  Log in'
  return (
    <div className='splash-container'>
      <div className='splash-image-container' style={{ 'backgroundImage': `url(${background})`, 'backgroundSize': 'cover', 'opacity':'.7' }}>
      </div>
      <div className='splash-fields'>
        <div className=''>
          <img alt='welcome-animation' className='welcome-image' src={welcomeImg}></img>
        </div>
        <br></br>
        <form className='splash-form' onSubmit={onSignUp}>
          <div>
            <label>User Name</label>
            <input
              type="text"
              name="username"
              required={true}
              onChange={updateUsername}
              value={username}
            ></input>
          </div>
          <div>
            <label>Email</label>
            <input
              type="text"
              name="email"
              required={true}
              onChange={updateEmail}
              value={email}
            ></input>
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              required={true}
              onChange={updatePassword}
              value={password}
            ></input>
          </div>
          <div>
            <label>Repeat Password</label>
            <input
              type="password"
              name="repeat_password"
              onChange={updateRepeatPassword}
              value={repeatPassword}
              required={true}
            ></input>
          </div>
          <button type="submit">Sign Up</button>
          <div className="redirect-text"> Already have an account?<a href="/login">{redirect_message}</a></div>
        </form>
        <div className='project-links'>
          <p>© Eric Ramsay. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
