const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
var request  = require('request');
const { ensure } = require('../config/auth');

// Load User model
const User = require('../Models/UserCredentials');
const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
//Defining the local Strategy for passport
passport.use(new LocalStrategy({ usernameField: 'email' },
    function (email, password, done) {
        try {
            //Finding user through thier email
            User.findOne({ email: email }, function (err, user) {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }

                //If Password match in future will add to use encryption here
                if (user.password === password) {
                    return done(null, user);
                }
                //If Password are not the same     
                else {
                    return done(null, false, { message: 'Incorrect username.' });
                }
            });
        } catch (err) {
            throw err;
        }
    }
));

//Necessary Functions For Passport (Internal Implementation)
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

//API route for updating Password
router.post('/updatePassword', (req, res) => {
    const email = req.email;
    const password = req.password;
    User.findOneAndUpdate({ email: email }, { $set: { password: password } }, { upsert: true }, function (err) {
        res.status(500).send({ message: "Could Not Update Password" });
    });

});

// Register
router.post('/register', (req, res) => {
    //Deconstructing the recieved Object  
	console.log(req.body);
    const { email, password, password2,type } = req.body;
    if (!email || !password || !password2) {
        res.status(400).send({ message: 'All fields Not Entered' });
        return;
    }
    //These are format checks need to discusss and just simply add those restrictions
    if (password.length < 6) {
        // Password Is less then 6 characters
        res.status(401).send({ message: "Password Does not match Requirements" });
        return;
    }


    if (password != password2) {
        // Password Does not match
        res.status(402).send({ message: "Passwords dont match" });
        return;
    }
    //Checking if there is a user with same email
    User.findOne({ email: email }).then(user => {
        if (user) {
            // User Already Exists
            res.status(403).send({ message: "Email already exists" });
            return;
        } else {
            const newUserCredentials = new User({
                email,
                password
            });
            //Saving the new User 
            newUserCredentials
                .save()
                .then(user => {
                })
                .catch(err => {
                });
                if(type ==="customer"){
                    request.post(request.post("http://powerful-peak-07170.herokuapp.com/customer/create/",{form:{
                        firstName:req.body.firstName,
                        lastName:req.body.lastName,
                        phone:req.body.phone,
                        email:email
                }},(err,response,body)=>{
                        if (!err && response.statusCode == 200) {
                            res.status(200).send({ customerId:response.body,message: "User Created Successfully" });
                            return;
                        }
                        else{
                            //User Credential Created Customer Not created
                        res.status(501).send({ message: "Couldnt Save User" });
                        return;
    }
                    
                }));    
            }
                else if(type ==="owner"){
                    // Change this address to this while deploying
                    request.post("http://powerful-peak-07170.herokuapp.com/owner/create/",{form:{
                            firstName:req.body.firstName,
                            lastName:req.body.lastName,
                            phone:req.body.phone,
                            email:email
                    }},(err,response,body)=>{
                        if (!err && response.statusCode == 200) {
                            console.log(response.body);
                            res.status(200).send({OwnerId:response.body, message: "User Created Successfully" });
                            return;
                        }
                        else{
                            //User Credential Created Owner not added in collection 
                            res.status(502).send({ message: "Couldnt Save User" });
                        return;
    }
                    });
                }
        }
    });

});

// Tested
router.get('/successLogin', (req, res) => {
    return res.status(200).send({email:req.user.email});
});

//Tested
router.get('/failedLogin', (req, res) => {
    console.log(req.body);
    res.status(420).json({ message: "Login Un-Successfull" });
    return;
});



// Login
router.post('/login', (req, res, next) => {
    try {
        console.log(req.body);
        console.log("In Login Route call passport authenticate");
        passport.authenticate('local', {
            successRedirect: '/user/successLogin/',
            failureRedirect: '/user/failedLogin',
            failureFlash: false
        })(req, res, next);
        console.log("After Passport.authenticate");
    }
    catch (err) {
        console.log("Exception");
        return;
    }
});

router.get('/logout', (req, res) => {
    req.logout();
    res.status(200).send("Logged out");
});


module.exports = router;