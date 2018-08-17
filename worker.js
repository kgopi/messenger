var SCWorker = require('socketcluster/scworker');
var express = require('express');
var morgan = require('morgan');
var healthChecker = require('sc-framework-health-check');
const config = require("./config").configure(process.env);

class Worker extends SCWorker { 

run() {
    console.log('   >> Worker PID:', process.pid);
    const environment = this.options.environment, 
        app = express(),
        httpServer = this.httpServer, 
        scServer = this.scServer;
    process._worker = this;

    // Configure the app based on config including Middleware
    require('./config/app')(app, config);

    // http
    if (environment === 'dev') {
      app.use(morgan('dev'));
    }
    healthChecker.attach(this, app);
    httpServer.on('request', app);

    // ws
    scServer.on('connection', require("./middleware/ConnectionHandler"));
    scServer.addMiddleware(scServer.MIDDLEWARE_HANDSHAKE_SC, require("./middleware/VerifyClinent"));
  }
}

new Worker();