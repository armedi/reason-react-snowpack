import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { make as App } from './App.bs';

const renderOrHydrate =
  import.meta.MODE === 'production' ? ReactDOM.hydrate : ReactDOM.render;

renderOrHydrate(
  React.createElement(React.StrictMode, undefined, React.createElement(App)),
  document.getElementById('root')
);
