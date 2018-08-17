const uuid = require('uuid');
const cryptor = require("./../utils/encryption");
var url = require('url');

function getAuthToken (req, res, next) {
  const token = uuid.v1();
  let query = url.parse(req.url, true).query;

  //const requestInfo = JSON.parse(cryptor.decrypt(req.headers.requestinfo));
  let eve = {type: "REG_TOKEN", data: {
    tokenId: token,
    tokenMappings : {
      userId: "asdasd",//requestInfo.gsUserAuthInfo.userId,
      tenantId: "asdasdsa"//requestInfo.tenantAuthInfo.tenantId
    }
  }};

  process._worker.sendToMaster(eve, ()=>{
    console.log('sendToMaster')
  });

  res.status(200).json({token});
  setTimeout((_token)=>{
    //delete process.scServer.authTokens[_token];
  }, 20 * 1000, token);
  next();
}
  
module.exports = getAuthToken;