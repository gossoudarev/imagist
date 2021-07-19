const { Server } = require('http');
const express = require('express');
const path = require('path');
const PORT = 1111;

const app = express();

app.get(/(\/)|(\.(js|css)$)/, express.static(path.join(__dirname, './dist')));

Server(app).listen(process.env.PORT || PORT, () => console.log('Server starts: ' + process.pid));

        // if (data.colors) {
        //   switch (data.colors) {
        //     case 'invert':
        //       pic.invert();
        //     case 'greyscale':
        //       pic.greyscale();
        //     case 'sepia':
        //       pic.sepia();
        //   }
        // }
        // if (data.brightness) {
        //   pic.brightness(data.brightness);
        // }
        // if (data.contrast) {
        //   pic.contrast(data.contrast);
        // }
        // if (data.blur) {
        //   pic.blur(data.blur);
        // }
        // if (data.posterize) {
        //   pic.posterize(data.posterize);
        // }
        // if (data.pixelate) {
        //   pic.pixelate(data.pixelate);
        // }
        // if (data.flip_v || data.flip_h) {
        //   pic.flip(data.flip_h, data.flip_v);
        // }
        // if (data.rotate) {
        //   pic.rotate(data.rotate);
        // }
        // if (data.bg !== 255) {
        //   pic.background(data.bg);
        // }
        // if (data.resize_y || data.resize_x) {
        //   if (data.resize_y && data.resize_x) {
        //     pic.resize(data.resize_x, data.resize_y);
        //   } else {
        //     pic.resize(data.resize_x || Jimp.AUTO, data.resize_y || Jimp.AUTO);
        //   }
        // }
