import "./styles/index.css";
import "./components/socket.io";
import React from "react";
import ReactDOM from "react-dom";
import { App } from './components/app';

const ws = io();

ReactDOM.render(<App ws={ws} />, document.getElementById('app'));
