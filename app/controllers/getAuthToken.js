const uuid = require('uuid');
const cryptor = require("./../utils/encryption");
var url = require('url');
const config = require("./../../config");
const jwt = require("jsonwebtoken");

function getJwtToken({tenantId, userId}){
  return jwt.sign({tenantId, userId}, config.mdaSecretKeyPassword, {
      expiresIn: 60 // one minute
  });
}

function getAuthToken (req, res, next) {

  if(req.headers.requestinfo == null){
    next("Invalid request, requestinfo is must");
  }

  const requestInfo = JSON.parse(cryptor.decrypt(req.headers.requestinfo));
  const token = getJwtToken({
    userId: requestInfo.gsUserAuthInfo.userId,
    tenantId: requestInfo.tenantAuthInfo.tenantId
  });
  res.status(200).json({token});
  next();
}
  
module.exports = getAuthToken;