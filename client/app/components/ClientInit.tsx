'use client';

import { useEffect } from 'react';
import { userStore } from '@/app/stores/userStore';

export default function ClientInit() {
  useEffect(() => {
    userStore.init();
  }, []);

  return null;
}
