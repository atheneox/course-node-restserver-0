const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/user');
const Product = require('../models/product');

const fs = require('fs');
const path = require('path');

app.use(fileUpload());

app.put('/upload/:kind/:id', function (req, res) {
    let validExtensions = ['png', 'jpg', 'gift', 'jpeg'];
    let validKinds = ['user', 'product'];

    let shortName = '';
    let extension = '';
    let uploadPath = '';
    let filename = '';

    let _kind = req.params.kind;
    let _id = req.params.id;
    let _file;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    msg: 'No files were uploaded.'
                }
            });
    }

    if (validKinds.indexOf(_kind) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                msg: 'the alowed kinds are: ' + validKinds.join(', '),
                ext: _kind
            }
        });
    }

    _file = req.files.file;
    shortName = _file.name.split('.');
    extension = shortName[shortName.length - 1];

    if (validExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                msg: 'the alowed extensions are: ' + validExtensions.join(', '),
                ext: extension
            }
        });
    }

    filename = `${_id}-${new Date().getMilliseconds()}.${extension}`;

    uploadPath = `uploads/${_kind}/${filename}`;

    _file.mv(uploadPath, function (err) {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        if (_kind === 'user') {
            imgUser(_id, res, filename);
        }
        else {
            imgProduct(_id, res, filename);

        }

    });

});

function imgUser(id, res, fileName) {

    User.findById(id, (err, userDB) => {

        if (err) {
            dropFile(userDB.img, 'user');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'user not found'
                }
            });
        }

        dropFile(userDB.img, 'user');

        userDB.img = fileName;
        userDB.save((err, userSaved) => {

            res.json({
                ok: true,
                user: userSaved,
                img: fileName
            });

        });

    })

}

function imgProduct(id, res, fileName) {

    Product.findById(id, (err, productDB) => {

        if (err) {
            dropFile(productDB.img, 'product');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'product not found'
                }
            });
        }

        dropFile(productDB.img, 'product');

        productDB.img = fileName;
        productDB.save((err, productSaved) => {

            res.json({
                ok: true,
                user: productSaved,
                img: fileName
            });

        });

    })

}

function dropFile(imageName, kind) {

    let pathImgUrl = path.resolve(__dirname, `../../uploads/${kind}/${imageName}`);

    if (fs.existsSync(pathImgUrl)) {
        fs.unlinkSync(pathImgUrl);
    }

}

module.exports = app;