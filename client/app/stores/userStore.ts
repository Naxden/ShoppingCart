import { makeAutoObservable } from "mobx";

class UserStore {
  isLoggedIn: boolean = false;
  token: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  login(token: string) {
    this.isLoggedIn = true;
    this.token = token;

    localStorage.setItem("token", token);
  }

  logout() {
    this.isLoggedIn = false;
    this.token = null;

    localStorage.removeItem("token");
  }

  init() {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (token) {
      this.isLoggedIn = true;
      this.token = token;
    }
  }
}

export const userStore = new UserStore();
