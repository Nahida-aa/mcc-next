-- 创建关注功能表
CREATE TABLE IF NOT EXISTS "follow" (
    "id" text PRIMARY KEY NOT NULL,
    "follower_id" text NOT NULL,
    "following_id" text NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "follow_follower_id_user_id_fk" FOREIGN KEY ("follower_id") REFERENCES "user"("id") ON DELETE CASCADE,
    CONSTRAINT "follow_following_id_user_id_fk" FOREIGN KEY ("following_id") REFERENCES "user"("id") ON DELETE CASCADE
);

-- 创建好友功能表
CREATE TABLE IF NOT EXISTS "friend" (
    "id" text PRIMARY KEY NOT NULL,
    "user_id" text NOT NULL,
    "friend_id" text NOT NULL,
    "status" text DEFAULT 'pending' NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    "reason" text DEFAULT 'manual_request' NOT NULL,
    "requester_id" text NOT NULL,
    CONSTRAINT "friend_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE,
    CONSTRAINT "friend_friend_id_user_id_fk" FOREIGN KEY ("friend_id") REFERENCES "user"("id") ON DELETE CASCADE,
    CONSTRAINT "friend_requester_id_user_id_fk" FOREIGN KEY ("requester_id") REFERENCES "user"("id") ON DELETE CASCADE
);

-- 创建通知功能表
CREATE TABLE IF NOT EXISTS "notification" (
    "id" text PRIMARY KEY NOT NULL,
    "user_id" text NOT NULL,
    "type" text NOT NULL,
    "title" text NOT NULL,
    "content" text NOT NULL,
    "related_user_id" text,
    "related_id" text,
    "is_read" boolean DEFAULT false NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "notification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE,
    CONSTRAINT "notification_related_user_id_user_id_fk" FOREIGN KEY ("related_user_id") REFERENCES "user"("id") ON DELETE CASCADE
);

-- 创建唯一索引防止重复关注
CREATE UNIQUE INDEX IF NOT EXISTS "unique_follow" ON "follow" ("follower_id", "following_id");

-- 创建唯一索引防止重复好友关系（同一对用户只能有一个关系记录）
CREATE UNIQUE INDEX IF NOT EXISTS "unique_friend" ON "friend" ("user_id", "friend_id");

-- 创建索引提高查询性能
CREATE INDEX IF NOT EXISTS "idx_follow_follower" ON "follow" ("follower_id");
CREATE INDEX IF NOT EXISTS "idx_follow_following" ON "follow" ("following_id");
CREATE INDEX IF NOT EXISTS "idx_friend_user" ON "friend" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_friend_friend" ON "friend" ("friend_id");
CREATE INDEX IF NOT EXISTS "idx_friend_status" ON "friend" ("status");
CREATE INDEX IF NOT EXISTS "idx_friend_requester" ON "friend" ("requester_id");

-- 通知表索引
CREATE INDEX IF NOT EXISTS "idx_notification_user" ON "notification" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_notification_type" ON "notification" ("type");
CREATE INDEX IF NOT EXISTS "idx_notification_read" ON "notification" ("is_read");
CREATE INDEX IF NOT EXISTS "idx_notification_created" ON "notification" ("created_at");
CREATE INDEX IF NOT EXISTS "idx_notification_related_user" ON "notification" ("related_user_id");
