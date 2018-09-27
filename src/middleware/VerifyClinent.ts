const url = require('url');
import {config} from "./../config";
import {default as cryptor} from "./../app/utils/encryption";
const jwt = require("jsonwebtoken");

export function VerifyClient(scServerSocket, cb){
    let req = scServerSocket.socket.request;
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

    jwt.verify(query.id, config.mdaSecretKeyPassword, function(err, decoded) {
        if (err) {
            console.log(`Websocket connection rejected due to invalid token -- ${query.id}`);
            cb('Handshake failed');
        }else{
            req.headers.userId = decoded.userId;
            req.headers.tenantId = decoded.tenantId;
            cb();
        }
      });
}