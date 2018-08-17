"use strict";
const config = require('./../config').configure(process.env);
const http   = require('http');
const app = require('../server')(config);

// Start HTTP Server
const server = app.listen(+config.listenPort, function(){
	console.log('API SERVER STARTED AT '+ config.listenPort);
});