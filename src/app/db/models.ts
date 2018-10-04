const sql = require('sql');

function suffixTenantId(entityName, tenantId:string){
        return entityName || `${entityName}_${tenantId.replace(/_/g, '')}`;
}

export function getEventModel(tenantId){
        return sql.define({
                name: suffixTenantId('event', tenantId),
                columns: [
                        { name: 'id', property: 'id' },
                        { name: 'area', property: 'area' },
                        { name: 'name', property: 'name' },
                        { name: 'actor_id', property: 'actorId' },
                        { name: 'actor_name', property: 'actorName' },
                        { name: 'is_high_priority', property: 'isHighPriority' },
                        { name: 'time_to_live', property: 'timeToLive' },
                        { name: 'title', property: 'title' },
                        { name: 'body_html', property: 'bodyHtml' },
                        { name: 'body_text', property: 'bodyText' },
                        { name: 'data', property: 'data' },
                        { name: 'reply_to_email', property: 'replyToEmail' },
                        { name: 'entity_id', property: 'entityId' },
                        { name: 'created_date', property: 'createdDate' }
                ]
        });
}

export function getUserEventMappingModel(tenantId){
        return sql.define({
                name: suffixTenantId('user_event_mapping', tenantId),
                columns: [
                        { name: 'id', property: 'id' },
                        { name: 'event_id', property: 'eventId' },
                        { name: 'user_id', property: 'userId' },
                        { name: 'is_read', property: 'isRead' },
                        { name: 'email', property: 'email' },
                        { name: 'read_via', property: 'readVia' },
                        { name: 'read_on', property: 'readOn' },
                        { name: 'is_email_delivered', property: 'isEmailDelivered' },
                        { name: 'email_message_id', property: 'emailMessageId' }
                ]
        });
}

export function getPreferencesModel(tenantId){
        return sql.define({
                name: suffixTenantId('preferences', tenantId),
                columns: [
                        { name: 'user_id', property: 'userId' },
                        { name: 'is_admin', property: 'isAdmin' },
                        { name: 'data', property: 'data' }
                ]
        });
}

export function getUserEntitySubscriptionModel(tenantId){
        return sql.define({
                name: suffixTenantId('user_entity_subscription', tenantId),
                columns: [
                        { name: 'user_id', property: 'userId' },
                        { name: 'entity_id', property: 'entityId' },
                        { name: 'entity_name', property: 'entityName' }
                ]
        });
}