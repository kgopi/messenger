'use strict';
var urls = require('../routes/urls');
var config = require('./../../config');
var qs = require('querystring');
var _ = require('lodash');

// regex lifted from urltree
var RE_MATCH_PARAM = new RegExp(':[a-z0-9_]+', 'gi');

// default host and version for building full urls
var host = config.apiHost;
var version = config.apiVersion;

/**
 * Inspects a route and returns a list of named params.
 */
function params(name) {
  var node = urls[name];
  var route = node.$route;

  var matched = route.match(RE_MATCH_PARAM);

  return _.map(matched, function removeColon(param) {
    return param.replace(/^:/, '');
  });
}

/**
 * function for configuring host, version and new urls set
 * used by configure middleware to set actual host and version
 */
function configure(newHost, newVersion) {
  host = newHost;
  version = newVersion;
}

/*
 * builds full href for given urltree route and needed parameters
 * for child urltree routes it builds full path with parents
 */
function build(name, parameters) {
  if (undefined === parameters) parameters = {};
  // protect against null parameter values
  if (parameters) {
    _.each(parameters, function(value) {
      if (_.isNull(value)) {value = undefined;}
    });
  }

  var route = urls[name];
  var routeParams = params(name);

  var url = host + '/' + version + route.build(parameters);

  // Seems to be not required, as the params are already added.

  /*// exclude params consumed by the route
  var qsParams = _.omit(parameters, routeParams);

  if (!_.isEmpty(qsParams)) {
    url = url + '?' + qs.stringify(qsParams);
  }*/

  return url;
}

exports.configure = configure;
exports.build = build;
exports.params = params;
