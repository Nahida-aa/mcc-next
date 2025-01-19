import { Suspense } from 'react';
import { Loader } from '@/components/ui/loader/Loader';

export const FriendNotification = () => {
  return (
    <Suspense fallback={<Loader />}>
      <h1>Notification</h1>
      <p>This is the Notification page.</p>
    </Suspense>
  );
}

export default FriendNotification;
