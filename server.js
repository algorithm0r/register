var start = function () {
    var that = this;
    var express = require("express");
    var bodyParser = require("body-parser");
    var morgan = require("morgan");

    var app = express();
    var port = 8888;

    var db = require('./db').DB;
    var bcrypt = require("bcrypt-nodejs");

    // we use a html template language jade
    // these lines setup the jade renderer and the views directory
    app.set('views', __dirname + '/tpl');
    app.set('view engine', "jade");
    app.engine('jade', require('jade').__express);
    
    // these lines setup middleware necessary for express
    app.use(morgan());
    app.use(bodyParser());
    app.use(express.static(__dirname + '/public'));  
    
    // app.{get, post} methods setup routes for us
    // the first argument is the address
    // the second argument is a function that handles the request and provides a response
    app.get("/", function (req, res) {
        res.render("login");
    });

    app.get('/reg', function (req, res) {
        res.render("register");
    });

    app.post('/reg', function (req, res, next) {
        // req.body.[field] contains the post information from the form
        // see for yourself and uncomment below

        // console.log(req.body);

        // if the two typed passwords match
        if (req.body.password === req.body.repassword) {
            // find if username is taken
            db.users.find({ username: req.body.username }, function (err, users) {
                // users is a list of records (possibly of size 1) we'll take the first one
                var user = users[0];
                // if the user exists
                if (user) {
                    res.send("Username taken.");
                }
                else {
                    // if user doesn't exist
                    // hash their password and
                    // add new user to database
                    bcrypt.hash(req.body.password, null, null, function (err, hash) {
                        db.users.insert({ username: req.body.username, password: hash, email: req.body.email });
                    });
                }
            });
        }
        else {
            res.send("Passwords don't match.");
        }
    });

    app.listen(port);
 }

exports.start = start;