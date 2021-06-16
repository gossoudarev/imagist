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

app.get("/api/download/", (req, res) => {
  if (fs.existsSync(req.query.path)) {
    fs.createReadStream(req.query.path).pipe(res);
  } else {
    res.status(404).end();
  }
});

const server = http(app).listen(process.env.PORT || PORT, () => console.log('Server starts: ' + process.pid));
const io = socketIO(server);

io.on('connection', ws => {
  let source;
  let modified;

  ws.on('path', imagePath => {
    source = imagePath;
  });

  ws.on('transform', async (data) => {
    Jimp.read(source)
      .then(pic => {
        if (modified) {
          fs.rmSync(modified);
        }
        modified = './images/' + Date.now() + '-' + source.split('-')[1];
        if (data.colors) {
          switch (data.colors) {
            case 'invert':
              pic.invert();
            case 'greyscale':
              pic.greyscale();
            case 'sepia':
              pic.sepia();
          }
        }
        if (data.brightness) {
          pic.brightness(data.brightness);
        }
        if (data.contrast) {
          pic.contrast(data.contrast);
        }
        if (data.blur) {
          pic.blur(data.blur);
        }
        if (data.posterize) {
          pic.posterize(data.posterize);
        }
        if (data.pixelate) {
          pic.pixelate(data.pixelate);
        }
        if (data.flip_v || data.flip_h) {
          pic.flip(data.flip_h, data.flip_v);
        }
        if (data.rotate) {
          pic.rotate(data.rotate);
        }
        if (data.bg !== 255) {
          pic.background(data.bg);
        }
        if (data.resize_y || data.resize_x) {
          if (data.resize_y && data.resize_x) {
            pic.resize(data.resize_x, data.resize_y);
          } else {
            pic.resize(data.resize_x || Jimp.AUTO, data.resize_y || Jimp.AUTO);
          }
        }
        pic.write(modified);
        return pic;
      })
      .catch(err => {
        console.error(err);
      })
      .then(() => {
        ws.emit('path', modified);
      });
  });

  ws.on('clear', clear);
  ws.on('disconnect', clear);

  function clear() {
    if (source) {
      fs.rmSync(source);
      source = null;
    }
    if (modified) {
      fs.rmSync(modified);
      modified = null;
    }
  }
});