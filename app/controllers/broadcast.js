const cryptor = require("./../utils/encryption");

function broadcastEvent (req, res, next) {
    if(req.body && req.body[0]){
        const data = req.body[0];
        if(data.filters && data.filters.users){
            data.filters.users.forEach(userId => {
                req.exchange.publish(`broadcast/${req.headers.tenantId}/${userId}`, data);
            });
        }else{
            req.exchange.publish(`broadcast/${req.headers.tenantId}`, data);
        }
        res.status(200).json({result: true});
    }else{
        console.log("Nothing to broadcast");
        res.status(401).json({result: false, message: "Invalid body, nothing to broadcast"});
    }
    next();
}
    
module.exports = broadcastEvent;