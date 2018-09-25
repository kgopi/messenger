import {UserEventMapping} from "../db/models";
import {db} from "../db";

export module UserEntitySubscription{
    
    export function subscribe(tenantId, params, callback){
        var query = UserEventMapping.insert(params).returning(UserEventMapping.star()).toQuery();
        db.connect(tenantId).query(query.text, query.values, callback);
    }

    export function unSubscribe({tenantId, userId, entityId, callback}){
        var query = UserEventMapping.delete().where(UserEventMapping.userId.equals(userId).and(UserEventMapping.entityId.equals(entityId))).toQuery();
        db.connect(tenantId).query(query.text, query.values, callback);
    }
}

