//Importing Express
const express = require("express");
// Importing Mongo DB
const mongoose = require("mongoose");
// Importing to parse connection string for mongoDB (Security)
require('dotenv/config');
//Initializing The Server
const app = express();

//For Passport Need the following imports
const passport = require('passport');
const flash = require('connect-flash');
var session = require("express-session"),
    bodyParser = require("body-parser");
//Initializing for Passport Session Maintainence Not used in our case but is a good practice
app.use(
        session({
          secret: 'secret',
          resave: true,
          saveUninitialized: true
        })
      );

//Body Parser Middle ware To get from the request
app.use(express.urlencoded({extended:false}));
// Configuration for Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Importing the routes for User
app.use('/user',require('./Routes/users'));


//Connection TO Database
mongoose.connect(process.env.DB_CONNECTION,{useNewUrlParser:true,useUnifiedTopology: true})
.then(()=>{
    console.log("Connected To Mongo Successfully.");
})
.catch(err => console.log(err));

//Starting the server
app.listen(8080);