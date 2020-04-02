import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import AuthContextProvider from './context/auth-context';

ReactDOM.render(
  // can listen auth context in everywhere in project
  <AuthContextProvider>
    <App />
  </AuthContextProvider>,
  document.getElementById('root')
);
serviceWorker.unregister();
