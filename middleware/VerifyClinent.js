const url = require('url');

module.exports = function VerifyClient(info, cb){
    let query = url.parse(info.req.url, true).query;

    if(query.server){ // #TODO Need to add auth logic for server connections
        return cb(true);
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