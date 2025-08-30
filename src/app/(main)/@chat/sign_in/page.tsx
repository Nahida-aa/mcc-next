
// import SignIn from './sign-in';
import { Card, CardContent } from '@/components/ui/card';
import { ForgotPassword } from '@/app/(auth)/_comp/forgot_password';
import { SignIn } from '@/app/(auth)/_comp/SignIn';
import { SignUp } from '@/app/(auth)/_comp/SignUp';
import { ScrollArea } from '@/components/ui/scroll-area';
import { View } from 'lucide-react';
// import { PhoneNumberSignUp } from './PhoneNumberSignUp';

export default function LoginUI() {

  return (
            <ScrollArea aria-label='ScrollArea' hideScrollBar className="  h-full" classNames={
              {viewport:'h-full w-full flex items-center justify-center'}
              }>
            {/* <CardContent aria-label="CardContent" className="p-0"> */}
    <Card aria-label='LoginUI' className="h-full w-full bg-transparent flex items-center justify-center z-50 rounded-md border-none shadow-none">
      <CardContent className='bg-[#f2f8e3] rounded-large p-6 w-102'>
        <SignIn  />
      </CardContent>
    </Card>
            {/* </CardContent> */}
            </ScrollArea>
  );
}
