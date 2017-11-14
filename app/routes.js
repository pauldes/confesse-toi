var Todo = require('./models/todo');
var User = require('./models/user');
var path = require('path');
var appDir = path.dirname(require.main.filename);


/*
Fait le routage de l'API mais aussi les services
 */

function getTodos(res) {
    Todo.find(function (err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        res.json(todos); // return all sins in JSON format
    });
};

module.exports = function (app, passport) {

    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/todos', function (req, res) {
        // use mongoose to get all sins in the database
        getTodos(res);
    });

    // create sin and send back all sins after creation
    app.post('/api/todos', function (req, res) {

        // create a sin, information comes from AJAX request from Angular
        Todo.create({
            text: req.body.text,
            done: false
        }, function (err, created) {
            if (err)
                res.send(err);

            req.user.setOwner(created._id);

            // get and return all the todos after you create another
            getTodos(res);
        });

    });

    // delete a sin

    app.delete('/api/todos/:todo_id', function (req, res) {

        var user = req.user;
        var sinId = req.params.todo_id;

        if( !user.owns(sinId)){
            res.send("Unauthorized deletion");
            //getTodos(res);
        } else {
            Todo.remove({
                _id: req.params.todo_id
            }, function (err, todo) {
                if (err)
                    res.send(err);
                getTodos(res);
            });
        }
    });

    // upvote a sin

    app.post('/api/todos/up/:todo_id', function (req, res) {

        var user = req.user;
        var sinId = req.params.todo_id;

        if( user.owns(sinId)){
            res.send("Unauthorized upvote");
            //getTodos(res);
        } else {
            user.addToUpvotes(sinId);
            Todo.findOneAndUpdate({
                _id: req.params.todo_id
            },{
                $inc: { upvotes: 1 }
            },
            function (err, todo) {
                if (err)
                    res.send(err);
                getTodos(res);
            });}
    });


    // downvote a sin
    app.post('/api/todos/down/:todo_id', function (req, res) {

        var user = req.user;
        var sinId = req.params.todo_id;

        if( user.owns(sinId)){
            res.send("Unauthorized downvote");
            //getTodos(res);
        } else {
            user.addToDownvotes(sinId);
            Todo.findOneAndUpdate({
                    _id: req.params.todo_id
                }, {$inc: {downvotes: 1}}
                , function (err, todo) {
                    if (err)
                        res.send(err);

                    getTodos(res);
                });
        }
    });

    // application -------------------------------------------------------------
    app.get('/', function (req, res) {
        res.sendFile(appDir + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

    app.get('/posts', isLoggedIn, function (req, res) {
        res.sendFile(appDir + '/public/posts.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    req.flash('loginMessage', 'You need to log in first!')
    res.redirect('/login');
}
