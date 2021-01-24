const express = require('express');
const fs = require('fs');
const path = require('path');
const { verifyTokenImg } = require('../middlewares/authentication');

const app = express();

app.get('/image/:kind/:img', verifyTokenImg, (req, res) => {

    let _kind = req.params.kind;
    let _img = req.params.img;

    let pathImgUrl = path.resolve(__dirname, `../../uploads/${_kind}/${_img}`);

    if (fs.existsSync(pathImgUrl)) {
        res.sendFile(pathImgUrl);
    } else {
        let noImgPath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImgPath);
    }

});

module.exports = app;