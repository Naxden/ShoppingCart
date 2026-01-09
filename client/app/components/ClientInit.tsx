'use client';

import { useEffect } from 'react';
import { userStore } from '@/app/stores/userStore';
import IsDevelopment from '../lib/consts';

export default function ClientInit() {
  useEffect(() => {
    userStore.init().catch((err) => {
      if (IsDevelopment()) console.error(err);
    });
  }, []);

  return null;
}
