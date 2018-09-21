import SCWorker = require("socketcluster/scworker");
import * as express from "express";
import * as morgan from "morgan";
import * as healthChecker from "sc-framework-health-check";
import {configureApp} from "./config/app";
import {initConfig} from "./config";
import {default as ConnectionHandler} from "./middleware/ConnectionHandler";
import {VerifyClient} from "./middleware/VerifyClinent";
import {PublishOutHandler} from "./middleware/publishOut";

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

      const config = initConfig(process.env);

      // Configure the app based on config including Middleware
      configureApp(app, config);

      // http
      if (environment === 'dev') {
        app.use(morgan('dev'));
      }
      healthChecker.attach(this, app);
      httpServer.on('request', app);

      // ws
      scServer.on('connection', ConnectionHandler);
      scServer.addMiddleware(scServer.MIDDLEWARE_HANDSHAKE_SC, VerifyClient);
      scServer.addMiddleware(scServer.MIDDLEWARE_PUBLISH_OUT, PublishOutHandler);
  }
}

new Worker();