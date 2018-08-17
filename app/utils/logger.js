'use strict';

const bunyan = require('bunyan'),
  uuid     = require('node-uuid'),
  _        = require('lodash');

const defaults = {
  name: 'messengerApi',
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

  log = bunyan.createLogger(options);

  log.level(bunyan.DEBUG);

  return pre;
}

function production() {
  log.level(bunyan.INFO);

  return pre;
}

exports.log = log;
exports.development = development;
exports.production = production;
