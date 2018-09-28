import {Event, UserEventMapping} from "./../db/models";
import {db} from "./../db";
import * as _ from "lodash";

const STATIC_USER_ID:string = "STATIC_USER_ID";

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
                    resolve(res.rows[0]);
                }
            });
        });
    }

    function insertUserEventMappings(tenantId, params){
        return new Promise(function(resolve, reject) {
            const userEventMappingQuery = UserEventMapping.insert(params).returning(UserEventMapping.star()).toQuery();
            db.connect(tenantId).query(userEventMappingQuery.text, userEventMappingQuery.values, (err, res)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(res.rows[0]);
                }
            });
        });
    }

    export function insert({tenantId, params, callback}){
        debugger;
        insertEvent(tenantId, _.omit(params, "to")).then((res:any)=>{
            if(params.to == null || params.to.length == 0){
                insertUserEventMappings(tenantId, {eventId: res.id, userId: STATIC_USER_ID, email: "staticuser@static.com"}).then(()=>{
                    return callback(null, res);
                }, callback);
            }else{
                const query = `INSERT INTO public."user_event_mapping" ("event_id", "user_id", "email") VALUES 
                    ${params.to.map(user => {
                        return `(${res.id}, '${user.id}', '${user.email}')`;
                    }).join(', ')}`;
                db.connect(tenantId).query(query, null, (err, result)=>{
                    callback(err, res);
                });
            }
        }, callback);
    }
    
    export function list({tenantId, userId, callback}){
        var query = Event.select(Event.star())
                         .from(Event.join(UserEventMapping).on(Event.id.equals(UserEventMapping.eventId)))
                         .where(UserEventMapping.isRead.equals(false).and(UserEventMapping.userId.in([userId, STATIC_USER_ID])))
                         .order(Event.createdDate.desc)
                         .limit(100)
                         .toQuery();
        db.connect(tenantId).query(query.text, query.values, callback);
    }
}