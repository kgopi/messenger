'use strict';

import _ = require('lodash');

export default function bodyLogger() {
  return function(req, res, next) {
    req.log.info(req.body);
    next();
  };
}