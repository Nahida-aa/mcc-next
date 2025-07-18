import { useState, useEffect } from 'react';
import UserProfile from '@/components/user/UserProfile';
import UserRelations from '@/components/user/UserRelations';

interface UserRelationship {
  isFollowing: boolean;
  isFollower: boolean;
  isFriend: boolean;
  isMutualFollow: boolean;
}

export default function SocialPage() {
  const [currentUserId] = useState('current-user-id'); // 在实际应用中应该从认证系统获取
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userRelationship, setUserRelationship] = useState<UserRelationship | null>(null);

  // 模拟用户数据
  const mockUser = {
    id: 'user-123',
    username: 'johndoe',
    displayName: 'John Doe',
    avatar: undefined,
    isCurrentUser: false,
  };

  useEffect(() => {
    // 获取用户关系状态
    const fetchUserRelationship = async () => {
      if (!selectedUserId) return;
      
      try {
        const response = await fetch(`/api/relationship/${selectedUserId}`);
        const data = await response.json();
        if (data.success) {
          setUserRelationship(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch user relationship:', error);
      }
    };

    fetchUserRelationship();
  }, [selectedUserId]);

  const handleFollowToggle = async (userId: string, isFollowing: boolean) => {
    try {
      const endpoint = isFollowing ? '/api/unfollow' : '/api/follow';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetUserId: userId }),
      });

      const data = await response.json();
      if (data.success) {
        console.log(data.message);
        // 更新本地状态
        setUserRelationship(prev => prev ? {
          ...prev,
          isFollowing: !prev.isFollowing,
          isMutualFollow: !prev.isFollowing && prev.isFollower,
          isFriend: (!prev.isFollowing && prev.isFollower) || prev.isFriend
        } : null);
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  const handleFriendToggle = async (userId: string, isFriend: boolean) => {
    try {
      const endpoint = isFriend ? '/api/friend/remove' : '/api/friend/add';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friendId: userId }),
      });

      const data = await response.json();
      if (data.success) {
        console.log(data.message);
        // 更新本地状态
        setUserRelationship(prev => prev ? {
          ...prev,
          isFriend: !prev.isFriend
        } : null);
      }
    } catch (error) {
      console.error('Failed to toggle friend:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">社交功能演示</h1>
          <p className="text-gray-600">关注功能和好友功能的完整实现</p>
        </div>

        {/* 功能说明 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">功能说明</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">关注功能</h3>
              <p className="text-blue-700">用户可以关注其他用户，建立单向关注关系。关注是异步的，不需要对方同意。</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">好友功能</h3>
              <p className="text-green-700">用户可以手动添加好友，或者通过互相关注自动成为好友。好友可以相互发送消息。</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">自动成为好友</h3>
              <p className="text-purple-700">当两个用户互相关注时，系统会自动将他们设置为好友关系。</p>
            </div>
          </div>
        </div>

        {/* 用户资料演示 */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">用户资料卡片</h2>
            {userRelationship ? (
              <UserProfile
                userId={mockUser.id}
                username={mockUser.username}
                displayName={mockUser.displayName}
                avatar={mockUser.avatar}
                isCurrentUser={mockUser.isCurrentUser}
                relationship={userRelationship}
                onFollowToggle={handleFollowToggle}
                onFriendToggle={handleFriendToggle}
              />
            ) : (
              <div className="text-center py-8">
                <button
                  onClick={() => {
                    setSelectedUserId(mockUser.id);
                    setUserRelationship({
                      isFollowing: false,
                      isFollower: false,
                      isFriend: false,
                      isMutualFollow: false,
                    });
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  加载用户资料
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 社交关系管理 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">社交关系管理</h2>
          <UserRelations
            userId={currentUserId}
            onFollowToggle={handleFollowToggle}
            onFriendToggle={handleFriendToggle}
          />
        </div>

        {/* API 端点说明 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">API 端点</h2>
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">关注相关</h3>
                <ul className="space-y-1 text-gray-600">
                  <li><code className="bg-gray-100 px-2 py-1 rounded">POST /api/follow</code> - 关注用户</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">POST /api/unfollow</code> - 取消关注</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/following</code> - 获取关注列表</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/followers</code> - 获取粉丝列表</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">好友相关</h3>
                <ul className="space-y-1 text-gray-600">
                  <li><code className="bg-gray-100 px-2 py-1 rounded">POST /api/friend/add</code> - 添加好友</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">POST /api/friend/remove</code> - 删除好友</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/friends</code> - 获取好友列表</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/relationship/:id</code> - 获取关系状态</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
