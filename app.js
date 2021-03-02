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
    res.setHeader("Access-Control-Allow-Origin", '*');
    res.setHeader("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next()
});
/**
 * For now, I am going to seperate the project into the index (landing page),
 * login page, and the dashboard. 
 * 
 * Landing page: where you can get a link to sign in/log in
 * Login page: where you can sign up/log in with fb/google (external
 * authentication)
 * Dashboard: Where API is used and you can see crypto prices.  
 */

// Routes
app.use('/', require('./routes/index.js'));
app.use('/dashboard', require('./routes/dashboard.js'));
app.use('/users', require('./routes/users.js'));

app.use('/test', require('./routes/test.js'))
app.use('*', require('./routes/404.js'))

app.listen(PORT, console.log(`Listening on port ${PORT}`))