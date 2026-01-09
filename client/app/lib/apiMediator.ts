'use client';

import { makeAutoObservable, runInAction } from 'mobx';
import { userStore } from '../stores/userStore';
import * as api from '@/app/lib/api';
import { LogoutReason } from '@/app/types/LogoutReason';
import { ApiError } from '@/app/errors/ApiError';

class ApiMediator {
  isRefreshing: boolean = false;
  refreshPromise: Promise<string> | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async handleApiCall<T>(
    apiCall: (token: string) => Promise<T>
  ): Promise<T | null> {
    const token = userStore.accessToken;
    if (!token) {
      return null;
    }

    try {
      return await apiCall(token);
    } catch (error: unknown) {
      if (error instanceof ApiError && error.statusCode === 401) {
        return await this.retryWithRefresh(apiCall);
      }
      return null;
    }
  }

  async retryWithRefresh<T>(
    apiCall: (token: string) => Promise<T>
  ): Promise<T | null> {
    if (this.isRefreshing && this.refreshPromise) {
      await this.refreshPromise;
      const token = userStore.accessToken;
      if (!token) return null;
      return await apiCall(token);
    }

    runInAction(() => {
      this.isRefreshing = true;
    });

    this.refreshPromise = api.refresh();

    try {
      const newToken = await this.refreshPromise;
      runInAction(() => {
        userStore.login(newToken);
        this.isRefreshing = false;
        this.refreshPromise = null;
      });
      return await apiCall(newToken);
    } catch (refreshError) {
      runInAction(() => {
        this.isRefreshing = false;
        this.refreshPromise = null;
      });
      userStore.logout(LogoutReason.AUTH_EXPIRED);

      return null;
    }
  }
}

export const apiMediator = new ApiMediator();
