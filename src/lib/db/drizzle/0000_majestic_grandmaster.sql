-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "alembic_version" (
	"version_num" varchar(32) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Team" (
	"updated_at" timestamp,
	"created_at" timestamp,
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar NOT NULL,
	"followers_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"updated_at" timestamp,
	"created_at" timestamp,
	"name" varchar NOT NULL,
	"image" varchar NOT NULL,
	"nickname" varchar NOT NULL,
	"email" varchar,
	"phone" varchar NOT NULL,
	"age" integer,
	"id" serial PRIMARY KEY NOT NULL,
	"last_login" timestamp,
	"is_superuser" boolean NOT NULL,
	"is_staff" boolean NOT NULL,
	"is_active" boolean NOT NULL,
	"hashed_password" varchar NOT NULL,
	"gender" varchar,
	"followers_count" integer DEFAULT 0 NOT NULL,
	"following_count" integer DEFAULT 0 NOT NULL,
	"description" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Home" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"door_number" integer
);
--> statement-breakpoint
CREATE TABLE "IDCardInfo" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"id_card_number" varchar NOT NULL,
	"id_card_holder" varchar NOT NULL,
	"is_real_name" boolean NOT NULL,
	"front_image_url" varchar,
	"back_image_url" varchar
);
--> statement-breakpoint
CREATE TABLE "Identity" (
	"updated_at" timestamp,
	"created_at" timestamp,
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Proj" (
	"updated_at" timestamp,
	"created_at" timestamp,
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Resource" (
	"updated_at" timestamp,
	"created_at" timestamp,
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "UserPlatformInfo" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"mc_experience" varchar NOT NULL,
	"play_reason" varchar NOT NULL,
	"server_type" varchar NOT NULL,
	"desired_partners" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Tag" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "LinkTeamFollow" (
	"user_id" integer NOT NULL,
	"team_id" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "LinkTeamFollow_pkey" PRIMARY KEY("user_id","team_id")
);
--> statement-breakpoint
CREATE TABLE "LinkUserFollow" (
	"follower_id" integer NOT NULL,
	"followed_id" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "LinkUserFollow_pkey" PRIMARY KEY("follower_id","followed_id")
);
--> statement-breakpoint
CREATE TABLE "LinkUserPlatformInfoTag" (
	"updated_at" timestamp,
	"created_at" timestamp,
	"user_platform_info_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	CONSTRAINT "LinkUserPlatformInfoTag_pkey" PRIMARY KEY("user_platform_info_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "LinkTeamProj" (
	"updated_at" timestamp,
	"created_at" timestamp,
	"team_id" integer NOT NULL,
	"proj_id" integer NOT NULL,
	"role" varchar NOT NULL,
	CONSTRAINT "LinkTeamProj_pkey" PRIMARY KEY("team_id","proj_id")
);
--> statement-breakpoint
CREATE TABLE "LinkTeamResource" (
	"updated_at" timestamp,
	"created_at" timestamp,
	"team_id" integer NOT NULL,
	"resource_id" integer NOT NULL,
	"role" varchar NOT NULL,
	CONSTRAINT "LinkTeamResource_pkey" PRIMARY KEY("team_id","resource_id")
);
--> statement-breakpoint
CREATE TABLE "LinkUserProj" (
	"updated_at" timestamp,
	"created_at" timestamp,
	"user_id" integer NOT NULL,
	"proj_id" integer NOT NULL,
	"role" varchar NOT NULL,
	CONSTRAINT "LinkUserProj_pkey" PRIMARY KEY("user_id","proj_id")
);
--> statement-breakpoint
CREATE TABLE "LinkUserResource" (
	"updated_at" timestamp,
	"created_at" timestamp,
	"user_id" integer NOT NULL,
	"resource_id" integer NOT NULL,
	"role" varchar NOT NULL,
	CONSTRAINT "LinkUserResource_pkey" PRIMARY KEY("user_id","resource_id")
);
--> statement-breakpoint
CREATE TABLE "LinkUserTeam" (
	"updated_at" timestamp,
	"created_at" timestamp,
	"user_id" integer NOT NULL,
	"team_id" integer NOT NULL,
	"role" varchar NOT NULL,
	CONSTRAINT "LinkUserTeam_pkey" PRIMARY KEY("user_id","team_id")
);
--> statement-breakpoint
CREATE TABLE "LinkTeamIdentity" (
	"updated_at" timestamp,
	"created_at" timestamp,
	"team_id" integer NOT NULL,
	"identity_id" integer NOT NULL,
	"level" integer NOT NULL,
	"status" varchar NOT NULL,
	"motivation" varchar NOT NULL,
	CONSTRAINT "LinkTeamIdentity_pkey" PRIMARY KEY("team_id","identity_id")
);
--> statement-breakpoint
CREATE TABLE "LinkUserIdentity" (
	"updated_at" timestamp,
	"created_at" timestamp,
	"user_id" integer NOT NULL,
	"identity_id" integer NOT NULL,
	"level" integer NOT NULL,
	"status" varchar NOT NULL,
	"motivation" varchar NOT NULL,
	CONSTRAINT "LinkUserIdentity_pkey" PRIMARY KEY("user_id","identity_id")
);
--> statement-breakpoint
ALTER TABLE "Home" ADD CONSTRAINT "Home_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "IDCardInfo" ADD CONSTRAINT "IDCardInfo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserPlatformInfo" ADD CONSTRAINT "UserPlatformInfo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LinkTeamFollow" ADD CONSTRAINT "LinkTeamFollow_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."Team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LinkTeamFollow" ADD CONSTRAINT "LinkTeamFollow_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LinkUserFollow" ADD CONSTRAINT "LinkUserFollow_followed_id_fkey" FOREIGN KEY ("followed_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LinkUserFollow" ADD CONSTRAINT "LinkUserFollow_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LinkUserPlatformInfoTag" ADD CONSTRAINT "LinkUserPlatformInfoTag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."Tag"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LinkUserPlatformInfoTag" ADD CONSTRAINT "LinkUserPlatformInfoTag_user_platform_info_id_fkey" FOREIGN KEY ("user_platform_info_id") REFERENCES "public"."UserPlatformInfo"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LinkTeamProj" ADD CONSTRAINT "LinkTeamProj_proj_id_fkey" FOREIGN KEY ("proj_id") REFERENCES "public"."Proj"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LinkTeamProj" ADD CONSTRAINT "LinkTeamProj_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."Team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LinkTeamResource" ADD CONSTRAINT "LinkTeamResource_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "public"."Resource"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LinkTeamResource" ADD CONSTRAINT "LinkTeamResource_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."Team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LinkUserProj" ADD CONSTRAINT "LinkUserProj_proj_id_fkey" FOREIGN KEY ("proj_id") REFERENCES "public"."Proj"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LinkUserProj" ADD CONSTRAINT "LinkUserProj_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LinkUserResource" ADD CONSTRAINT "LinkUserResource_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "public"."Resource"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LinkUserResource" ADD CONSTRAINT "LinkUserResource_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LinkUserTeam" ADD CONSTRAINT "LinkUserTeam_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."Team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LinkUserTeam" ADD CONSTRAINT "LinkUserTeam_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LinkTeamIdentity" ADD CONSTRAINT "LinkTeamIdentity_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "public"."Identity"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LinkTeamIdentity" ADD CONSTRAINT "LinkTeamIdentity_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."Team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LinkUserIdentity" ADD CONSTRAINT "LinkUserIdentity_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "public"."Identity"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LinkUserIdentity" ADD CONSTRAINT "LinkUserIdentity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ix_Team_name" ON "Team" USING btree ("name" text_ops);--> statement-breakpoint
CREATE INDEX "ix_User_age" ON "User" USING btree ("age" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "ix_User_email" ON "User" USING btree ("email" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "ix_User_name" ON "User" USING btree ("name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "ix_IDCardInfo_id_card_number" ON "IDCardInfo" USING btree ("id_card_number" text_ops);--> statement-breakpoint
CREATE INDEX "ix_Identity_name" ON "Identity" USING btree ("name" text_ops);--> statement-breakpoint
CREATE INDEX "ix_Proj_name" ON "Proj" USING btree ("name" text_ops);--> statement-breakpoint
CREATE INDEX "ix_Resource_name" ON "Resource" USING btree ("name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "ix_Tag_name" ON "Tag" USING btree ("name" text_ops);
*/