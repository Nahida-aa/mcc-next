import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, UserMinus, Heart, MessageCircle } from 'lucide-react';

interface UserRelationship {
  isFollowing: boolean;
  isFollower: boolean;
  isFriend: boolean;
  isMutualFollow: boolean;
}

interface UserProfileProps {
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  isCurrentUser: boolean;
  relationship: UserRelationship;
  onFollowToggle: (userId: string, isFollowing: boolean) => Promise<void>;
  onFriendToggle: (userId: string, isFriend: boolean) => Promise<void>;
}

export default function UserProfile({
  userId,
  username,
  displayName,
  avatar,
  isCurrentUser,
  relationship,
  onFollowToggle,
  onFriendToggle
}: UserProfileProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentRelationship, setCurrentRelationship] = useState(relationship);

  const handleFollow = async () => {
    setIsLoading(true);
    try {
      await onFollowToggle(userId, currentRelationship.isFollowing);
      setCurrentRelationship(prev => ({
        ...prev,
        isFollowing: !prev.isFollowing,
        isMutualFollow: !prev.isFollowing && prev.isFollower,
        isFriend: (!prev.isFollowing && prev.isFollower) || prev.isFriend
      }));
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFriend = async () => {
    setIsLoading(true);
    try {
      await onFriendToggle(userId, currentRelationship.isFriend);
      setCurrentRelationship(prev => ({
        ...prev,
        isFriend: !prev.isFriend
      }));
    } catch (error) {
      console.error('Failed to toggle friend:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCurrentUser) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4">
            {avatar ? (
              <img src={avatar} alt={displayName} className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-400 flex items-center justify-center">
                <Users className="w-10 h-10 text-gray-600" />
              </div>
            )}
          </div>
          <CardTitle>{displayName}</CardTitle>
          <CardDescription>@{username}</CardDescription>
          <Badge variant="outline" className="mt-2">
            这是你的个人档案
          </Badge>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4">
          {avatar ? (
            <img src={avatar} alt={displayName} className="w-full h-full rounded-full object-cover" />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-400 flex items-center justify-center">
              <Users className="w-10 h-10 text-gray-600" />
            </div>
          )}
        </div>
        <CardTitle>{displayName}</CardTitle>
        <CardDescription>@{username}</CardDescription>
        
        {/* 关系状态徽章 */}
        <div className="flex justify-center gap-2 mt-2">
          {currentRelationship.isFriend && (
            <Badge variant="default" className="bg-green-500">
              <Heart className="w-3 h-3 mr-1" />
              好友
            </Badge>
          )}
          {currentRelationship.isMutualFollow && !currentRelationship.isFriend && (
            <Badge variant="secondary">
              <Users className="w-3 h-3 mr-1" />
              互相关注
            </Badge>
          )}
          {currentRelationship.isFollowing && !currentRelationship.isMutualFollow && (
            <Badge variant="outline">
              已关注
            </Badge>
          )}
          {currentRelationship.isFollower && !currentRelationship.isFollowing && (
            <Badge variant="outline">
              关注了你
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* 关注按钮 */}
        <Button
          onClick={handleFollow}
          disabled={isLoading}
          variant={currentRelationship.isFollowing ? "outline" : "default"}
          className="w-full"
        >
          {currentRelationship.isFollowing ? (
            <>
              <UserMinus className="w-4 h-4 mr-2" />
              取消关注
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-2" />
              关注
            </>
          )}
        </Button>

        {/* 好友按钮 */}
        <Button
          onClick={handleFriend}
          disabled={isLoading}
          variant={currentRelationship.isFriend ? "outline" : "secondary"}
          className="w-full"
        >
          {currentRelationship.isFriend ? (
            <>
              <UserMinus className="w-4 h-4 mr-2" />
              删除好友
            </>
          ) : (
            <>
              <Heart className="w-4 h-4 mr-2" />
              添加好友
            </>
          )}
        </Button>

        {/* 发送消息按钮 */}
        {currentRelationship.isFriend && (
          <Button variant="outline" className="w-full">
            <MessageCircle className="w-4 h-4 mr-2" />
            发送消息
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
