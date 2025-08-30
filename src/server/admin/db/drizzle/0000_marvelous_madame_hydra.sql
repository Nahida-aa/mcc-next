-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "organization" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo" text,
	"created_at" timestamp NOT NULL,
	"metadata" text,
	"summary" text,
	"description" text,
	CONSTRAINT "organization_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "member" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	"active_organization_id" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "two_factor" (
	"id" text PRIMARY KEY NOT NULL,
	"secret" text NOT NULL,
	"backup_codes" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "follow" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"follower_id" text NOT NULL,
	"target_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "friend" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user1_id" text NOT NULL,
	"user2_id" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"reason" text DEFAULT 'manual_request' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"email" text NOT NULL,
	"role" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"inviter_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"two_factor_enabled" boolean,
	"username" text NOT NULL,
	"display_username" text,
	"is_anonymous" boolean,
	"phone_number" text,
	"phone_number_verified" boolean,
	"role" text,
	"banned" boolean,
	"ban_reason" text,
	"ban_expires" timestamp,
	"summary" text,
	"description" text,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "file_usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_id" uuid NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"usage_type" text NOT NULL,
	"usage_context" jsonb,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "file_access_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_id" uuid NOT NULL,
	"user_id" text,
	"ip_address" text,
	"user_agent" text,
	"access_type" text NOT NULL,
	"access_source" text,
	"country" text,
	"city" text,
	"referrer" text,
	"success" boolean DEFAULT true NOT NULL,
	"error_message" text,
	"bytes_transferred" integer,
	"transfer_time_ms" integer,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "file_tag" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"color" text,
	"category" text,
	"is_system" boolean DEFAULT false NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "file_tag_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "project_collection" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"collection_name" varchar(100) DEFAULT 'default' NOT NULL,
	"notes" text,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "file_storage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filename" text NOT NULL,
	"original_filename" text NOT NULL,
	"mime_type" text NOT NULL,
	"file_size" integer NOT NULL,
	"storage_provider" text NOT NULL,
	"storage_key" text NOT NULL,
	"storage_url" text NOT NULL,
	"md5" text,
	"sha1" text,
	"sha256" text,
	"file_category" text NOT NULL,
	"file_purpose" text,
	"uploader_type" text NOT NULL,
	"uploader_id" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"scan_status" text DEFAULT 'pending' NOT NULL,
	"scan_result" jsonb,
	"visibility" text DEFAULT 'public' NOT NULL,
	"access_token" text,
	"download_count" integer DEFAULT 0 NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"last_accessed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "file_share" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_id" uuid NOT NULL,
	"sharer_id" text NOT NULL,
	"share_token" text NOT NULL,
	"password" text,
	"max_downloads" integer,
	"download_count" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp,
	"can_preview" boolean DEFAULT true NOT NULL,
	"can_download" boolean DEFAULT true NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "file_share_share_token_unique" UNIQUE("share_token")
);
--> statement-breakpoint
CREATE TABLE "notification_receiver" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"notification_id" uuid NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"read_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"summary" varchar(500) NOT NULL,
	"description" text,
	"type" varchar(50) DEFAULT 'project' NOT NULL,
	"categories" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"game_versions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"loaders" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"client_side" varchar(20),
	"server_side" varchar(20),
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"visibility" varchar(20) DEFAULT 'public' NOT NULL,
	"is_open_source" boolean DEFAULT true NOT NULL,
	"owner_type" varchar(20) NOT NULL,
	"owner_id" varchar(255) NOT NULL,
	"license" varchar(100),
	"source_url" text,
	"issues_url" text,
	"wiki_url" text,
	"discord_url" text,
	"download_count" integer DEFAULT 0 NOT NULL,
	"follow_count" integer DEFAULT 0 NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"icon" text,
	"gallery" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"published_at" timestamp,
	"latest_version_id" uuid,
	CONSTRAINT "project_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "notification_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"project_invite_received" boolean DEFAULT true NOT NULL,
	"project_invite_accepted" boolean DEFAULT true NOT NULL,
	"project_invite_rejected" boolean DEFAULT false NOT NULL,
	"project_request_received" boolean DEFAULT true NOT NULL,
	"project_request_approved" boolean DEFAULT true NOT NULL,
	"project_request_rejected" boolean DEFAULT false NOT NULL,
	"project_update" boolean DEFAULT true NOT NULL,
	"version_published" boolean DEFAULT true NOT NULL,
	"project_followed" boolean DEFAULT true NOT NULL,
	"project_collected" boolean DEFAULT true NOT NULL,
	"community_invite_received" boolean DEFAULT true NOT NULL,
	"community_invite_accepted" boolean DEFAULT true NOT NULL,
	"community_request_received" boolean DEFAULT true NOT NULL,
	"community_request_approved" boolean DEFAULT true NOT NULL,
	"community_member_joined" boolean DEFAULT true NOT NULL,
	"comment_received" boolean DEFAULT true NOT NULL,
	"comment_liked" boolean DEFAULT false NOT NULL,
	"mention_received" boolean DEFAULT true NOT NULL,
	"system_announcement" boolean DEFAULT true NOT NULL,
	"security_alert" boolean DEFAULT true NOT NULL,
	"email_enabled" boolean DEFAULT false NOT NULL,
	"web_enabled" boolean DEFAULT true NOT NULL,
	"push_enabled" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_follow" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"notification_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_rating" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"rating" integer NOT NULL,
	"review" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_version" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"version_number" varchar(50) NOT NULL,
	"name" varchar(255),
	"changelog" text,
	"game_versions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"loaders" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" varchar(20) DEFAULT 'uploading' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"download_count" integer DEFAULT 0 NOT NULL,
	"publisher_id" varchar(255) NOT NULL,
	"created_at" timestamp NOT NULL,
	"channel_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_comment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"parent_id" uuid,
	"status" varchar(20) DEFAULT 'published' NOT NULL,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"reply_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_dependency" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"dependency_project_id" uuid,
	"dependency_type" varchar(20) NOT NULL,
	"version_requirement" varchar(100),
	"external_url" text,
	"external_name" varchar(255),
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_member" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"entity_id" varchar(255) NOT NULL,
	"role" varchar(20) DEFAULT 'member' NOT NULL,
	"permissions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"entity_type" varchar(20) NOT NULL,
	"is_owner" boolean DEFAULT false NOT NULL,
	"join_method" varchar(20) DEFAULT 'invite' NOT NULL,
	"inviter_id" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "version_file" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"version_id" uuid NOT NULL,
	"name" varchar(1024) NOT NULL,
	"storage_key" varchar(500) NOT NULL,
	"size" integer,
	"type" varchar(100) NOT NULL,
	"sha1" varchar(40),
	"sha256" varchar(64),
	"download_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"upload_status" varchar(20) DEFAULT 'pending' NOT NULL,
	"actual_Size" integer,
	"is_primary" boolean DEFAULT true NOT NULL,
	"game_versions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"loaders" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "file_tag_relation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_id" varchar(255),
	"type" varchar(255) NOT NULL,
	"content" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_download" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"version_id" uuid,
	"file_id" uuid,
	"user_id" varchar(255),
	"ip_address" varchar(45),
	"user_agent" text,
	"country" varchar(50),
	"city" varchar(100),
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "channel" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"community_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"type" varchar(20) DEFAULT 'chat' NOT NULL,
	"parent_id" uuid,
	"position" integer DEFAULT 0 NOT NULL,
	"permission_overwrites" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_nsfw" boolean DEFAULT false NOT NULL,
	"rate_limit_per_user" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"name" varchar(255) NOT NULL,
	"summary" varchar(500),
	"image" text,
	"type" varchar(20) NOT NULL,
	"entity_id" varchar(255) NOT NULL,
	"default_channel_id" uuid,
	"is_public" boolean DEFAULT true NOT NULL,
	"verification_level" integer DEFAULT 0 NOT NULL,
	"member_count" integer DEFAULT 1 NOT NULL,
	"owner_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_member" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"community_id" uuid NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"roles" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"permissions" bigint DEFAULT 0 NOT NULL,
	"is_owner" boolean DEFAULT false NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"join_method" varchar(20) DEFAULT 'discover' NOT NULL,
	"inviter_id" varchar(255),
	"nickname" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "community_role" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"community_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"color" varchar(7),
	"position" integer DEFAULT 0 NOT NULL,
	"permissions" bigint DEFAULT 0 NOT NULL,
	"is_mentionable" boolean DEFAULT true NOT NULL,
	"is_hoisted" boolean DEFAULT false NOT NULL,
	"is_managed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "channel_message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"channel_id" uuid NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"content" text,
	"content_type" varchar(20) DEFAULT 'text' NOT NULL,
	"reply_to_id" uuid,
	"is_edited" boolean DEFAULT false NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"attachments" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"mentions" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"reactions" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dm_channel_participant" (
	"channel_id" uuid NOT NULL,
	"user_id" varchar(255) NOT NULL,
	CONSTRAINT "dm_channel_participant_channel_id_user_id_pk" PRIMARY KEY("channel_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "user_read_state" (
	"user_id" varchar(32) NOT NULL,
	"channel_id" uuid NOT NULL,
	"last_read_message_id" uuid NOT NULL,
	"last_read_at" timestamp NOT NULL,
	CONSTRAINT "user_read_state_user_id_channel_id_pk" PRIMARY KEY("user_id","channel_id")
);
--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "two_factor" ADD CONSTRAINT "two_factor_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follow" ADD CONSTRAINT "follow_follower_id_user_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follow" ADD CONSTRAINT "follow_target_id_user_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friend" ADD CONSTRAINT "friend_user1_id_user_id_fk" FOREIGN KEY ("user1_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friend" ADD CONSTRAINT "friend_user2_id_user_id_fk" FOREIGN KEY ("user2_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviter_id_user_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file_usage" ADD CONSTRAINT "file_usage_file_id_file_storage_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."file_storage"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file_access_log" ADD CONSTRAINT "file_access_log_file_id_file_storage_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."file_storage"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file_access_log" ADD CONSTRAINT "file_access_log_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_collection" ADD CONSTRAINT "project_collection_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_collection" ADD CONSTRAINT "project_collection_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file_share" ADD CONSTRAINT "file_share_file_id_file_storage_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."file_storage"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file_share" ADD CONSTRAINT "file_share_sharer_id_user_id_fk" FOREIGN KEY ("sharer_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_receiver" ADD CONSTRAINT "notification_receiver_notification_id_notification_id_fk" FOREIGN KEY ("notification_id") REFERENCES "public"."notification"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_receiver" ADD CONSTRAINT "notification_receiver_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_settings" ADD CONSTRAINT "notification_settings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_follow" ADD CONSTRAINT "project_follow_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_follow" ADD CONSTRAINT "project_follow_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_rating" ADD CONSTRAINT "project_rating_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_rating" ADD CONSTRAINT "project_rating_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_version" ADD CONSTRAINT "project_version_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_version" ADD CONSTRAINT "project_version_publisher_id_user_id_fk" FOREIGN KEY ("publisher_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_version" ADD CONSTRAINT "project_version_channel_id_channel_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channel"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_comment" ADD CONSTRAINT "project_comment_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_comment" ADD CONSTRAINT "project_comment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_comment" ADD CONSTRAINT "project_comment_parent_id_project_comment_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."project_comment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_dependency" ADD CONSTRAINT "project_dependency_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_dependency" ADD CONSTRAINT "project_dependency_dependency_project_id_project_id_fk" FOREIGN KEY ("dependency_project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_member" ADD CONSTRAINT "project_member_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_member" ADD CONSTRAINT "project_member_inviter_id_user_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "version_file" ADD CONSTRAINT "version_file_version_id_project_version_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."project_version"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file_tag_relation" ADD CONSTRAINT "file_tag_relation_file_id_file_storage_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."file_storage"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file_tag_relation" ADD CONSTRAINT "file_tag_relation_tag_id_file_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."file_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_download" ADD CONSTRAINT "project_download_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_download" ADD CONSTRAINT "project_download_version_id_project_version_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."project_version"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_download" ADD CONSTRAINT "project_download_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_download" ADD CONSTRAINT "project_download_file_id_version_file_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."version_file"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channel" ADD CONSTRAINT "channel_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."community"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channel" ADD CONSTRAINT "channel_parent_id_channel_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."channel"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community" ADD CONSTRAINT "community_default_channel_id_channel_id_fk" FOREIGN KEY ("default_channel_id") REFERENCES "public"."channel"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community" ADD CONSTRAINT "community_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_member" ADD CONSTRAINT "community_member_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."community"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_member" ADD CONSTRAINT "community_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_member" ADD CONSTRAINT "community_member_inviter_id_user_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_role" ADD CONSTRAINT "community_role_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."community"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channel_message" ADD CONSTRAINT "channel_message_channel_id_channel_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channel"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channel_message" ADD CONSTRAINT "channel_message_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channel_message" ADD CONSTRAINT "channel_message_reply_to_id_channel_message_id_fk" FOREIGN KEY ("reply_to_id") REFERENCES "public"."channel_message"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dm_channel_participant" ADD CONSTRAINT "dm_channel_participant_channel_id_channel_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channel"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dm_channel_participant" ADD CONSTRAINT "dm_channel_participant_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_read_state" ADD CONSTRAINT "user_read_state_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_read_state" ADD CONSTRAINT "user_read_state_channel_id_channel_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channel"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_read_state" ADD CONSTRAINT "user_read_state_last_read_message_id_channel_message_id_fk" FOREIGN KEY ("last_read_message_id") REFERENCES "public"."channel_message"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "follow_unique_follower_target_idx" ON "follow" USING btree ("follower_id" text_ops,"target_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "friend_unique_user1_user2_idx" ON "friend" USING btree ("user1_id" text_ops,"user2_id" text_ops);--> statement-breakpoint
CREATE INDEX "file_usage_entity_idx" ON "file_usage" USING btree ("entity_type" text_ops,"entity_id" text_ops);--> statement-breakpoint
CREATE INDEX "file_usage_file_idx" ON "file_usage" USING btree ("file_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "file_access_log_date_idx" ON "file_access_log" USING btree ("created_at" timestamp_ops);--> statement-breakpoint
CREATE INDEX "file_access_log_file_idx" ON "file_access_log" USING btree ("file_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "file_access_log_type_idx" ON "file_access_log" USING btree ("access_type" text_ops);--> statement-breakpoint
CREATE INDEX "file_access_log_user_idx" ON "file_access_log" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "project_collection_project_user_idx" ON "project_collection" USING btree ("project_id" text_ops,"user_id" text_ops);--> statement-breakpoint
CREATE INDEX "file_storage_category_idx" ON "file_storage" USING btree ("file_category" text_ops);--> statement-breakpoint
CREATE INDEX "file_storage_hash_idx" ON "file_storage" USING btree ("sha256" text_ops);--> statement-breakpoint
CREATE INDEX "file_storage_status_idx" ON "file_storage" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "file_storage_uploader_idx" ON "file_storage" USING btree ("uploader_type" text_ops,"uploader_id" text_ops);--> statement-breakpoint
CREATE INDEX "file_share_file_idx" ON "file_share" USING btree ("file_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "file_share_token_idx" ON "file_share" USING btree ("share_token" text_ops);--> statement-breakpoint
CREATE INDEX "notification_receiver_is_read_idx" ON "notification_receiver" USING btree ("is_read" bool_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "notification_receiver_unique_idx" ON "notification_receiver" USING btree ("notification_id" text_ops,"user_id" text_ops);--> statement-breakpoint
CREATE INDEX "notification_receiver_user_idx" ON "notification_receiver" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "project_owner_idx" ON "project" USING btree ("owner_type" text_ops,"owner_id" text_ops);--> statement-breakpoint
CREATE INDEX "project_published_at_idx" ON "project" USING btree ("published_at" timestamp_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "project_slug_idx" ON "project" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE INDEX "project_status_idx" ON "project" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "project_type_idx" ON "project" USING btree ("type" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "notification_settings_user_idx" ON "notification_settings" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "project_follow_project_user_idx" ON "project_follow" USING btree ("project_id" text_ops,"user_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "project_rating_project_user_idx" ON "project_rating" USING btree ("project_id" text_ops,"user_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "project_version_number_unique_idx" ON "project_version" USING btree ("project_id" text_ops,"version_number" text_ops);--> statement-breakpoint
CREATE INDEX "project_version_project_idx" ON "project_version" USING btree ("project_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "project_comment_parent_idx" ON "project_comment" USING btree ("parent_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "project_comment_project_idx" ON "project_comment" USING btree ("project_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "project_dependency_project_idx" ON "project_dependency" USING btree ("project_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "project_member_project_idx" ON "project_member" USING btree ("project_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "project_member_type_idx" ON "project_member" USING btree ("entity_type" text_ops,"entity_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "project_member_unique_idx" ON "project_member" USING btree ("project_id" uuid_ops,"entity_type" uuid_ops,"entity_id" text_ops);--> statement-breakpoint
CREATE INDEX "project_file_version_idx" ON "version_file" USING btree ("version_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "file_tag_relation_file_tag_idx" ON "file_tag_relation" USING btree ("file_id" uuid_ops,"tag_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "notification_created_at_idx" ON "notification" USING btree ("created_at" timestamp_ops);--> statement-breakpoint
CREATE INDEX "notification_sender_idx" ON "notification" USING btree ("sender_id" text_ops);--> statement-breakpoint
CREATE INDEX "notification_type_idx" ON "notification" USING btree ("type" text_ops);--> statement-breakpoint
CREATE INDEX "project_download_date_idx" ON "project_download" USING btree ("created_at" timestamp_ops);--> statement-breakpoint
CREATE INDEX "project_download_project_idx" ON "project_download" USING btree ("project_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "channel_community_idx" ON "channel" USING btree ("community_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "channel_parent_idx" ON "channel" USING btree ("parent_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "channel_position_idx" ON "channel" USING btree ("community_id" int4_ops,"position" int4_ops);--> statement-breakpoint
CREATE INDEX "community_entity_idx" ON "community" USING btree ("type" text_ops,"entity_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "community_entity_unique_idx" ON "community" USING btree ("type" text_ops,"entity_id" text_ops);--> statement-breakpoint
CREATE INDEX "community_public_idx" ON "community" USING btree ("is_public" bool_ops);--> statement-breakpoint
CREATE INDEX "community_member_inviter_idx" ON "community_member" USING btree ("inviter_id" text_ops);--> statement-breakpoint
CREATE INDEX "community_member_join_method_idx" ON "community_member" USING btree ("join_method" text_ops);--> statement-breakpoint
CREATE INDEX "community_member_status_idx" ON "community_member" USING btree ("status" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "community_member_unique_idx" ON "community_member" USING btree ("community_id" uuid_ops,"user_id" text_ops);--> statement-breakpoint
CREATE INDEX "community_member_user_idx" ON "community_member" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "community_role_community_idx" ON "community_role" USING btree ("community_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "community_role_position_idx" ON "community_role" USING btree ("community_id" int4_ops,"position" int4_ops);--> statement-breakpoint
CREATE INDEX "channel_message_channel_idx" ON "channel_message" USING btree ("channel_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "channel_message_created_at_idx" ON "channel_message" USING btree ("created_at" timestamp_ops);--> statement-breakpoint
CREATE INDEX "channel_message_user_idx" ON "channel_message" USING btree ("user_id" text_ops);
*/