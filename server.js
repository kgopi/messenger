var express = require('express');

function startApp(config){
    var expressWs = require('express-ws')(express());
    var app = expressWs.app;

    // Configure the app based on config including Middleware
    require('./config/app')(app, config);

    const wss = expressWs.getWss('/');
    app.ws('/', require("./middleware/ConnectionHandler")(wss));
    require("./middleware/ConnectionManager")(wss);

    return app;
}

module.exports = startApp;