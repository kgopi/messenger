const express = require('express');

function startApp(config){
    const expressWs = require('express-ws')(express(), null, {
        wsOptions: {
            verifyClient: require("./middleware/VerifyClinent")
        }
    });
    const app = expressWs.app;

    // Configure the app based on config including Middleware
    require('./config/app')(app, config);

    const wss = expressWs.getWss('/');
    app.ws('/', require("./middleware/ConnectionHandler")(wss));
    require("./middleware/ConnectionManager")(wss);

    return app;
}

module.exports = startApp;