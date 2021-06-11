const { Server: http } = require('http');
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer  = require('multer');
const socketIO = require('socket.io');
const upload = multer({ dest: 'images/' });
const PORT = 1111;

const app = express();

app.get(/(\/)|(\.(js|css)$)/, express.static(path.join(__dirname, './dist')));

app.use('/images', express.static(path.join(__dirname, './images')));

app.post("/api/upload", upload.single('image'), (req, res) => {
  res.send({ path: req.file.path });  
});

const server = http(app).listen(process.env.PORT || PORT, () => console.log('Server starts: ' + process.pid));
const io = socketIO(server);

io.on('connection', ws => {
  console.log('Connected!');
  let path = '';
  
  ws.on('path', imagePath => {
    console.log('Path: '+imagePath);
    path = imagePath;
  });
  
  ws.on('path', imagePath => {
    console.log('Path: '+imagePath);
    path = imagePath;
  });

  ws.on('disconnect', () => {
    console.log('Connection lost!');
    fs.rmSync(path);
  });
});