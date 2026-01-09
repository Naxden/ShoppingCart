'use client';

import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userStore } from '@/app/stores/userStore';
import { LogoutReason } from '@/app/types/LogoutReason';

const AuthRedirect = observer(() => {
  const router = useRouter();

  const isLoggedIn: boolean = userStore.isLoggedIn;
  const logoutReason: LogoutReason | null = userStore.logoutReason;
  useEffect(() => {
    if (!isLoggedIn && logoutReason === LogoutReason.AUTH_EXPIRED) {
      console.log('Trying to rout to login');
      router.push('/login');
    }

    console.log('auth state changed');
  });

  return null;
});

export default AuthRedirect;
