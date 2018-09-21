-- ----------------------------
--  Sequence structure for event_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "id_seq" CASCADE;
CREATE SEQUENCE "id_seq" INCREMENT 1 START 2 MAXVALUE 9223372036854775807 MINVALUE 1 CACHE 1;

-- ----------------------------
--  Table structure for event
-- ----------------------------
DROP TABLE IF EXISTS "event" CASCADE;
CREATE TABLE "event" (
	"id" int8 NOT NULL DEFAULT nextval('id_seq'::regclass) PRIMARY KEY,
	"area" varchar(50) NOT NULL,
    "name" varchar(50) NOT NULL,
    "actor_id" varchar(36) NOT NULL,
    "actor_name" varchar(255) NOT NULL,
    "is_high_priority" bool DEFAULT true,
	"time_to_live" int2 DEFAULT 365,
    "title" varchar(4000) COLLATE "default",
    "body" text COLLATE "default",
    "data" text COLLATE "default",
    "reply_to_email" varchar(250),
	"created_date" timestamp(6) NOT NULL DEFAULT now()
)
WITH (OIDS=FALSE);

-- ----------------------------
--  Table structure for user_event_mapping
-- ----------------------------
DROP TABLE IF EXISTS "user_event_mapping" CASCADE;
CREATE TABLE "user_event_mapping" (
    "id" int8 NOT NULL DEFAULT nextval('id_seq'::regclass) PRIMARY KEY,
	"event_id" int8 NOT NULL REFERENCES "event" (id),
    "user_id" varchar(36) NOT NULL,
    "is_read" bool DEFAULT false,
	"email" varchar(250) NOT NULL,
    "read_via" int2 NOT NULL,
    "read_on" timestamp(6) NOT NULL,
    "is_email_delivered" bool DEFAULT false,
    "email_message_id" varchar(60),
    UNIQUE("event_id", "user_id")
)
WITH (OIDS=FALSE);

-- ----------------------------
--  Table structure for preferences
-- ----------------------------
DROP TABLE IF EXISTS "preferences" CASCADE;
CREATE TABLE "preferences" (
    "user_id" varchar(36) NOT NULL UNIQUE,
    "is_admin" bool DEFAULT false,
    "data" text COLLATE "default"
)
WITH (OIDS=FALSE);