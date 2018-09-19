import SCWorker = require("socketcluster/scworker");
import * as express from "express";
import * as morgan from "morgan";
import * as healthChecker from "sc-framework-health-check";
import {configure} from "./config";
const config = configure(process.env);

class Worker extends SCWorker {

  public options;
  public httpServer;
  public scServer;

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
      scServer.addMiddleware(scServer.MIDDLEWARE_PUBLISH_OUT, require("./middleware/publishOut"));
  }
}

new Worker();