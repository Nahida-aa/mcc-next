ALTER TABLE "Team" RENAME TO "Group";--> statement-breakpoint
ALTER TABLE "LinkTeamFollow" RENAME TO "LinkGroupFollow";--> statement-breakpoint
ALTER TABLE "LinkTeamIdentity" RENAME TO "LinkGroupIdentity";--> statement-breakpoint
ALTER TABLE "LinkTeamProj" RENAME TO "LinkGroupProj";--> statement-breakpoint
ALTER TABLE "LinkTeamResource" RENAME TO "LinkGroupResource";--> statement-breakpoint
ALTER TABLE "LinkUserTeam" RENAME TO "LinkUserGroup";--> statement-breakpoint
ALTER TABLE "LinkGroupFollow" RENAME COLUMN "team_id" TO "group_id";--> statement-breakpoint
ALTER TABLE "LinkGroupProj" RENAME COLUMN "team_id" TO "group_id";--> statement-breakpoint
ALTER TABLE "LinkGroupResource" RENAME COLUMN "team_id" TO "group_id";--> statement-breakpoint
ALTER TABLE "LinkUserGroup" RENAME COLUMN "team_id" TO "group_id";--> statement-breakpoint
ALTER TABLE "LinkGroupIdentity" RENAME COLUMN "team_id" TO "group_id";--> statement-breakpoint
ALTER TABLE "LinkGroupFollow" DROP CONSTRAINT "LinkTeamFollow_team_id_fkey";
--> statement-breakpoint
ALTER TABLE "LinkGroupFollow" DROP CONSTRAINT "LinkTeamFollow_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "LinkGroupProj" DROP CONSTRAINT "LinkTeamProj_proj_id_fkey";
--> statement-breakpoint
ALTER TABLE "LinkGroupProj" DROP CONSTRAINT "LinkTeamProj_team_id_fkey";
--> statement-breakpoint
ALTER TABLE "LinkGroupResource" DROP CONSTRAINT "LinkTeamResource_resource_id_fkey";
--> statement-breakpoint
ALTER TABLE "LinkGroupResource" DROP CONSTRAINT "LinkTeamResource_team_id_fkey";
--> statement-breakpoint
ALTER TABLE "LinkUserGroup" DROP CONSTRAINT "LinkUserTeam_team_id_fkey";
--> statement-breakpoint
ALTER TABLE "LinkUserGroup" DROP CONSTRAINT "LinkUserTeam_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "LinkGroupIdentity" DROP CONSTRAINT "LinkTeamIdentity_identity_id_fkey";
--> statement-breakpoint
ALTER TABLE "LinkGroupIdentity" DROP CONSTRAINT "LinkTeamIdentity_team_id_fkey";
--> statement-breakpoint
DROP INDEX "ix_Team_name";--> statement-breakpoint
ALTER TABLE "LinkGroupFollow" DROP CONSTRAINT "LinkTeamFollow_pkey";--> statement-breakpoint
ALTER TABLE "LinkGroupProj" DROP CONSTRAINT "LinkTeamProj_pkey";--> statement-breakpoint
ALTER TABLE "LinkGroupResource" DROP CONSTRAINT "LinkTeamResource_pkey";--> statement-breakpoint
ALTER TABLE "LinkUserGroup" DROP CONSTRAINT "LinkUserTeam_pkey";--> statement-breakpoint
ALTER TABLE "LinkGroupIdentity" DROP CONSTRAINT "LinkTeamIdentity_pkey";--> statement-breakpoint
ALTER TABLE "Group" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "Group" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Group" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "Group" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "Group" ALTER COLUMN "name" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "Group" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "name" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "image" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "nickname" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "nickname" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "email" SET DATA TYPE varchar(64);--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "phone" SET DATA TYPE varchar(64);--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "phone" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "is_superuser" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "is_staff" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "is_active" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "hashed_password" SET DATA TYPE varchar(64);--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "Home" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "Home" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "IDCardInfo" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "IDCardInfo" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "Identity" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "Identity" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Identity" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "Identity" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "Identity" ALTER COLUMN "name" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "Identity" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "Proj" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "Proj" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Proj" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "Proj" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "Proj" ALTER COLUMN "name" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "Proj" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "Resource" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "Resource" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Resource" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "Resource" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "Resource" ALTER COLUMN "name" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "Resource" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "UserPlatformInfo" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "UserPlatformInfo" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "Tag" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "Tag" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "Tag" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "LinkUserPlatformInfoTag" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "LinkUserPlatformInfoTag" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "LinkGroupProj" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "LinkGroupProj" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "LinkGroupResource" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "LinkGroupResource" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "LinkUserProj" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "LinkUserProj" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "LinkUserResource" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "LinkUserResource" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "LinkUserGroup" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "LinkUserGroup" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "LinkGroupIdentity" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "LinkGroupIdentity" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "LinkUserIdentity" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "LinkUserIdentity" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "LinkGroupFollow" ADD CONSTRAINT "LinkGroupFollow_pkey" PRIMARY KEY("user_id","group_id");--> statement-breakpoint
ALTER TABLE "LinkGroupProj" ADD CONSTRAINT "LinkGroupProj_pkey" PRIMARY KEY("group_id","proj_id");--> statement-breakpoint
ALTER TABLE "LinkGroupResource" ADD CONSTRAINT "LinkGroupResource_pkey" PRIMARY KEY("group_id","resource_id");--> statement-breakpoint
ALTER TABLE "LinkUserGroup" ADD CONSTRAINT "LinkUserGroup_pkey" PRIMARY KEY("user_id","group_id");--> statement-breakpoint
ALTER TABLE "LinkGroupIdentity" ADD CONSTRAINT "LinkGroupIdentity_pkey" PRIMARY KEY("group_id","identity_id");--> statement-breakpoint
ALTER TABLE "LinkGroupFollow" ADD CONSTRAINT "LinkGroupFollow_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."Group"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LinkGroupFollow" ADD CONSTRAINT "LinkGroupFollow_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LinkGroupProj" ADD CONSTRAINT "LinkGroupProj_proj_id_fkey" FOREIGN KEY ("proj_id") REFERENCES "public"."Proj"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LinkGroupProj" ADD CONSTRAINT "LinkGroupProj_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."Group"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LinkGroupResource" ADD CONSTRAINT "LinkGroupResource_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "public"."Resource"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LinkGroupResource" ADD CONSTRAINT "LinkGroupResource_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."Group"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LinkUserGroup" ADD CONSTRAINT "LinkUserGroup_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."Group"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LinkUserGroup" ADD CONSTRAINT "LinkUserGroup_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LinkGroupIdentity" ADD CONSTRAINT "LinkGroupIdentity_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "public"."Identity"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LinkGroupIdentity" ADD CONSTRAINT "LinkGroupIdentity_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."Group"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ix_Group_name" ON "Group" USING btree ("name" text_ops);