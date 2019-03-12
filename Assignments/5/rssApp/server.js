var MS = require("mongoskin");
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var Client = require('node-rest-client').Client;
var client = new Client();

var hostname = process.env.HOSTNAME || 'localhost';
var port = 8080;
app.use(methodOverride());
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));
app.use(errorHandler());



var db = MS.db("mongodb://3.91.161.113:27017/rssApp");

allFeeds = [];

app.get("/", function (req, res) {
      res.redirect("/index.html");
});


app.get("/getAllFeeds", function (req, res) {
  db.collection('data').find({}).toArray(function(err, items) {
    res.send(JSON.stringify(items));
  });
});


app.get("/getFeedData", function (req, res) {
  var url = req.query.url;

  client.get(url, function (data, response) {
      // parsed response body as js object
      res.send(data);
  });
});


app.get("/editFeed", function (req, res) {
  var id = req.query.id;
  var newText = req.query.newText;
  db.collection("data").findOne({id: id}, function(err, result){
    result.title = newText;
    db.collection("data").save(result, function(e1,r1){
      db.collection('data').find({}).toArray(function(e2, items) {
        res.send(JSON.stringify(items));
      });
    });
  });
});



app.get("/deleteFeed", function (req, res) {
  var id = req.query.id;
  db.collection("data").remove({id: id}, function(err0, result0){
      db.collection('data').find({}).toArray(function(e2, items) {
        res.send(JSON.stringify(items));
      });
  });
});

app.get("/addFeed", function (req, res) {
    var text = req.query.text;
    var newFeed = {
      title: "Untitled",
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
    db.collection("data").insert(newFeed, cb);
});





console.log("Simple static server listening at http://" + hostname + ":" + port);
app.listen(port);
