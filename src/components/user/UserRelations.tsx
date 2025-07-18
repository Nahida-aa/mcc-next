import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Heart, UserPlus, UserMinus, MessageCircle } from 'lucide-react';

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
}

interface FollowUser extends User {
  createdAt: string;
}

interface FriendUser extends User {
  createdAt: string;
  reason: 'mutual_follow' | 'manual_request';
}

interface UserRelationsProps {
  userId: string;
  onFollowToggle: (userId: string, isFollowing: boolean) => Promise<void>;
  onFriendToggle: (userId: string, isFriend: boolean) => Promise<void>;
}

export default function UserRelations({ userId, onFollowToggle, onFriendToggle }: UserRelationsProps) {
  const [following, setFollowing] = useState<FollowUser[]>([]);
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRelations = async () => {
      try {
        setLoading(true);
        const [followingRes, followersRes, friendsRes] = await Promise.all([
          fetch(`/api/following`),
          fetch(`/api/followers`),
          fetch(`/api/friends`)
        ]);

        const [followingData, followersData, friendsData] = await Promise.all([
          followingRes.json(),
          followersRes.json(),
          friendsRes.json()
        ]);

        if (followingData.success) setFollowing(followingData.data);
        if (followersData.success) setFollowers(followersData.data);
        if (friendsData.success) setFriends(friendsData.data);
      } catch (error) {
        console.error('Failed to fetch user relations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRelations();
  }, [userId]);

  const UserCard = ({ user, type, extra }: { user: User; type: 'following' | 'follower' | 'friend'; extra?: any }) => (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gray-300">
            {user.avatar ? (
              <img src={user.avatar} alt={user.displayName} className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-400 flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-sm">{user.displayName}</h3>
            <p className="text-xs text-gray-500">@{user.username}</p>
            {type === 'friend' && extra?.reason === 'mutual_follow' && (
              <Badge variant="outline" className="mt-1 text-xs">
                <Heart className="w-3 h-3 mr-1" />
                互相关注自动成为好友
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          {type === 'following' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onFollowToggle(user.id, true)}
            >
              <UserMinus className="w-4 h-4 mr-1" />
              取消关注
            </Button>
          )}
          {type === 'follower' && (
            <Button
              size="sm"
              variant="default"
              onClick={() => onFollowToggle(user.id, false)}
            >
              <UserPlus className="w-4 h-4 mr-1" />
              关注
            </Button>
          )}
          {type === 'friend' && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onFriendToggle(user.id, true)}
              >
                <UserMinus className="w-4 h-4 mr-1" />
                删除好友
              </Button>
              <Button size="sm" variant="default">
                <MessageCircle className="w-4 h-4 mr-1" />
                发消息
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>加载中...</CardTitle>
        </CardHeader>
      </Card>
    );
  }


  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>社交关系</CardTitle>
        <CardDescription>管理你的关注、粉丝和好友</CardDescription>
      </CardHeader>
      <CardContent>
                <Tabs defaultValue="friends" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="friends" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              好友 ({friends.length})
            </TabsTrigger>
            <TabsTrigger value="following" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              关注 ({following.length})
            </TabsTrigger>
            <TabsTrigger value="followers" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              粉丝 ({followers.length})
            </TabsTrigger>
          </TabsList>

                  <TabsContent value="friends" className="space-y-4 mt-4">


            <div className="text-sm text-gray-600 mb-4">
              好友是可以相互发送消息的用户。互相关注的用户会自动成为好友。
            </div>
            {friends.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>还没有好友</p>
                <p className="text-sm">关注其他用户，当对方也关注你时，你们会自动成为好友</p>
              </div>
            ) : (
              <div className="space-y-3">
                {friends.map((friend) => (
                  <UserCard key={friend.id} user={friend} type="friend" extra={{ reason: friend.reason }} />
                ))}
              </div>
            )}
            </TabsContent>
          
          <TabsContent value="following" className="space-y-4 mt-4">

            <div className="text-sm text-gray-600 mb-4">
              你关注的用户列表。当对方也关注你时，你们会自动成为好友。
            </div>
            {following.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <UserPlus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>还没有关注任何人</p>
                <p className="text-sm">开始关注其他用户来建立社交网络</p>
              </div>
            ) : (
              <div className="space-y-3">
                {following.map((user) => (
                  <UserCard key={user.id} user={user} type="following" />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="followers" className="space-y-4 mt-4">
            <div className="text-sm text-gray-600 mb-4">
              关注你的用户列表。你可以选择关注他们来建立相互关注的关系。
            </div>
            {followers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>还没有粉丝</p>
                <p className="text-sm">创建有趣的内容来吸引其他用户关注你</p>
              </div>
            ) : (
              <div className="space-y-3">
                {followers.map((user) => (
                  <UserCard key={user.id} user={user} type="follower" />
                ))}
              </div>
            )}
            </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
