import {Event, UserEventMapping} from "./../db/models";
import {db} from "./../db";

export module EventService{
    
    export function makeItRead({tenantId, eventId, readVia, readOn, callback}){
        var query = Event.update({readVia, readOn}).where(Event.id.equals(eventId));
        db.connect(tenantId).query(query.text, query.values, callback);
    }

    export function insert({tenantId, params, callback}){
        var query = Event.insert(params).returning(Event.star()).toQuery();
        db.connect(tenantId).query(query.text, query.values, callback);
    }
    
    export function list({tenantId, userId, callback}){
        debugger;
        var query = Event.select(Event.star())
                         .from(Event.join(UserEventMapping).on(Event.id.equals(UserEventMapping.eventId)))
                         .where(UserEventMapping.isRead.equals(false).and(UserEventMapping.userId.equals(userId)))
                         .limit(100)
                         .order(Event.createdDate.desc)
                         .toQuery();
        db.connect(tenantId).query(query.text, query.values, callback);
    }
}

