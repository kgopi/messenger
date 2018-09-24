const sql = require('sql');


/**
 * SQL definition for public.event
 */
export const Event = sql.define({
        name: 'event',
        columns: [
                { name: 'id', property: 'id' },
                { name: 'area', property: 'area' },
                { name: 'name', property: 'name' },
                { name: 'actor_id', property: 'actorId' },
                { name: 'actor_name', property: 'actorName' },
                { name: 'is_high_priority', property: 'isHighPriority' },
                { name: 'time_to_live', property: 'timeToLive' },
                { name: 'title', property: 'title' },
                { name: 'body', property: 'body' },
                { name: 'data', property: 'data' },
                { name: 'reply_to_email', property: 'replyToEmail' },
                { name: 'entity_id', property: 'entityId' },
                { name: 'created_date', property: 'createdDate' }
        ]
});


/**
 * SQL definition for public.preferences
 */
export const Preferences = sql.define({
        name: 'preferences',
        columns: [
                { name: 'user_id', property: 'userId' },
                { name: 'is_admin', property: 'isAdmin' },
                { name: 'data', property: 'data' }
        ]
});


/**
 * SQL definition for public.user_entity_subscription
 */
export const UserEntitySubscription = sql.define({
        name: 'user_entity_subscription',
        columns: [
                { name: 'user_id', property: 'userId' },
                { name: 'entity_id', property: 'entityId' },
                { name: 'entity_name', property: 'entityName' }
        ]
});


/**
 * SQL definition for public.user_event_mapping
 */
export const UserEventMapping = sql.define({
        name: 'user_event_mapping',
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