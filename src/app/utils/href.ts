'use strict';
import urls = require('../routes/urls');
import {config} from './../../config';
import qs = require('querystring');
import _ = require('lodash');

// regex lifted from urltree
const RE_MATCH_PARAM = new RegExp(':[a-z0-9_]+', 'gi');

// default host and version for building full urls
var host = config.apiHost;
var version = config.apiVersion;

/**
 * Inspects a route and returns a list of named params.
 */
function params(name) {
  const node = urls[name];
  const route = node.$route;

  const matched = route.match(RE_MATCH_PARAM);

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

  const route = urls[name];
  const routeParams = params(name);

  const url = host + '/' + version + route.build(parameters);

  // Seems to be not required, as the params are already added.

  /*// exclude params consumed by the route
  const qsParams = _.omit(parameters, routeParams);

  if (!_.isEmpty(qsParams)) {
    url = url + '?' + qs.stringify(qsParams);
  }*/

  return url;
}

export {
  configure,
  build,
  params
}
