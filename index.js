const { Server: http } = require('http');
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const socketIO = require('socket.io');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });
const Jimp = require('jimp');
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
  let source;
  let modified;

  ws.on('path', imagePath => {
    console.log('Path: ' + imagePath);
    source = imagePath;
  });

  ws.on('flip', async () => {
    console.log('flip');
    Jimp.read(source)
      .then(pic => {
        if (modified) {
          fs.rmSync(modified);
        }
        modified = 'images\\' + Date.now() + '-' + source.split('-')[1];
        return pic
          .flip(true, false)
          .write(modified);
      })
      .catch(err => {
        console.error(err);
      })
      .then(() => {
        ws.emit('path', modified);
      });
  });

  ws.on('disconnect', () => {
    console.log('Connection lost!');
    if (source) {
      fs.rmSync(source);
    }
    if (modified) {
      fs.rmSync(modified);
    }
  });
});