const express = require('express');
const _ = require('underscore');

const Category = require('../models/category');
const { verifyToken, verifyAdminRole } = require('../middlewares/authentication');
const app = express();

// get all categories
app.get('/category', verifyToken, (req, res) => {

    let from = req.query.from || 0;
    let limit = req.query.limit || 5;

    from = Number(from);
    limit = Number(limit);

    Category.find({})
        .limit(limit)
        .skip(from)
        .sort('name')
        .populate('user', 'name email')
        .exec((err, categories) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: { msg: 'category not found' }
                });
            }
            Category.countDocuments({}, (err, count) => {
                res.json({
                    ok: true,
                    categories,
                    count
                });
            })
        });

});

//get category by Id
app.get('/category/:id', (req, res) => {

    Category.find({ _id: req.params.id }, '_id name description user')
        .exec((err, category) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!category) {
                return res.status(400).json({
                    ok: false,
                    err: { msg: 'category not found' }
                });
            }

            Category.countDocuments({}, (err, count) => {

                res.json({
                    ok: true,
                    category,
                    count
                });

            })

        });

});

//add new category
app.post('/category', verifyToken, (req, res) => {

    let body = req.body;

    let category = new Category({
        name: body.name,
        description: body.description,
        user: req.user._id
    });

    category.save((err, categoryDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        });
    });

});

//update category by Id
app.put('/category/:id', verifyToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'description']);

    Category.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, categoryDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        });
    });

});

//delete category by Id
app.delete('/category/:id', [verifyToken, verifyAdminRole], (req, res) => {

    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'category not found'
                }
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        });

    });

});

module.exports = app;