var sql = require('sql');


/**
 * SQL definition for public.event
 */
exports.event = sql.define({
        name: 'event',
        columns: [
                { name: 'id', property: 'id' },
                { name: 'area', property: 'area' },
                { name: 'name', property: 'name' },
                { name: 'actor_id', property: 'actorId' },
                { name: 'actor_name', property: 'actorName' },
                { name: 'priority', property: 'priority' },
                { name: 'time_to_live', property: 'timeToLive' },
                { name: 'title', property: 'title' },
                { name: 'body', property: 'body' },
                { name: 'data', property: 'data' },
                { name: 'date_created', property: 'dateCreated' }
        ]
});


/**
 * SQL definition for public.preferences
 */
exports.preferences = sql.define({
        name: 'preferences',
        columns: [
                { name: 'id', property: 'id' },
                { name: 'user_id', property: 'userId' },
                { name: 'is_admin', property: 'isAdmin' },
                { name: 'data', property: 'data' }
        ]
});


/**
 * SQL definition for public.user_event_mapping
 */
exports.userEventMapping = sql.define({
        name: 'user_event_mapping',
        columns: [
                { name: 'event_id', property: 'eventId' },
                { name: 'user_id', property: 'userId' },
                { name: 'is_admin', property: 'isAdmin' },
                { name: 'is_read', property: 'isRead' },
                { name: 'email', property: 'email' },
                { name: 'read_via', property: 'readVia' },
                { name: 'read_on', property: 'readOn' }
        ]
});