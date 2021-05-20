import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
;import { Redirect } from "react-router-dom";
import { login } from "../../store/session";

const LoginForm = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const upArrow = require('../../front-assets/up_arrow.png')
  const welcomeImg = require('../../front-assets/welcome_banner_animation.gif')

  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data.errors) setErrors(user.errors);
  };

  const demoLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login('demo@aa.io', 'password'));
    if (data.errors) setErrors(data.errors);
  }

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to="/" />;
  }

  const redirect_message= `  Sign up`

  return (
    <div className='splash-container'>
      <div className='splash-image-container'>
        <img alt='up-line-target' className='splash-image-2' src={upArrow}></img>
      </div>
      <div className='splash-fields'>
        <div className=''>
          <img alt='welcome-animation' className='welcome-image' src={welcomeImg}></img>
        </div>
        <br></br>
        <form className='splash-form' onSubmit={onLogin}>
          <div>
            {errors.map((error) => (
              <div>{error}</div>
            ))}
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              name="email"
              type="text"
              value={email}
              required={true}
              onChange={updateEmail}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              name="password"
              type="password"
              value={password}
              required={true}
              onChange={updatePassword}
            />
            <button type="submit">Login</button>
            <button type="submit" onClick={demoLogin} >Demo User</button>
            <div className="redirect-text"> Don't have an account?<a href="/signup">{redirect_message}</a></div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
