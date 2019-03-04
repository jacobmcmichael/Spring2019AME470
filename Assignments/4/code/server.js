var MS = require("mongoskin");
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var hostname = process.env.HOSTNAME || 'localhost';
var port = 8080;


var db = MS.db("mongodb://3.91.161.113:27017/todo");

allTodos = [];

app.get("/", function (req, res) {
      res.redirect("/index.html");
});


app.get("/getAllTodos", function (req, res) {
  db.collection('data').find({}).toArray(function(err, items) {
    res.send(JSON.stringify(items));
  });
});


app.get("/editTodo", function (req, res) {
  var id = req.query.id;
  var newText = req.query.newText;
  db.collection("data").findOne({id: id}, function(err, result){
    result.text = newText;
    db.collection("data").save(result, function(e1,r1){
      db.collection('data').find({}).toArray(function(e2, items) {
        res.send(JSON.stringify(items));
      });
    });
  });
});

app.get("/deleteTodo", function (req, res) {
  var id = req.query.id;
  db.collection("data").remove({id: id}, function(err, result){
    db.collection("data").save(result, function(e1,r1){
      db.collection('data').find({}).toArray(function(e2, items) {
        res.send(JSON.stringify(items));
      });
    });
  });
});

app.get("/addTodo", function (req, res) {
    var text = req.query.text;
    var newTodo = {
      id: "id" + new Date().getTime(),
      text: text,
      ts:  new Date().getTime(),
      done: false
    };
    var cb = function(err0, result){
      var cb1 = function(err, items) {
        res.send(JSON.stringify(items));
      }
      db.collection('data').find({}).toArray(cb1);
    }
    db.collection("data").insert(newTodo, cb);
});





app.use(methodOverride());
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));
app.use(errorHandler());

console.log("Simple static server listening at http://" + hostname + ":" + port);
app.listen(port);
