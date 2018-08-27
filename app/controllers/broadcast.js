const cryptor = require("./../utils/encryption");
const ModelFactory = require("./../../app/db/models");

function broadcastEvent (req, res, next) {
    if(req.body && req.body[0]){
        const data = req.body[0];
        const EventsModel = ModelFactory.getEventsModel(req.headers.tenantId);
        new EventsModel({
            command: data.command,
            area: data.area,
            tenantId: req.headers.tenantId,
            userName: data.userName,
            userId: data.userId,
            targetUsers: (data.filters && data.filters.users) || [],
            data: data.data,
            visited: false
         }).save(function(err){
            if(err){
                console.log("Failed to persist the event", err);
            } 
        });
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
        res.status(400).json({result: false, message: "Invalid body, nothing to broadcast"});
    }
    next();
}
    
module.exports = broadcastEvent;