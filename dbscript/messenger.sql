-- ----------------------------
--  Sequence structure for event_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "event_id_seq" CASCADE;
CREATE SEQUENCE "event_id_seq" INCREMENT 1 START 2 MAXVALUE 9223372036854775807 MINVALUE 1 CACHE 1;

-- ----------------------------
--  Table structure for event
-- ----------------------------
DROP TABLE IF EXISTS "event" CASCADE;
CREATE TABLE "event" (
	"id" int8 NOT NULL DEFAULT nextval('event_id_seq'::regclass) PRIMARY KEY,
	"area" varchar(100) NOT NULL,
    "name" varchar(100) NOT NULL,
    "actor_id" varchar(255) NOT NULL,
    "actor_name" varchar(255) NOT NULL,
    "priority" varchar(10) DEFAULT 'NORMAL',
	"time_to_live" int2 DEFAULT 365,
    "title" varchar(4000) COLLATE "default",
    "body" text COLLATE "default",
    "data" text COLLATE "default",
	"date_created" timestamp(6) NOT NULL DEFAULT now(),
	"date_updated" timestamp(6) NOT NULL DEFAULT now()
)
WITH (OIDS=FALSE);

-- ----------------------------
--  Table structure for user_event_mapping
-- ----------------------------
DROP TABLE IF EXISTS "user_event_mapping" CASCADE;
CREATE TABLE "user_event_mapping" (
	"event_id" int8 NOT NULL REFERENCES "event" (id),
    "user_id" varchar(255) NOT NULL,
    "is_admin" bool DEFAULT false,
    "is_read" bool DEFAULT false,
	"email" varchar(250) NOT NULL,
    "read_via" varchar(50) NOT NULL,
    "read_on" timestamp(6) NOT NULL,
    PRIMARY KEY("event_id", "user_id")
)
WITH (OIDS=FALSE);