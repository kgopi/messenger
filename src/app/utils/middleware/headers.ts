'use strict';
import cryptor from "./../encryption";

function addHeaders(req, res, next) {

  // add headers to every request
  const requestInfo = {tenantAuthInfo: {tenantId: "234234234"}, gsUserAuthInfo: {userId: "34123412312"}} || JSON.parse(cryptor.decrypt(req.headers.requestinfo));
  req.headers.tenantId = requestInfo.tenantAuthInfo.tenantId;
  req.headers.userId = requestInfo.gsUserAuthInfo.userId;

  // add headers to every response
  res.setHeader('Last-Modified', '{now} GMT');
  const cacheControl = 'max-age=0, no-cache, must-revalidate, proxy-revalidate';
  res.setHeader('Cache-Control', cacheControl);
  next();
}

module.exports = addHeaders;
