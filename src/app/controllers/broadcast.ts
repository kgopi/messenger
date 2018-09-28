import {EventService} from "./../services/event";

function getParams(req, data){
    return {
        area: data.area,
        name: data.name,
        actorId: data.actorId,
        actorName: data.actorName,
        isHighPriority: data.isHighPriority || true,
        timeToLive: data.timeToLive || 365,
        title: data.title,
        body: data.body,
        data: data.data || {},
        replyToEmail: data.replyToEmail,
        entityId: data.entityId,
        to: data.to || []
    };
}

export default (req, res, next) => {
    const body = Array.isArray(req.body) ? req.body[0] : req.body;
    const params = getParams(req, body);
    EventService.insert({
        tenantId: req.headers.tenantId,
        params,
        callback: (err, data)=>{
            if(err){
                console.log("Failed to persist the event", err);
            }else{
                console.log(`Successfully inserted the event record ${data.id}.`);
            }
        }
    });
    if(params.to.length > 0){
        params.to.forEach(user => {
            req.exchange.publish(`broadcast/${req.headers.tenantId}/${user.id}`, params);
        });
    }else{
        req.exchange.publish(`broadcast/${req.headers.tenantId}`, params);
    }
    res.status(200).json({result: true});
    next();
}