import {EventService} from "./../services/event";

function getParams(req, data){
    return {
        tenantId: req.headers.tenantId,
        area: data.area,
        name: data.name,
        actorId: data.actorId,
        actorName: data.actorName,
        isHighPriority: data.isHighPriority || true,
        timeToLive: data.timeToLive,
        title: data.title,
        body: data.body,
        data: data.data,
        replyToEmail: data.replyToEmail,
        entityId: data.entityId,
        to: data.to || []
    };
}

export default (req, res, next) => {
    if(req.body){
        const data = Array.isArray(req.body) ? req.body[0] : req.body;
        EventService.insert({
            tenantId: req.headers.tenantId,
            params: getParams(req, data),
            callback: (err, data)=>{
                if(err){
                    console.log("Failed to persist the event", err);
                }else{
                    console.log(`Successfully inserted the event record ${data.id}.`);
                }
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
        console.log("Invalid body, nothing to broadcast", req.body);
        res.status(400).json({result: false, message: "Invalid body, nothing to broadcast"});
    }
    next();
}