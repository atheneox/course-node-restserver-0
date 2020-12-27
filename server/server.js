require('./config/config');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/user'));

// db params
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
};

// db connection
try {
    mongoose.connect(process.env.URLDB, options);
    console.log(`success`);
} catch (error) {
    handleError(error);
    console.log(`something wrong`);
}

app.listen(process.env.PORT, () => {

    console.log(`listen port: ${ process.env.PORT }`);

});