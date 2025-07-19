'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { useSearchParams } from 'next/navigation';
// import SignIn from './sign-in';
import {SignUp} from './_comp/SignUp';
import { PasswordSignIn } from './_comp/PasswordSignIn';
import { Card, CardContent } from '@/components/ui/card';
import { SignIn } from './_comp/SignIn';
// import { PhoneNumberSignUp } from './PhoneNumberSignUp';

// 定义所有可能的视图类型
export type AuthView = 'sign_in' | 'sign_up' | 'forgot_password';

// 如果有忘记密码组件，导入它
import { ForgotPassword } from './_comp/forgot_password';

interface LoginUIProps {
  initialView?: AuthView;
}

export default function LoginUI({ initialView }: LoginUIProps = {}) {
  const searchParams = useSearchParams();
  const mode = searchParams?.get('mode');
  
  // 根据 props 或 URL 参数设置初始视图
  const getInitialView = (): AuthView => {
    if (initialView) {
      return initialView;
    }
    switch (mode) {
      case 'signup':
        return 'sign_up';
      case 'forgot':
        return 'forgot_password';
      default:
        return 'sign_in';
    }
  };
  
  const [currentView, setCurrentView] = useState<AuthView>(getInitialView());

  // 当 props 或 URL 参数变化时更新视图
  useEffect(() => {
    setCurrentView(getInitialView());
  }, [mode, initialView]);

  // 新的视图切换函数
  const switchToView = (view: AuthView) => {
    setCurrentView(view);
  };

  // 渲染对应的组件
  const renderAuthComponent = () => {
    switch (currentView) {
      case 'sign_in':
        return <SignIn  />
      case 'sign_up':
        return <SignUp  />
      case 'forgot_password':
        return <ForgotPassword  />
      default:
        return <SignIn  />
    }
  };

  return (
    <Card className="h-full w-full bg-transparent flex items-center justify-center z-50 rounded-md border-none shadow-none LoginUI">
      <CardContent className='bg-[#f2f8e3] rounded-large p-6 w-102'>
        {renderAuthComponent()}
      </CardContent>
    </Card>
  );
}
