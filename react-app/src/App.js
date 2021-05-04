import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { authenticate } from "./store/session";

import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UsersList from "./components/UsersList";
// import User from "./components/User";

import PortfolioPage from './components/PortfolioPage/PortfolioPage'
import StockPage from './components/StockPage/StockPage'

function App() {
  const dispatch = useDispatch()
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async() => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <div className='app-container'>
        <div className="app-header flex-container">
          <NavBar />
        </div>
        <Switch>
          <ProtectedRoute path="/" exact={true}>
            <div className="app-main flex-container">
              <PortfolioPage />
            </div>
          </ProtectedRoute>
          <Route path="/login" exact={true}>
            <div className="app-main flex-container">
              <LoginForm/>
            </div>
          </Route>
          <Route path="/signup" exact={true}>
            <div className="app-main flex-container">
              <SignUpForm />
            </div>
          </Route>
          <Route path="/stocks/:ticker" exact={true}>
            <div className="app-main flex-container">
              <StockPage />
            </div>
          </Route>
          <ProtectedRoute path="/users" exact={true}>
            <div className="app-main flex-container">
              <UsersList/>
            </div>
          </ProtectedRoute>
          {/* <ProtectedRoute path="/users/:userId" exact={true}>
            <div className="app-main flex-container">
              <User />
            </div>
          </ProtectedRoute> */}
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
