;
(function() {
        "use strict";

        var PORT = 3000;

        var fs = require('fs');

        var express = require('express');
        var bodyParser = require('body-parser');
        var cookieParser = require('cookie-parser');
        var expressSession = require('express-session');

        var config = require('./config.js');

        var app = express();

        var mongoose = require('mongoose');

        mongoose.connect('mongodb://localhost');


        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        app.use(cookieParser());
        app.use(expressSession({
            secret: config.secret,
            resave: true,
            saveUninitialized: true
        }));

        var Message = mongoose.model('Message', {
            text: String,
            username: String
        });

        var User = mongoose.model('User', {
            username: String,
            password: String
        });

        app.get("/", function(req, res) {
            if (!req.session.username) {
                res.redirect("/login");
                return;
            }

            res.sendFile(__dirname + "/public/index.html");
        });

        app.get("/messages", function(req, res) {
            if (!req.session.username) {
                res.send("[]");
                return;
            }

            Message.find({}, 'text username', function(err, data) {
                if (err) {
                    res.send('[]');
                    return;
                }
                res.send(JSON.stringify(data));
            });
        });

        app.post("/messages", function(req, res) {
            if (!req.session.username) {
                res.send("error");
                return;
            }

            if (!req.body.newMessage) {
                res.send("error");
                return;
            }

            // create a new message based on user input!
            var message = new Message({
                text: req.body.newMessage,
                username: req.session.username
            });
            //save the message to the database with an error check!
            message.save(function(err) {
                if (err) {
                    res.send('Error!');
                    return;
                }
                res.send('Success!');
            });
        });


        app.get('/user', function(req, res) {
            res.sendFile(__dirname + '/public/user.html');
        });

        app.get("/login", function(req, res) {
            res.sendFile(__dirname + '/public/login.html');
        });

        app.post('/user', function(req, res) {
            var user = new User({
                username: req.session.username,
                password: req.session.password
            });

            user.save(function(err) {
                if (err) {
                    res.send('Error!');
                    return;
                }
                res.send('Thank you for creating an account!');
            });
        });

        function logInUser(username, password, callback) {
            User.find({
                username: username,
                password: password
            }, "username", callback);
        }

        app.post("/login", function(req, res) {
                if (req.body.username && req.body.password) {
                    logInUser(req.body.username, req.body.password, function(err, data) {
                            if (err) {
                                res.redirect("/login");
                                return;
                            }
                            req.session.username = req.body.username;
                            res.redirect("/");
                            return;
													});
                       }
                    });
            app.use(express.static('public'));

            app.use(function(req, res, next) {
                res.status(404);
                res.send("File not found");
            });

            app.listen(PORT, function() {
                console.log("server started on port " + PORT);
            });

        }());
