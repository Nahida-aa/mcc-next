'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { useSearchParams } from 'next/navigation';
// import SignIn from './sign-in';
import { Card, CardContent } from '@/components/ui/card';
import { ForgotPassword } from '@/app/(auth)/_comp/forgot_password';
import { SignIn } from '@/app/(auth)/_comp/SignIn';
import { SignUp } from '@/app/(auth)/_comp/SignUp';
// import { PhoneNumberSignUp } from './PhoneNumberSignUp';


export default function LoginUI() {
  return (
    <Card className="h-full w-full bg-transparent flex items-center justify-center z-50 rounded-md border-none shadow-none LoginUI">
      <CardContent className='bg-[#f2f8e3] rounded-large p-6 w-102'>
        <ForgotPassword  />
      </CardContent>
    </Card>
  );
}
