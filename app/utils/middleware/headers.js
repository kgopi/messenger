'use strict';

// add headers to every response
function addHeaders(req, res, next) {
  res.setHeader('Last-Modified', '{now} GMT');
  var cacheControl = 'max-age=0, no-cache, must-revalidate, proxy-revalidate';
  res.setHeader('Cache-Control', cacheControl);
  next();
}

module.exports = addHeaders;
