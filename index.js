const { Server } = require('http');
const express = require('express');
const path = require('path');
const PORT = 1111;

const app = express();

app.get(/(\/)|(\.(js|css)$)/, express.static(path.join(__dirname, './dist')));

Server(app).listen(process.env.PORT || PORT, () => console.log('Server starts: ' + process.pid));
