import { makeAutoObservable, runInAction } from 'mobx';
import { LogoutReason } from '@/app/types/LogoutReason';
import { logout } from '@/app/lib/api';
import { refresh } from '@/app/lib/api';
import { ApiError } from '@/app/errors/ApiError';
import IsDevelopment from '@/app/lib/consts';

class UserStore {
  isLoggedIn: boolean = false;
  accessToken: string | null = null;
  logoutReason: LogoutReason | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  login(accessToken: string) {
    this.accessToken = accessToken;
    this.isLoggedIn = true;
    this.logoutReason = null;
  }

  logout(reason: LogoutReason = LogoutReason.USER) {
    this.isLoggedIn = false;
    this.accessToken = null;
    this.logoutReason = reason;

    logout().catch((err) => {
      if (IsDevelopment()) {
        console.error(err);
      }
    });
  }

  async init() {
    if (typeof window === 'undefined') return;

    try {
      const accessToken = await refresh();
      if (accessToken) {
        runInAction(() => {
          this.accessToken = accessToken;
          this.isLoggedIn = true;
          this.logoutReason = null;
        });
      }
    } catch (err: unknown) {
      if (err instanceof ApiError && err.statusCode !== 401) {
        if (IsDevelopment()) console.error(err.message);
      }
    }
  }
}

export const userStore = new UserStore();
