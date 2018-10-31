'use strict';

import bunyan = require('bunyan');
import uuid   = require('node-uuid');
import _      = require('lodash');
import {config} from './../../config';

const defaults = {
  name: 'messenger',
  src: true,
  serializers: {
    req: bunyan.stdSerializers.req,
    res: bunyan.stdSerializers.res,
    err: bunyan.stdSerializers.err
  }
};

const log = bunyan.createLogger(defaults);

function pre(req, res, next) {
  // add request id for whole request
  req.log = log.child({requestId: uuid.v4()});

  function logRequest(){
    res.removeListener('finish', logRequest);
    res.removeListener('close', logRequest);

    req.log.info({
      req: req,
      res: res
    });
  }

  // proxy end to output logging
  res.on('finish', logRequest);
  res.on('close', logRequest);

  next();
}

var prettyStdOut;

function development() {
  const PrettyStream = require('bunyan-prettystream');

  const options = _.clone(defaults);

  // clean up a preexisting stream so we don't get a memory leak
  if (prettyStdOut) {
    prettyStdOut.end();
  }

  prettyStdOut = new PrettyStream();
  prettyStdOut.pipe(process.stdout);

  _.defaults(options, {
    streams: [{
        level: 'debug',
        type: 'raw',
        stream: prettyStdOut
      }]
    }
  );

  const log = bunyan.createLogger(options);
  log.level(bunyan.DEBUG);
  return pre;
}

function production() {
  log.level(config.LOG_LEVEL);
  return pre;
}

export {
  log,
  development,
  production
}
