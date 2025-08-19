/**
 * 频道成员相关的API调用示例和React Hooks
 */

import { useState, useEffect } from 'react';
import useSWR from 'swr';

// 类型定义
export interface ChannelMember {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  nickname?: string;
  roles: string[];
  permissions: string;
  status: 'active' | 'inactive' | 'banned' | 'pending';
  joinedAt: Date;
  isOnline?: boolean;
  lastActiveAt?: Date;
  channelPermissions: string;
  canViewChannel: boolean;
  canSendMessages: boolean;
  canManageMessages: boolean;
}

export interface ChannelMemberStats {
  totalMembers: number;
  onlineMembers: number;
  membersByRole: Record<string, number>;
  membersByStatus: {
    active: number;
    inactive: number;
    banned: number;
    pending: number;
  };
}

// API调用函数
class ChannelMemberAPI {
  /**
   * 获取频道成员列表
   */
  static async listChannelMember(
    channelId: string,
    options?: {
      includeOffline?: boolean;
      limit?: number;
      search?: string;
    }
  ): Promise<{ members: ChannelMember[]; total: number }> {
    const params = new URLSearchParams();
    
    if (options?.includeOffline) params.set('includeOffline', 'true');
    if (options?.limit) params.set('limit', options.limit.toString());
    if (options?.search) params.set('search', options.search);

    const response = await fetch(`/api/channels/${channelId}/members?${params}`, {
      headers: {
        'x-user-id': getCurrentUserId(), // 这里应该从认证状态获取
      },
    });

    if (!response.ok) {
      throw new Error(`获取频道成员失败: ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || '获取频道成员失败');
    }

    return result.data;
  }

  /**
   * 获取频道成员统计
   */
  static async statsChannelMember(channelId: string): Promise<ChannelMemberStats> {
    const response = await fetch(`/api/channels/${channelId}/members/stats`, {
      headers: {
        'x-user-id': getCurrentUserId(),
      },
    });

    if (!response.ok) {
      throw new Error(`获取频道统计失败: ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || '获取频道统计失败');
    }

    return result.data;
  }

  /**
   * 获取在线成员
   */
  static async getOnlineMembers(channelId: string): Promise<{ members: ChannelMember[]; total: number }> {
    const response = await fetch(`/api/channels/${channelId}/members/online`, {
      headers: {
        'x-user-id': getCurrentUserId(),
      },
    });

    if (!response.ok) {
      throw new Error(`获取在线成员失败: ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || '获取在线成员失败');
    }

    return result.data;
  }

  /**
   * 获取用户权限
   */
  static async getUserPermissions(channelId: string, userId: string) {
    const response = await fetch(`/api/channels/${channelId}/members/${userId}/permissions`, {
      headers: {
        'x-user-id': getCurrentUserId(),
      },
    });

    if (!response.ok) {
      throw new Error(`获取用户权限失败: ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || '获取用户权限失败');
    }

    return result.data;
  }
}

// React Hooks
/**
 * 使用频道成员列表的Hook
 */
export function useChannelMembers(
  channelId: string,
  options?: {
    includeOffline?: boolean;
    limit?: number;
    search?: string;
    refreshInterval?: number;
  }
) {
  const key = channelId 
    ? `/api/channels/${channelId}/members?${JSON.stringify(options)}` 
    : null;

  const { data, error, mutate } = useSWR(
    key,
    () => ChannelMemberAPI.listChannelMember(channelId, options),
    {
      refreshInterval: options?.refreshInterval || 30000, // 默认30秒刷新
      revalidateOnFocus: true,
    }
  );

  return {
    members: data?.members || [],
    total: data?.total || 0,
    isLoading: !error && !data,
    isError: !!error,
    error,
    refresh: mutate,
  };
}

/**
 * 使用在线成员的Hook
 */
export function useOnlineMembers(channelId: string, refreshInterval = 10000) {
  const key = channelId ? `/api/channels/${channelId}/members/online` : null;

  const { data, error, mutate } = useSWR(
    key,
    () => ChannelMemberAPI.getOnlineMembers(channelId),
    {
      refreshInterval, // 默认10秒刷新在线状态
      revalidateOnFocus: true,
    }
  );

  return {
    onlineMembers: data?.members || [],
    onlineCount: data?.total || 0,
    isLoading: !error && !data,
    isError: !!error,
    error,
    refresh: mutate,
  };
}

/**
 * 使用频道统计的Hook
 */
export function useChannelMemberStats(channelId: string) {
  const key = channelId ? `/api/channels/${channelId}/members/stats` : null;

  const { data, error, mutate } = useSWR(
    key,
    () => ChannelMemberAPI.statsChannelMember(channelId),
    {
      refreshInterval: 60000, // 1分钟刷新一次统计
    }
  );

  return {
    stats: data,
    isLoading: !error && !data,
    isError: !!error,
    error,
    refresh: mutate,
  };
}

/**
 * 搜索频道成员的Hook
 */
export function useChannelMemberSearch(channelId: string) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ChannelMember[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const searchMembers = async () => {
      setIsSearching(true);
      try {
        const result = await ChannelMemberAPI.listChannelMember(channelId, {
          search: searchQuery,
          limit: 20,
        });
        setSearchResults(result.members);
      } catch (error) {
        console.error('搜索成员失败:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchMembers, 300);
    return () => clearTimeout(debounceTimer);
  }, [channelId, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
  };
}

// 工具函数
function getCurrentUserId(): string {
  // 这里应该从实际的认证状态获取当前用户ID
  // 例如从 localStorage, cookie, 或者 React Context 获取
  return localStorage.getItem('userId') || 'anonymous';
}

export default ChannelMemberAPI;
