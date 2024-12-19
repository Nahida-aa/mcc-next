import { relations } from "drizzle-orm/relations";
import { user, home, idCardInfo, userPlatformInfo, team, linkTeamFollow, linkUserFollow, tag, linkUserPlatformInfoTag, proj, linkTeamProj, resource, linkTeamResource, linkUserProj, linkUserResource, linkUserTeam, identity, linkTeamIdentity, linkUserIdentity } from "./schema";

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
	linkTeamFollows: many(linkTeamFollow),
	linkUserFollows_followedId: many(linkUserFollow, {
		relationName: "linkUserFollow_followedId_user_id"
	}),
	linkUserFollows_followerId: many(linkUserFollow, {
		relationName: "linkUserFollow_followerId_user_id"
	}),
	linkUserProjs: many(linkUserProj),
	linkUserResources: many(linkUserResource),
	linkUserTeams: many(linkUserTeam),
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

export const linkTeamFollowRelations = relations(linkTeamFollow, ({one}) => ({
	team: one(team, {
		fields: [linkTeamFollow.teamId],
		references: [team.id]
	}),
	user: one(user, {
		fields: [linkTeamFollow.userId],
		references: [user.id]
	}),
}));

export const teamRelations = relations(team, ({many}) => ({
	linkTeamFollows: many(linkTeamFollow),
	linkTeamProjs: many(linkTeamProj),
	linkTeamResources: many(linkTeamResource),
	linkUserTeams: many(linkUserTeam),
	linkTeamIdentities: many(linkTeamIdentity),
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

export const linkTeamProjRelations = relations(linkTeamProj, ({one}) => ({
	proj: one(proj, {
		fields: [linkTeamProj.projId],
		references: [proj.id]
	}),
	team: one(team, {
		fields: [linkTeamProj.teamId],
		references: [team.id]
	}),
}));

export const projRelations = relations(proj, ({many}) => ({
	linkTeamProjs: many(linkTeamProj),
	linkUserProjs: many(linkUserProj),
}));

export const linkTeamResourceRelations = relations(linkTeamResource, ({one}) => ({
	resource: one(resource, {
		fields: [linkTeamResource.resourceId],
		references: [resource.id]
	}),
	team: one(team, {
		fields: [linkTeamResource.teamId],
		references: [team.id]
	}),
}));

export const resourceRelations = relations(resource, ({many}) => ({
	linkTeamResources: many(linkTeamResource),
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

export const linkUserTeamRelations = relations(linkUserTeam, ({one}) => ({
	team: one(team, {
		fields: [linkUserTeam.teamId],
		references: [team.id]
	}),
	user: one(user, {
		fields: [linkUserTeam.userId],
		references: [user.id]
	}),
}));

export const linkTeamIdentityRelations = relations(linkTeamIdentity, ({one}) => ({
	identity: one(identity, {
		fields: [linkTeamIdentity.identityId],
		references: [identity.id]
	}),
	team: one(team, {
		fields: [linkTeamIdentity.teamId],
		references: [team.id]
	}),
}));

export const identityRelations = relations(identity, ({many}) => ({
	linkTeamIdentities: many(linkTeamIdentity),
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