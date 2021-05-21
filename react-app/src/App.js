import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { authenticate } from "./store/session";

import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PortfolioPage from './components/PortfolioPage/PortfolioPage'
import StockPage from './components/StockPage/StockPage'

function App() {
  const dispatch = useDispatch()
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async() => {
      await dispatch(authenticate());
      setLoaded("true");
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
      <BrowserRouter>
            <Switch>
              <ProtectedRoute path="/" exact={true}>
                <div className='app-container'>
                  <div className="app-header">
                    <NavBar />
                  </div>
                  <div className="app-main">
                    <PortfolioPage />
                  </div>
                </div>
              </ProtectedRoute>
              <Route path="/login" exact={true}>
                  <LoginForm/>
              </Route>
              <Route path="/signup" exact={true}>
                  <SignUpForm />
              </Route>
              <Route path="/stocks/:ticker" exact={true}>
                <div className='app-container'>
                  <div className="app-header">
                    <NavBar />
                  </div>
                  <div className="app-main flex-container">
                    <StockPage />
                  </div>
                </div>
              </Route>
            </Switch>
      </BrowserRouter>
  );
}

export default App;
