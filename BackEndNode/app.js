const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors')
require('dotenv/config')

app.use(cors())
app.use(bodyParser.json());



const customerRoute = require("./routes/customer")
app.use('/customer', customerRoute);
app.use('/uploads', express.static(__dirname + '/uploads'));



//catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//error handlers
//Catch unauthorised and other errors
app.use(function (err, req, res, next) {
    console.log("Error occured in API ", err.statusCode + "|" + err.status);
    res.status(err.statusCode || err.status || 500);
    res.send({
        status: "Error",
        statusCode: err.statusCode || err.status || 500,
        message: err.message
    })

});


const DB_URL = process.env.DB_CONNECTION;

mongoose.connect(DB_URL,
    { useNewUrlParser: true },
    () => console.log('Connectd to DB')
);

app.listen(3000);


// Event Emiiter example
const Logger = require('./events/Logger');
const logger = new Logger();

logger.on('logMessage', (arg) => {
    console.log("Listened value :", arg);
})


logger.logIt('logMessage', { name: 'John', age: 40 })



