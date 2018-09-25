import {PreferencesService} from "./../services/preferences";
import {UserEntitySubscription} from "./../services/user_entity_subscription";

export module PreferencesController{

    export function subscribe2Entity(req, res, next){
        let params = {
            userId: res.headers.userId,
            entityId: res.params.entityId,
            entityName: res.params.entityName
        }
        UserEntitySubscription.subscribe(req.headers.tenantId, params, (err, res)=>{
            if(err){
                req.log.debug('Failed to update entity preferences', err);
                res.status(400).json({err});
            }else{
                res.status(200).json(res);
            }
        });
        next();
    }

    export function unSubscribe2Entity(req, res, next){
        UserEntitySubscription.unSubscribe({
            tenantId: req.headers.tenantId,
            userId: res.headers.userId,
            entityId: res.params.entityId,
            callback: (err, res)=>{
                if(err){
                    req.log.debug('Failed to un-subscribe entity preferences', err);
                    res.status(400).json({err});
                }else{
                    res.status(200).json(res);
                }
            }
        });
        next();
    }

    function getEventServiceParams(req, isSubscribed){
        const params = {};
        params[req.params.media] = {"areas": {}};
        params[req.params.media]["areas"][req.params.area] = {};
        params[req.params.media]["areas"][req.params.area][req.params.event] = isSubscribed;
        return params;
    }

    export function subscribe2Event(req, res, next){
        let data = {
            userId: res.headers.userId,
            tenantId: res.headers.tenantId,
            params: getEventServiceParams(req, true),
            callback: (err, res)=>{
                if(err){
                    req.log.debug(`Failed to subscribe to ${req.params.event} event`, err);
                    res.status(400).json({err});
                }else{
                    res.status(200).json(res);
                }
            }
        }
        PreferencesService.update(data);
        next();
    }

    export function unSubscribe2Event(req, res, next){
        let data = {
            userId: res.headers.userId,
            tenantId: res.headers.tenantId,
            params: getEventServiceParams(req, false),
            callback: (err, res)=>{
                if(err){
                    req.log.debug(`Failed to un-subscribe to ${req.params.event} event`, err);
                    res.status(400).json({err});
                }else{
                    res.status(200).json(res);
                }
            }
        }
        PreferencesService.update(data);
        next();
    }

    export function getUserPreferences(req, res, next){
        PreferencesService.get({tenantId: req.headers.tenantId, userId: req.headers.userId, callback: (err, res)=>{
            if(err){
                req.log.debug(`Failed to get peferences for the user ${req.headers.userId}`, err);
                res.status(400).json({err});
            }else{
                res.status(200).json(res);
            }
        }});
        next();
    }

}