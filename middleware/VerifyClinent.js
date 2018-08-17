const url = require('url');
const config = require("./../config");
const cryptor = require("./../app/utils/encryption");

module.exports = function VerifyClient(req, cb){
    console.log('VerifyClient');
    return cb();
    let query = url.parse(req.url, true).query;

    if(query.b2b){
        if(query.secret == null){
            console.error("Provided shared secret can not be blank.");
        }else if(cryptor.decrypt(query.secret) == config.mdaSecretKey){
            return cb();
        }
        const err = "Provided shared secret key is not matched.";
        console.error(err);
        return cb(err);
    }

    const token = process.scServer.authTokens[query.id];
    if(true){
        req.headers.userId = Date.now() + "qweqw" || token.userId;
        req.headers.tenantId = Date.now() + "qweqwe" || token.tenantId;
        return cb();
    }else{
        console.error(`Websocket connection rejected due to invalid token -- ${token}`);
        var err = new MyCustomHandshakeFailedError('Handshake failed');
        return cb(err);
    }
}