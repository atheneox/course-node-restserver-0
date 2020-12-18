require('./config/config');
const express = require('express')
const app = express()
const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/user', function(req, res) {
    res.json('getUser')
})

app.post('/user', function(req, res) {
    let name = req.body.name;
    let age = req.body.age;

    if (req.body.name === undefined) {
        res.status(400).json({
            ok: false,
            msg: 'name is required'
        });
    } else {
        res.json({ name, age });
    }

})

app.put('/user/:id', function(req, res) {

    let id = req.params.id;
    res.json({ id });

})

app.delete('/user', function(req, res) {
    res.json('deleteUser')
})

app.listen(process.env.PORT, () => {
    console.log(`listen port: ${ process.env.PORT }`);
});