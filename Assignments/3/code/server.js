var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var hostname = process.env.HOSTNAME || 'localhost';
var port = 8080;

allTodos = [];

app.get("/", function (req, res) {
      res.redirect("/index.html");
});

app.get("/getAllTodos", function (req, res) {
    res.send(JSON.stringify(allTodos));
});

app.get("/addTodo", function (req, res) {
    var text = req.query.text;
    var newTodo = {
      id: "id" + new Date().getTime(),
      text: text,
      ts:  new Date().getTime(),
      done: false
    }
    allTodos.push(newTodo);
    res.send(JSON.stringify(allTodos));
});

app.get("/editTodo", function (req, res) {
  var index = req.query.index;
  var newText = req.query.newText;

  allTodos[index].text = newText;
  res.send(JSON.stringify(allTodos));
});

app.get("/deleteTodo", function (req, res) {
  var index = req.query.index;

  allTodos.splice(index, 1);
  res.send(JSON.stringify(allTodos));
});

app.use(methodOverride());
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));
app.use(errorHandler());

console.log("Simple static server listening at http://" + hostname + ":" + port);
app.listen(port);
