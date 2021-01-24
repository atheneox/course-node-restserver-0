const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = new require('../models/user');
const { verifyToken, verifyAdminRole } = require('../middlewares/authentication');
const app = express();

app.get('/user', verifyToken, function (req, res) {

    let from = req.query.from || 0;
    let limit = req.query.limit || 5;

    from = Number(from);
    limit = Number(limit);

    User.find({}, '_id name email google role status img')
        .limit(limit)
        .skip(from)
        .exec((err, users) => {

            if (err) {

                return res.status(400).json({
                    ok: false,
                    err
                });

            }

            User.countDocuments({}, (err, count) => {

                res.json({
                    ok: true,
                    users,
                    count
                });

            })

        });

});

app.post('/user', [verifyToken, verifyAdminRole], function (req, res) {

    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    });

});

app.put('/user/:id', [verifyToken, verifyAdminRole], function (req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });

    });

});

app.delete('/user/:id', [verifyToken, verifyAdminRole], function (req, res) {

    let id = req.params.id;

    let changeStatus = {
        status: false
    }

    User.findByIdAndUpdate(id, changeStatus, { new: true }, (err, userDelete) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!userDelete) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'user not found'
                }
            });
        }

        res.json({
            ok: true,
            user: userDelete
        });

    });

});

module.exports = app;