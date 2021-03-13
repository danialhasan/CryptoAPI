require('dotenv').config()
const express = require("express");
const path = require("path");
var app = express();
var viewsPath = path.join(__dirname + '/views')
var publicpath = path.join(__dirname, 'public')
var PORT = process.env.PORT || 5000;
app.use(express.static(path.join(__dirname, 'public')));
const {
    default: axios
} = require("axios");
const expressLayouts = require('express-ejs-layouts');

app.use(expressLayouts)
//don't use this unless you want to use a layout.ejs 
//(useless for a single static page)
app.set('view engine', 'ejs');
app.set('views', viewsPath)
app.set('layout', '../views/layout')

//routes 
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", '*'); //ANCHOR 
    /**
     * This should be set to 'https://cryptoapi.xyz' for security. If that is done,
     * you must also include 
     * res.setHeader('Vary': 'Origin');
     * 
     * Setting the Access - Control - Allow - Origin to * lets anyone make 
     * a connection to the server. Right now theres little to no risk 
     * because noone knows about this, but it's good to point out. 
     */
    res.setHeader("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next()
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/dashboard', require('./routes/dashboard.js'));
app.use('/users', require('./routes/users.js'));

app.use('/test', require('./routes/test.js'))
app.use('*', require('./routes/404.js'))

app.listen(PORT, console.log(`Listening on port ${PORT}`))