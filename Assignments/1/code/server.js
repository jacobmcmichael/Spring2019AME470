var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var hostname = process.env.HOSTNAME || 'localhost';
var port = 8080;

app.get("/", function (req, res) {
      res.redirect("/index.html");
});

app.get("/hello", function (req, res) {
    var name = process.env.HOSTNAME;
    res.send("Hello "+ name +"!"); // send response body
});

app.get("/add", function (req, res) {
  var a = parseFloat(req.query.a);
  var b = parseFloat(req.query.b);
  var result = (a+b).toString();
  res.send(result); // send response body
});

app.get("/sub", function (req, res) {
  var a = parseFloat(req.query.a);
  var b = parseFloat(req.query.b);
  var result = (a-b).toString();
  res.send(result); // send response body
});

app.get("/mul", function (req, res) {
  var a = parseFloat(req.query.a);
  var b = parseFloat(req.query.b);
  var result = (a*b).toString();
  res.send(result); // send response body
});

app.get("/div", function (req, res) {
  var a = parseFloat(req.query.a);
  var b = parseFloat(req.query.b);
  var result = (a/b).toString();
  res.send(result); // send response body
});

app.use(methodOverride());
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));
app.use(errorHandler());

console.log("Simple static server listening at http://" + hostname + ":" + port);
app.listen(port);
