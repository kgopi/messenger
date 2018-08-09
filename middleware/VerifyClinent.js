const url = require('url');
const config = require("./../config");
const cryptor = require("./../app/utils/encryption");

module.exports = function VerifyClient(info, cb){
    let query = url.parse(info.req.url, true).query;

    if(query.b2b){
        if(query.secret == null){
            console.error("Provided shared secret can not be blank.");
        }else if(cryptor.decrypt(query.secret) == config.mdaSecretKey){
            return cb(true);
        }
        console.error("Provided shared secret key is not matched.");
        return cb(false);
    }

    const token = process.authTokens[query.id];
    if(token){
        info.req.headers.userId = token.userId;
        info.req.headers.tenantId = token.tenantId;
        return cb(true);
    }else{
        console.info(`Websocket connection rejected due to invalid token -- ${token}`);
        return cb(false);
    }
}