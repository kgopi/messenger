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

    function getEventServiceParams(req, isSubscribed){
        const params = {userId: req.headers.userId, data: {}, isAdmin: req.headers.isAdmin || false};
        params.data[req.params.media] = {"areas": {}};
        params.data[req.params.media]["areas"][req.params.area] = {};
        params.data[req.params.media]["areas"][req.params.area][req.params.eventName] = isSubscribed;
        return params;
    }

    export function subscribe2Event(req, res, next){
        let data = {
            userId: req.headers.userId,
            tenantId: req.headers.tenantId,
            params: getEventServiceParams(req, true),
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
            params: getEventServiceParams(req, false),
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