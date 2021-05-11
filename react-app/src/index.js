import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, Router } from 'react-redux'
import './index.css';
import App from './App';
import configureStore from './store';

const store = configureStore();

const Root = () => {
  return (
      <Provider store={store}>
        <App />
      </Provider>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
);
