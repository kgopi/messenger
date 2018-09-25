import {EventService} from "./../services/event";

export module EventsController{
    export function makeItRead(req, res, next){
        const eventId = req.params.id,
            readOn = req.params.readOn,
            readVia = req.params.readVia,
            tenantId = req.headers.tenantId;
        if(eventId){
            EventService.makeItRead({eventId, readOn, readVia, tenantId, callback: (err, data)=>{
                if(err){
                    res.status(501).json({result: false, message: `Failed to update the event, reason: ${err.message}`});
                }else{
                    res.status(200).json({result: true});
                }
            }});
        }else{
            res.status(400).json({result: false, message: "Invalid request, event id is must."});
        }
        next();
    }

    export function list(req, res, next){
        EventService.list({tenantId: req.headers.tenantId, userId: req.headers.userId, callback: (err, data)=>{
            if(err){
                res.status(400).json({result: false, message: `Failed to query the events, reason: ${err.message}`});
            }else{
                res.status(200).json(data);
            }
        }});
        next();
    }
}