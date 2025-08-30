"use client";
import { cApi } from '@/lib/api.client';
import { sApi } from '@/lib/api/server';
import { useEffect } from 'react';

export default function Page () {
  useEffect(() => {
    // 测试 API 调用
    const testApi = async () => {
      try {
        const res = await cApi.auth.test.$get();
        console.log('API Response:', res);
      } catch (error) {
        console.error('API Error:', error);
      }
    };
    testApi();
  }, []);
  return <>
    <h1>Page</h1>
    <p>This is the Page page.</p>
  </>
}