//Importing Express
const express = require("express");
// Importing Mongo DB
const mongoose = require("mongoose");
// Importing to parse connection string for mongoDB (Security)
require('dotenv/config');
//const passport = require('./config/')

//Initializing The Server
const app = express();

//For Passport Need the following imports
const passport = require('passport');
const flash = require('connect-flash');
var session = require("express-session")
let bodyParser = require("body-parser");
//Initializing for Passport Session Maintainence Not used in our case but is a good practice
app.use(
        session({
          secret: 'secret',
          resave: true,
          saveUninitialized: true
        })
      );

//Body Parser Middle ware To get from the request
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json());
// Configuration for Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//Importing the routes for User
app.use('/user',require('./Routes/users'));

console.log("Added Resources");
//Connection TO Database
mongoose.connect("mongodb+srv://taaha827:randompassword@cluster0-xezp5.mongodb.net/test?retryWrites=true&w=majority")
.then(()=>{
    console.log("Connected To Mongo Successfully.");
})
.catch(err =>{console.log("logging ERror"); console.log(err)});
//Starting the server
app.listen(process.env.PORT|| 8080);