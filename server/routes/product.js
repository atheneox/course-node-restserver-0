const express = require('express');
const Product = require('../models/product');

const { verifyToken, verifyAdminRole } = require('../middlewares/authentication');
const app = express();

// get all products
app.get('/products', (req, res) => {

    let from = req.query.from || 0;
    let limit = req.query.limit || 5;

    from = Number(from);
    limit = Number(limit);

    Product.find({ available: true })
        .limit(limit)
        .skip(from)
        .sort('name')
        .populate('user', 'name email')
        .populate('category', 'name')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: { msg: err }
                });
            }
            if (!products) {
                return res.status(400).json({
                    ok: false,
                    err: { msg: 'product not found' }
                });
            }
            Product.countDocuments({ available: true }, (err, count) => {
                res.json({
                    ok: true,
                    products,
                    count
                });
            })
        });

});

// get by Id
app.get('/product/:id', (req, res) => {

    let id = req.params.id;

    Product.find({ id, available: true }, '_id name description user')
        .populate('user', 'name email')
        .populate('category', 'name')
        .exec((err, product) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!product) {
                return res.status(400).json({
                    ok: false,
                    err: { msg: 'category not found' }
                });
            }
            Product.countDocuments({ _id: req.params.id, available: true }, (err, count) => {
                res.json({
                    ok: true,
                    product,
                    count
                });
            })
        });

});

app.get('/product/find/:param', verifyToken, (req, res) => {

    let term = req.params.param;

    let regex = new RegExp(term, 'i')

    Product.find({ name: regex })
        .populate('category', 'name')
        .populate('user', 'name')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                products
            });
        });

});
// save product
app.post('/product/', [verifyToken, verifyAdminRole], (req, res) => {

    let body = req.body;

    let product = new Product({
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        category: body.category,
        user: req.user._id
    });

    product.save((err, productDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: 'internal server error'
            });
        }
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            product: productDB
        });

    });

});

// update product
app.put('/product/:id', verifyToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Product.findById(id, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: 'product not found'
            });
        }

        productDB.name = body.name;
        productDB.unitPrice = body.unitPrice;
        productDB.category = body.category;
        productDB.available = body.available;
        productDB.description = body.description;

        productDB.save((err, productSaved) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                product: productSaved
            });
        });

    });

});

// delete product
app.delete('/product/:id', (req, res) => {

    let id = req.params.id;

    Product.findById(id, (err, productDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'product not found'
                }
            });
        }
        if (productDB.available === false) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'product not found'
                }
            });
        }

        productDB.available = false;
        productDB.save((err, productUpdated) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                product: productUpdated,
                msg: 'product removed successfully'
            });

        })

    });

});

module.exports = app;