var Todo = require('./models/todo');

function getTodos(res) {
    Todo.find(function (err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        res.json(todos); // return all sins in JSON format
    });
};

module.exports = function (app) {

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
        }, function (err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            getTodos(res);
        });

    });

    // delete a sin
    app.delete('/api/todos/:todo_id', function (req, res) {
        Todo.remove({
            _id: req.params.todo_id
        }, function (err, todo) {
            if (err)
                res.send(err);

            getTodos(res);
        });
    });

    // upvote a sin
    app.upvote('/api/todos/:todo_id', function (req, res) {

        Todo.findOneAndUpdate({ _id: req.params.todo_id }, { $inc: { fieldToIncrement: 1 })
            .exec(function(err, db_res) {
                if (err) {
                    throw err;
                }
                else {
                    console.log(db_res);
                }
            });
    });

    // downvote a sin
    app.downvote('/api/todos/:todo_id', function (req, res) {

        Todo.findOneAndUpdate({ _id: req.params.todo_id }, { $inc: { fieldToIncrement: -1 })
            .exec(function(err, db_res) {
                if (err) {
                    throw err;
                }
                else {
                    console.log(db_res);
                }
            });
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
