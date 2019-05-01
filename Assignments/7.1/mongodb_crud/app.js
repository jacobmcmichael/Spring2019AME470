// Reference: https://github.com/noobcoder1137/Todo_Rest_CRUD_Application_JQuery_FetchAPI/blob/master/app.js
const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const Joi = require('joi');

var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var udb = require('./auth/db');
// var css = require('/css/style.css')
const db = require("./db");
const collection = "todo";
// const app = express();

passport.use(new Strategy(
    function (username, password, cb) {
        udb.users.findByUsername(username, function (err, user) {
            if (err) { return cb(err); }
            if (!user) { return cb(null, false); }
            if (user.password != password) { return cb(null, false); }
            return cb(null, user);
        });
    }));

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    udb.users.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});

// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/auth/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use('/css/style.css', express.static(__dirname + '/css/style.css'));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get('/',
    function (req, res) {
        res.render('home', { user: req.user });
    });

app.get('/login',
    function (req, res) {
        res.render('login');
    });

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    });

app.get('/logout',
    function (req, res) {
        req.logout();
        res.redirect('/');
    });

app.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function (req, res) {
        res.render('profile', { user: req.user });
    });

app.get('/todo_list',
    require('connect-ensure-login').ensureLoggedIn(),
    function (req, res) {
        res.sendFile(path.join(__dirname, 'index.html'));
    });

app.listen(3000);

// schema used for data validation for our todo document
const schema = Joi.object().keys({
    todo: Joi.string().required()
});

// parses json data sent to us by the user 
app.use(bodyParser.json());

// serve static html file to user
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });

// read
app.get('/getTodos', (req, res) => {
    // get all Todo documents within our todo collection
    // send back to user as json
    db.getDB().collection(collection).find({}).toArray((err, documents) => {
        if (err)
            console.log(err);
        else {
            res.json(documents);
        }
    });
});

// update
app.put('/:id', (req, res) => {
    // Primary Key of Todo Document we wish to update
    const todoID = req.params.id;
    // Document used to update
    const userInput = req.body;
    // Find Document By ID and Update
    db.getDB().collection(collection).findOneAndUpdate({ _id: db.getPrimaryKey(todoID) }, { $set: { todo: userInput.todo } }, { returnOriginal: false }, (err, result) => {
        if (err)
            console.log(err);
        else {
            res.json(result);
        }
    });
});


//create
app.post('/', (req, res, next) => {
    // Document to be inserted
    const userInput = req.body;

    // Validate document
    // If document is invalid pass to error middleware
    // else insert document within todo collection
    Joi.validate(userInput, schema, (err, result) => {
        if (err) {
            const error = new Error("Invalid Input");
            error.status = 400;
            next(error);
        }
        else {
            db.getDB().collection(collection).insertOne(userInput, (err, result) => {
                if (err) {
                    const error = new Error("Failed to insert Todo Document");
                    error.status = 400;
                    next(error);
                }
                else
                    res.json({ result: result, document: result.ops[0], msg: "Insertion successful!", error: null });
            });
        }
    })
});



//delete
app.delete('/:id', (req, res) => {
    // Primary Key of Todo Document
    const todoID = req.params.id;
    // Find Document By ID and delete document from record
    db.getDB().collection(collection).findOneAndDelete({ _id: db.getPrimaryKey(todoID) }, (err, result) => {
        if (err)
            console.log(err);
        else
            res.json(result);
    });
});

// Middleware for handling Error
// Sends Error Response Back to User
// app.use((err, req, res, next) => {
//     res.status(err.status).json({
//         error: {
//             message: err.message
//         }
//     });
// })

app.get('/users/:id', function (req, res, next) {
    var user = users.getUserById(req.params.id);
    if (user == null || user == 'undefined') {
        res.status(404);
    }
    res.json(user);
});


db.connect((err) => {
    // If err unable to connect to database
    // End application
    if (err) {
        console.log('unable to connect to database');
        process.exit(1);
    }
    // Successfully connected to database
    // Start up our Express Application
    // And listen for Request
    else {
        app.listen(27017, () => {
            console.log('connected to database, app listening on port 27017');
        });
    }
});