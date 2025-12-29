"use client";

import { observer } from "mobx-react";
import { userStore } from "@/app/stores/userStore";
import LoginForm from "@/app/components/LoginForm";

const LoginPage = observer(() => {
  return (
    <main style={{ maxWidth: 960, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Login Page</h1>

      {userStore.isLoggedIn ? (
        <h1>You are already logged in.</h1>
      ) : (
        <LoginForm />
      )}
    </main>
  );
});

export default LoginPage;
