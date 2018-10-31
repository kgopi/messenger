CREATE OR REPLACE FUNCTION create_messenger_entities(tenantId varchar(50))
  RETURNS VOID AS
$func$
BEGIN

EXECUTE format(
    '   CREATE TABLE IF NOT EXISTS event_%1$s (
        id BIGSERIAL PRIMARY KEY,
        area varchar(50) NOT NULL,
        name varchar(50) NOT NULL,
        actor_id varchar(36) NOT NULL,
        actor_name varchar(255) NOT NULL,
        is_high_priority bool default true,
        time_to_live int2 default 70,
        title varchar(4000) COLLATE "default",
        body_html text COLLATE "default",
        body_text text COLLATE "default",
        data json,
        reply_to_email varchar(250),
        entity_id varchar(50),
        created_date timestamp(6) NOT NULL default now()
        )
        WITH (OIDS=FALSE);

        CREATE TABLE IF NOT EXISTS user_event_mapping_%1$s (
        id BIGSERIAL PRIMARY KEY,
        event_id int8 NOT NULL REFERENCES event (id),
        user_id varchar(36) NOT NULL,
        is_read bool default false,
        email varchar(250) NOT NULL,
        read_via int2,
        read_on timestamp(6),
        is_email_delivered bool default false,
        email_message_id varchar(60),
        UNIQUE(event_id, user_id)
        )
        WITH (OIDS=FALSE);

        CREATE TABLE IF NOT EXISTS user_entity_subscription_%1$s (
        user_id varchar(36) NOT NULL,
        entity_id varchar(50) NOT NULL,
        entity_name varchar(50) NOT NULL,
        UNIQUE(user_id, entity_id)
        )
        WITH (OIDS=FALSE);

        CREATE TABLE IF NOT EXISTS preferences_%1$s (
        user_id varchar(36) NOT NULL UNIQUE,
        is_admin bool default false,
        data json
        )
        WITH (OIDS=FALSE);
    ',
   (tenantId)
);

END
$func$ LANGUAGE plpgsql;