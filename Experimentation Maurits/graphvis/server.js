var express = require("express");
var path = require("path");
var svg = require("svg");
var routes = require("./routes");
var app = express();
var d3 = require("d3");
app.use(routes);
app.use(express.static('static'));
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.listen(app.get("port"), function(){
    console.log("Server started on port " + app.get("port"));
});

