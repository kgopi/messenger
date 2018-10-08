import {PreferencesService} from "./../services/preferences";
import {UserEntitySubscriptionService} from "./../services/user_entity_subscription";

export module PreferencesController{

    export function subscribe2Entity(req, res, next){
        let params = {
            userId: req.headers.userId,
            entityId: req.params.entityId,
            entityName: req.params.entityName
        }
        UserEntitySubscriptionService.subscribe(req.headers.tenantId, params, (err, result:any={})=>{
            if (err) { 
                req.log.warn('Failed to update entity preferences', err);
                if(err.code === "23505"){ // Ignore unique_violation
                    res.status(200).json(params);
                }else{
                    res.status(400).json({err});
                }
            }else{
                res.status(200).json(result.rows[0]);
            }
            next();
        });
    }

    export function unSubscribe2Entity(req, res, next){
        UserEntitySubscriptionService.unSubscribe({
            tenantId: req.headers.tenantId,
            userId: req.headers.userId,
            entityId: req.params.entityId,
            callback: (err, result)=>{
                if(err){
                    req.log.debug('Failed to un-subscribe entity preferences', err);
                    res.status(400).json({err});
                }else{
                    res.status(200).json(result.rows[0]);
                }
                next();
            }
        });
    }

    function getChannelSubscriptionParams(req, isSubscribed){
        const params = {userId: req.headers.userId, data: {}, isAdmin: req.headers.isAdmin || false};
        params.data["channelSubscriptions"] = {};
        params.data["channelSubscriptions"][req.params.media] = {isEnabled: isSubscribed};
        return params;
    }

    export function subscribe2Channel(req, res, next){
        let data = {
            userId: req.headers.userId,
            tenantId: req.headers.tenantId,
            params: getChannelSubscriptionParams(req, true),
            callback: (err, result)=>{
                if(err){
                    req.log.debug(`Failed to subscribe to ${req.params.eventName} channel`, err);
                    res.status(400).json({err});
                }else{
                    res.status(200).json(result.rows[0]);
                }
                next();
            }
        }
        PreferencesService.update(data);
    }

    export function unSubscribe2Channel(req, res, next){
        let data = {
            userId: req.headers.userId,
            tenantId: req.headers.tenantId,
            params: getChannelSubscriptionParams(req, false),
            callback: (err, result)=>{
                if(err){
                    req.log.debug(`Failed to subscribe to ${req.params.eventName} channel`, err);
                    res.status(400).json({err});
                }else{
                    res.status(200).json(result.rows[0]);
                }
                next();
            }
        }
        PreferencesService.update(data);
    }

    function getEventSubscriptionParams(req, isSubscribed){
        const params = {userId: req.headers.userId, data: {}, isAdmin: req.headers.isAdmin || false};
        params.data["eventSubscriptions"] = {};
        let events = params.data["eventSubscriptions"][req.params.area] = {events: {}};
        if(req.params.eventName == null){
            events[req.params.media] = isSubscribed;
        }else{
            let event = events[req.params.eventName] = {};
            event[req.params.media] = isSubscribed;
        }
        return params;
    }

    export function subscribe2Event(req, res, next){
        let data = {
            userId: req.headers.userId,
            tenantId: req.headers.tenantId,
            params: getEventSubscriptionParams(req, true),
            callback: (err, result)=>{
                if(err){
                    req.log.debug(`Failed to subscribe to ${req.params.eventName} event`, err);
                    res.status(400).json({err});
                }else{
                    res.status(200).json(result.rows[0]);
                }
                next();
            }
        }
        PreferencesService.update(data);
    }

    export function unSubscribe2Event(req, res, next){
        let data = {
            userId: req.headers.userId,
            tenantId: req.headers.tenantId,
            params: getEventSubscriptionParams(req, false),
            callback: (err, result)=>{
                if(err){
                    req.log.debug(`Failed to un-subscribe to ${req.params.event} event`, err);
                    res.status(400).json({err});
                }else{
                    res.status(200).json(result.rows[0]);
                }
                next();
            }
        }
        PreferencesService.update(data);
    }

    export function getUserPreferences(req, res, next){
        PreferencesService.get({tenantId: req.headers.tenantId, userId: req.headers.userId, callback: (err, result)=>{
            if(err){
                req.log.debug(`Failed to get peferences for the user ${req.headers.userId}`, err);
                res.status(400).json({err});
            }else{
                res.status(200).json(result.rows[0]);
            }
            next();
        }});
    }

}