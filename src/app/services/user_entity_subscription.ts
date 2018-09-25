import {UserEntitySubscription} from "../db/models";
import {db} from "../db";

export module UserEntitySubscriptionService{
    
    export function subscribe(tenantId, params, callback){
        var query = UserEntitySubscription.insert(params).returning(UserEntitySubscription.star()).toQuery();
        db.connect(tenantId).query(query.text, query.values, callback);
    }

    export function unSubscribe({tenantId, userId, entityId, callback}){
        var query = UserEntitySubscription.delete().where(UserEntitySubscription.userId.equals(userId).and(UserEntitySubscription.entityId.equals(entityId))).toQuery();
        db.connect(tenantId).query(query.text, query.values, callback);
    }
}

