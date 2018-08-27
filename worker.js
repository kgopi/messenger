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

    // Configure the app based on config including Middleware
    require('./config/app')(app, config);

    // DB
    require("./app/db").connect();

    // http
    if (environment === 'dev') {
      app.use(morgan('dev'));
    }
    healthChecker.attach(this, app);
    httpServer.on('request', app);

    // ws
    scServer.on('connection', require("./middleware/ConnectionHandler"));
    scServer.addMiddleware(scServer.MIDDLEWARE_HANDSHAKE_SC, require("./middleware/VerifyClinent"));
    scServer.addMiddleware(scServer.MIDDLEWARE_PUBLISH_OUT,
      function (req, next) {
        const targetUserId = req.socket.userId;
        const notifierUserId = req.data.userId;

        if(req.socket.tenantId != req.data.tenantId){
          console.log(`Invalid target-tenant ${req.socket.tenantId} to listen the event of tenant ${req.data.tenantId}`);
          return next(true);
        }

        if(/^broadcast/.test(req.channel) && targetUserId === notifierUserId){
          console.info(`User ${targetUserId} is not eligible for listening his own event`);
          next(true);
        }else{
          next();
        }
      }
    );
  }
}

new Worker();
