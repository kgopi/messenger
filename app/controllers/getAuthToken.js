const uuid = require('uuid');
const base64 = require('base-64');
const jose = require('node-jose');
var url = require('url');

process.authTokens = {};

function getAuthToken (req, res, next) {
  const token = uuid.v1();
  let query = url.parse(req.url, true).query;
  process.authTokens[token] = { // #TODO, need to extract userId & tenantId from request info
    userId: query.userId,
    tenantId: query.tenantId
  };
  res.status(200).json({token});
  setTimeout((_token)=>{
    delete process.authTokens[_token];
  }, 20 * 1000, token);
  next();
}
  
module.exports = getAuthToken;