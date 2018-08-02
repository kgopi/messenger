'use strict';

var _ = require('lodash');

function bodyLogger() {
  return function(req, res, next) {
    req.log.info(req.body);
    next();
  };
}

module.exports = bodyLogger;
