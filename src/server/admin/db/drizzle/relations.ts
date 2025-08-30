import { relations } from "drizzle-orm/relations";
import { organization, member, user, session, twoFactor, follow, friend, invitation, account, fileStorage, fileUsage, fileAccessLog, project, projectCollection, fileShare, notification, notificationReceiver, notificationSettings, projectFollow, projectRating, projectVersion, channel, projectComment, projectDependency, projectMember, versionFile, fileTagRelation, fileTag, projectDownload, community, communityMember, communityRole, channelMessage, dmChannelParticipant, userReadState } from "./schema";

export const memberRelations = relations(member, ({one}) => ({
	organization: one(organization, {
		fields: [member.organizationId],
		references: [organization.id]
	}),
	user: one(user, {
		fields: [member.userId],
		references: [user.id]
	}),
}));

export const organizationRelations = relations(organization, ({many}) => ({
	members: many(member),
	invitations: many(invitation),
}));

export const userRelations = relations(user, ({many}) => ({
	members: many(member),
	sessions: many(session),
	twoFactors: many(twoFactor),
	follows_followerId: many(follow, {
		relationName: "follow_followerId_user_id"
	}),
	follows_targetId: many(follow, {
		relationName: "follow_targetId_user_id"
	}),
	friends_user1Id: many(friend, {
		relationName: "friend_user1Id_user_id"
	}),
	friends_user2Id: many(friend, {
		relationName: "friend_user2Id_user_id"
	}),
	invitations: many(invitation),
	accounts: many(account),
	fileAccessLogs: many(fileAccessLog),
	projectCollections: many(projectCollection),
	fileShares: many(fileShare),
	notificationReceivers: many(notificationReceiver),
	notificationSettings: many(notificationSettings),
	projectFollows: many(projectFollow),
	projectRatings: many(projectRating),
	projectVersions: many(projectVersion),
	projectComments: many(projectComment),
	projectMembers: many(projectMember),
	notifications: many(notification),
	projectDownloads: many(projectDownload),
	communities: many(community),
	communityMembers_userId: many(communityMember, {
		relationName: "communityMember_userId_user_id"
	}),
	communityMembers_inviterId: many(communityMember, {
		relationName: "communityMember_inviterId_user_id"
	}),
	channelMessages: many(channelMessage),
	dmChannelParticipants: many(dmChannelParticipant),
	userReadStates: many(userReadState),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const twoFactorRelations = relations(twoFactor, ({one}) => ({
	user: one(user, {
		fields: [twoFactor.userId],
		references: [user.id]
	}),
}));

export const followRelations = relations(follow, ({one}) => ({
	user_followerId: one(user, {
		fields: [follow.followerId],
		references: [user.id],
		relationName: "follow_followerId_user_id"
	}),
	user_targetId: one(user, {
		fields: [follow.targetId],
		references: [user.id],
		relationName: "follow_targetId_user_id"
	}),
}));

export const friendRelations = relations(friend, ({one}) => ({
	user_user1Id: one(user, {
		fields: [friend.user1Id],
		references: [user.id],
		relationName: "friend_user1Id_user_id"
	}),
	user_user2Id: one(user, {
		fields: [friend.user2Id],
		references: [user.id],
		relationName: "friend_user2Id_user_id"
	}),
}));

export const invitationRelations = relations(invitation, ({one}) => ({
	organization: one(organization, {
		fields: [invitation.organizationId],
		references: [organization.id]
	}),
	user: one(user, {
		fields: [invitation.inviterId],
		references: [user.id]
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const fileUsageRelations = relations(fileUsage, ({one}) => ({
	fileStorage: one(fileStorage, {
		fields: [fileUsage.fileId],
		references: [fileStorage.id]
	}),
}));

export const fileStorageRelations = relations(fileStorage, ({many}) => ({
	fileUsages: many(fileUsage),
	fileAccessLogs: many(fileAccessLog),
	fileShares: many(fileShare),
	fileTagRelations: many(fileTagRelation),
}));

export const fileAccessLogRelations = relations(fileAccessLog, ({one}) => ({
	fileStorage: one(fileStorage, {
		fields: [fileAccessLog.fileId],
		references: [fileStorage.id]
	}),
	user: one(user, {
		fields: [fileAccessLog.userId],
		references: [user.id]
	}),
}));

export const projectCollectionRelations = relations(projectCollection, ({one}) => ({
	project: one(project, {
		fields: [projectCollection.projectId],
		references: [project.id]
	}),
	user: one(user, {
		fields: [projectCollection.userId],
		references: [user.id]
	}),
}));

export const projectRelations = relations(project, ({many}) => ({
	projectCollections: many(projectCollection),
	projectFollows: many(projectFollow),
	projectRatings: many(projectRating),
	projectVersions: many(projectVersion),
	projectComments: many(projectComment),
	projectDependencies_projectId: many(projectDependency, {
		relationName: "projectDependency_projectId_project_id"
	}),
	projectDependencies_dependencyProjectId: many(projectDependency, {
		relationName: "projectDependency_dependencyProjectId_project_id"
	}),
	projectMembers: many(projectMember),
	projectDownloads: many(projectDownload),
}));

export const fileShareRelations = relations(fileShare, ({one}) => ({
	fileStorage: one(fileStorage, {
		fields: [fileShare.fileId],
		references: [fileStorage.id]
	}),
	user: one(user, {
		fields: [fileShare.sharerId],
		references: [user.id]
	}),
}));

export const notificationReceiverRelations = relations(notificationReceiver, ({one}) => ({
	notification: one(notification, {
		fields: [notificationReceiver.notificationId],
		references: [notification.id]
	}),
	user: one(user, {
		fields: [notificationReceiver.userId],
		references: [user.id]
	}),
}));

export const notificationRelations = relations(notification, ({one, many}) => ({
	notificationReceivers: many(notificationReceiver),
	user: one(user, {
		fields: [notification.senderId],
		references: [user.id]
	}),
}));

export const notificationSettingsRelations = relations(notificationSettings, ({one}) => ({
	user: one(user, {
		fields: [notificationSettings.userId],
		references: [user.id]
	}),
}));

export const projectFollowRelations = relations(projectFollow, ({one}) => ({
	project: one(project, {
		fields: [projectFollow.projectId],
		references: [project.id]
	}),
	user: one(user, {
		fields: [projectFollow.userId],
		references: [user.id]
	}),
}));

export const projectRatingRelations = relations(projectRating, ({one}) => ({
	project: one(project, {
		fields: [projectRating.projectId],
		references: [project.id]
	}),
	user: one(user, {
		fields: [projectRating.userId],
		references: [user.id]
	}),
}));

export const projectVersionRelations = relations(projectVersion, ({one, many}) => ({
	project: one(project, {
		fields: [projectVersion.projectId],
		references: [project.id]
	}),
	user: one(user, {
		fields: [projectVersion.publisherId],
		references: [user.id]
	}),
	channel: one(channel, {
		fields: [projectVersion.channelId],
		references: [channel.id]
	}),
	versionFiles: many(versionFile),
	projectDownloads: many(projectDownload),
}));

export const channelRelations = relations(channel, ({one, many}) => ({
	projectVersions: many(projectVersion),
	community: one(community, {
		fields: [channel.communityId],
		references: [community.id],
		relationName: "channel_communityId_community_id"
	}),
	channel: one(channel, {
		fields: [channel.parentId],
		references: [channel.id],
		relationName: "channel_parentId_channel_id"
	}),
	channels: many(channel, {
		relationName: "channel_parentId_channel_id"
	}),
	communities: many(community, {
		relationName: "community_defaultChannelId_channel_id"
	}),
	channelMessages: many(channelMessage),
	dmChannelParticipants: many(dmChannelParticipant),
	userReadStates: many(userReadState),
}));

export const projectCommentRelations = relations(projectComment, ({one, many}) => ({
	project: one(project, {
		fields: [projectComment.projectId],
		references: [project.id]
	}),
	user: one(user, {
		fields: [projectComment.userId],
		references: [user.id]
	}),
	projectComment: one(projectComment, {
		fields: [projectComment.parentId],
		references: [projectComment.id],
		relationName: "projectComment_parentId_projectComment_id"
	}),
	projectComments: many(projectComment, {
		relationName: "projectComment_parentId_projectComment_id"
	}),
}));

export const projectDependencyRelations = relations(projectDependency, ({one}) => ({
	project_projectId: one(project, {
		fields: [projectDependency.projectId],
		references: [project.id],
		relationName: "projectDependency_projectId_project_id"
	}),
	project_dependencyProjectId: one(project, {
		fields: [projectDependency.dependencyProjectId],
		references: [project.id],
		relationName: "projectDependency_dependencyProjectId_project_id"
	}),
}));

export const projectMemberRelations = relations(projectMember, ({one}) => ({
	project: one(project, {
		fields: [projectMember.projectId],
		references: [project.id]
	}),
	user: one(user, {
		fields: [projectMember.inviterId],
		references: [user.id]
	}),
}));

export const versionFileRelations = relations(versionFile, ({one, many}) => ({
	projectVersion: one(projectVersion, {
		fields: [versionFile.versionId],
		references: [projectVersion.id]
	}),
	projectDownloads: many(projectDownload),
}));

export const fileTagRelationRelations = relations(fileTagRelation, ({one}) => ({
	fileStorage: one(fileStorage, {
		fields: [fileTagRelation.fileId],
		references: [fileStorage.id]
	}),
	fileTag: one(fileTag, {
		fields: [fileTagRelation.tagId],
		references: [fileTag.id]
	}),
}));

export const fileTagRelations = relations(fileTag, ({many}) => ({
	fileTagRelations: many(fileTagRelation),
}));

export const projectDownloadRelations = relations(projectDownload, ({one}) => ({
	project: one(project, {
		fields: [projectDownload.projectId],
		references: [project.id]
	}),
	projectVersion: one(projectVersion, {
		fields: [projectDownload.versionId],
		references: [projectVersion.id]
	}),
	user: one(user, {
		fields: [projectDownload.userId],
		references: [user.id]
	}),
	versionFile: one(versionFile, {
		fields: [projectDownload.fileId],
		references: [versionFile.id]
	}),
}));

export const communityRelations = relations(community, ({one, many}) => ({
	channels: many(channel, {
		relationName: "channel_communityId_community_id"
	}),
	channel: one(channel, {
		fields: [community.defaultChannelId],
		references: [channel.id],
		relationName: "community_defaultChannelId_channel_id"
	}),
	user: one(user, {
		fields: [community.ownerId],
		references: [user.id]
	}),
	communityMembers: many(communityMember),
	communityRoles: many(communityRole),
}));

export const communityMemberRelations = relations(communityMember, ({one}) => ({
	community: one(community, {
		fields: [communityMember.communityId],
		references: [community.id]
	}),
	user_userId: one(user, {
		fields: [communityMember.userId],
		references: [user.id],
		relationName: "communityMember_userId_user_id"
	}),
	user_inviterId: one(user, {
		fields: [communityMember.inviterId],
		references: [user.id],
		relationName: "communityMember_inviterId_user_id"
	}),
}));

export const communityRoleRelations = relations(communityRole, ({one}) => ({
	community: one(community, {
		fields: [communityRole.communityId],
		references: [community.id]
	}),
}));

export const channelMessageRelations = relations(channelMessage, ({one, many}) => ({
	channel: one(channel, {
		fields: [channelMessage.channelId],
		references: [channel.id]
	}),
	user: one(user, {
		fields: [channelMessage.userId],
		references: [user.id]
	}),
	channelMessage: one(channelMessage, {
		fields: [channelMessage.replyToId],
		references: [channelMessage.id],
		relationName: "channelMessage_replyToId_channelMessage_id"
	}),
	channelMessages: many(channelMessage, {
		relationName: "channelMessage_replyToId_channelMessage_id"
	}),
	userReadStates: many(userReadState),
}));

export const dmChannelParticipantRelations = relations(dmChannelParticipant, ({one}) => ({
	channel: one(channel, {
		fields: [dmChannelParticipant.channelId],
		references: [channel.id]
	}),
	user: one(user, {
		fields: [dmChannelParticipant.userId],
		references: [user.id]
	}),
}));

export const userReadStateRelations = relations(userReadState, ({one}) => ({
	user: one(user, {
		fields: [userReadState.userId],
		references: [user.id]
	}),
	channel: one(channel, {
		fields: [userReadState.channelId],
		references: [channel.id]
	}),
	channelMessage: one(channelMessage, {
		fields: [userReadState.lastReadMessageId],
		references: [channelMessage.id]
	}),
}));