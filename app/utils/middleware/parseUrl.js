'use strict';

/**
 * Middleware that does decoding url query parameters into JS object that can
 * be used throughout application. Object is stored in req.parameters.
 */

function stringToValue(string){

  if(string === 'true') return true;
  if(string === 'false') return false;
  if(string === 'null') return null;

  // return back string if not one of specified
  return string;
}

/**
 * Handles query string parameters and converts them from string
 * Error handling for defined parameters is done here and middleware responds
 */
function parseUrl(req, res, next) {
    var parameters = {};
    for(var key in req.query) {
        parameters[key] = stringToValue(req.query[key]);
    }
    req.parameters = parameters;
    next();
}

module.exports = parseUrl;
