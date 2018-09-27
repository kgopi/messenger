import {config} from "./../../config";
import jwt = require("jsonwebtoken");

function getJwtToken({tenantId, userId}){
  return jwt.sign({tenantId, userId}, config.mdaSecretKeyPassword, {
      expiresIn: 60 // one minute
  });
}

export function getAuthToken (req, res, next) {

  if(req.headers.requestinfo == null){
    next("Invalid request, requestinfo is must");
  }

  const token = getJwtToken({
    userId: req.headers.userId,
    tenantId: req.headers.tenantId,
  });
  res.status(200).json({token});
  next();
}