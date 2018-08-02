"use strict";
var config = require('./../config').configure(process.env);
var http   = require('http');

var app = require('../server')(config);

// Start HTTP Server
app.listen((+config.listenPort), function(){
	console.log('API SERVER STARTED AT '+ config.listenPort);
});