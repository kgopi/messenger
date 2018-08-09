const uuid = require('uuid');
const cryptor = require("./../utils/encryption");
var url = require('url');

process.authTokens = {};

function getAuthToken (req, res, next) {
  const token = uuid.v1();
  let query = url.parse(req.url, true).query;

  const requestInfo = JSON.parse(cryptor.decrypt(req.headers.requestinfo));
  process.authTokens[token] = {
    userId: requestInfo.gsUserAuthInfo.userId,
    tenantId: requestInfo.tenantAuthInfo.tenantId
  };
  res.status(200).json({token});
  setTimeout((_token)=>{
    delete process.authTokens[_token];
  }, 20 * 1000, token);
  next();
}
  
module.exports = getAuthToken;