import {Event, UserEventMapping} from "./../db/models";
import {db} from "./../db";
import * as _ from "lodash";

export module EventService{
    
    export function makeItRead({tenantId, eventId, readVia, readOn, callback}){
        var query = Event.update({readVia, readOn}).where(Event.id.equals(eventId));
        db.connect(tenantId).query(query.text, query.values, callback);
    }

    function insertEvent(tenantId, params){
        return new Promise(function(resolve, reject) {
            const eventQuery = Event.insert(_.omit(params, "to")).returning(Event.star()).toQuery();
            db.connect(tenantId).query(eventQuery.text, eventQuery.values, (err, res)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(res);
                }
            });
        });
    }

    function insertUserEventMappings(tenantId, params){
        return new Promise(function(resolve, reject) {
            const userEventMappingQuery = UserEventMapping.insert(params).returning(Event.star()).toQuery();
            db.connect(tenantId).query(userEventMappingQuery.text, userEventMappingQuery.values, (err, res)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(res);
                }
            });
        });
    }

    export function insert({tenantId, params, callback}){
        insertEvent(tenantId, _.omit(params, "to")).then((res:any)=>{

            if(params.to == null){
                return callback(null, res);
            }

            let eventData = res.rows[0];
            insertUserEventMappings(tenantId, {
                event_id: eventData.event_id,
                user_id: eventData.user_id,
                email: eventData.event_id
            }).then((userEventMappingResult)=>{
                callback(null, userEventMappingResult);
            }, callback);
        }, callback);
    }
    
    export function list({tenantId, userId, callback}){
        var query = Event.select(Event.star())
                         .from(Event.leftJoin(UserEventMapping).on(Event.id.equals(UserEventMapping.eventId)))
                         .where(UserEventMapping.isRead.equals(false).and(UserEventMapping.userId.equals(userId)))
                         .order(Event.createdDate.desc)
                         .limit(100)
                         .toQuery();
        db.connect(tenantId).query(query.text, query.values, callback);
    }
}