import { relations } from "drizzle-orm/relations";

import { home, idCardInfo, identity, user, userPlatformInfo } from "./user";
import { linkGroupFollow, linkGroupIdentity, linkGroupProj, linkGroupResource, linkUserFollow, linkUserIdentity, linkUserPlatformInfoTag, linkUserProj, linkUserResource, linkUserGroup } from "./link";
import { group } from "./group";
import { tag } from "./tag";
import { proj } from "./proj";
import { resource } from "./resource";

export const homeRelations = relations(home, ({one}) => ({
	user: one(user, {
		fields: [home.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	homes: many(home),
	idCardInfos: many(idCardInfo),
	userPlatformInfos: many(userPlatformInfo),
	linkGroupFollows: many(linkGroupFollow),
	linkUserFollows_followedId: many(linkUserFollow, {
		relationName: "linkUserFollow_followedId_user_id"
	}),
	linkUserFollows_followerId: many(linkUserFollow, {
		relationName: "linkUserFollow_followerId_user_id"
	}),
	linkUserProjs: many(linkUserProj),
	linkUserResources: many(linkUserResource),
	linkUserGroups: many(linkUserGroup),
	linkUserIdentities: many(linkUserIdentity),
}));

export const idCardInfoRelations = relations(idCardInfo, ({one}) => ({
	user: one(user, {
		fields: [idCardInfo.userId],
		references: [user.id]
	}),
}));

export const userPlatformInfoRelations = relations(userPlatformInfo, ({one, many}) => ({
	user: one(user, {
		fields: [userPlatformInfo.userId],
		references: [user.id]
	}),
	linkUserPlatformInfoTags: many(linkUserPlatformInfoTag),
}));

export const linkGroupFollowRelations = relations(linkGroupFollow, ({one}) => ({
	group: one(group, {
		fields: [linkGroupFollow.groupId],
		references: [group.id]
	}),
	user: one(user, {
		fields: [linkGroupFollow.userId],
		references: [user.id]
	}),
}));

export const groupRelations = relations(group, ({many}) => ({
	linkGroupFollows: many(linkGroupFollow),
	linkGroupProjs: many(linkGroupProj),
	linkGroupResources: many(linkGroupResource),
	linkUserGroups: many(linkUserGroup),
	linkGroupIdentities: many(linkGroupIdentity),
}));

export const linkUserFollowRelations = relations(linkUserFollow, ({one}) => ({
	user_followedId: one(user, {
		fields: [linkUserFollow.followedId],
		references: [user.id],
		relationName: "linkUserFollow_followedId_user_id"
	}),
	user_followerId: one(user, {
		fields: [linkUserFollow.followerId],
		references: [user.id],
		relationName: "linkUserFollow_followerId_user_id"
	}),
}));

export const linkUserPlatformInfoTagRelations = relations(linkUserPlatformInfoTag, ({one}) => ({
	tag: one(tag, {
		fields: [linkUserPlatformInfoTag.tagId],
		references: [tag.id]
	}),
	userPlatformInfo: one(userPlatformInfo, {
		fields: [linkUserPlatformInfoTag.userPlatformInfoId],
		references: [userPlatformInfo.id]
	}),
}));

export const tagRelations = relations(tag, ({many}) => ({
	linkUserPlatformInfoTags: many(linkUserPlatformInfoTag),
}));

export const linkGroupProjRelations = relations(linkGroupProj, ({one}) => ({
	proj: one(proj, {
		fields: [linkGroupProj.projId],
		references: [proj.id]
	}),
	group: one(group, {
		fields: [linkGroupProj.groupId],
		references: [group.id]
	}),
}));

export const projRelations = relations(proj, ({many}) => ({
	linkGroupProjs: many(linkGroupProj),
	linkUserProjs: many(linkUserProj),
}));

export const linkGroupResourceRelations = relations(linkGroupResource, ({one}) => ({
	resource: one(resource, {
		fields: [linkGroupResource.resourceId],
		references: [resource.id]
	}),
	group: one(group, {
		fields: [linkGroupResource.groupId],
		references: [group.id]
	}),
}));

export const resourceRelations = relations(resource, ({many}) => ({
	linkGroupResources: many(linkGroupResource),
	linkUserResources: many(linkUserResource),
}));

export const linkUserProjRelations = relations(linkUserProj, ({one}) => ({
	proj: one(proj, {
		fields: [linkUserProj.projId],
		references: [proj.id]
	}),
	user: one(user, {
		fields: [linkUserProj.userId],
		references: [user.id]
	}),
}));

export const linkUserResourceRelations = relations(linkUserResource, ({one}) => ({
	resource: one(resource, {
		fields: [linkUserResource.resourceId],
		references: [resource.id]
	}),
	user: one(user, {
		fields: [linkUserResource.userId],
		references: [user.id]
	}),
}));

export const linkUserGroupRelations = relations(linkUserGroup, ({one}) => ({
	group: one(group, {
		fields: [linkUserGroup.groupId],
		references: [group.id]
	}),
	user: one(user, {
		fields: [linkUserGroup.userId],
		references: [user.id]
	}),
}));

export const linkGroupIdentityRelations = relations(linkGroupIdentity, ({one}) => ({
	identity: one(identity, {
		fields: [linkGroupIdentity.identityId],
		references: [identity.id]
	}),
	group: one(group, {
		fields: [linkGroupIdentity.groupId],
		references: [group.id]
	}),
}));

export const identityRelations = relations(identity, ({many}) => ({
	linkGroupIdentities: many(linkGroupIdentity),
	linkUserIdentities: many(linkUserIdentity),
}));

export const linkUserIdentityRelations = relations(linkUserIdentity, ({one}) => ({
	identity: one(identity, {
		fields: [linkUserIdentity.identityId],
		references: [identity.id]
	}),
	user: one(user, {
		fields: [linkUserIdentity.userId],
		references: [user.id]
	}),
}));