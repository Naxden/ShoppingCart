"use client";

import { observer } from "mobx-react";
import { userStore } from "@/app/stores/userStore";
import { useRouter } from "next/navigation";

const LoginButton = observer(() => {
  const router = useRouter();

  const handleClick = () => {
    if (userStore.isLoggedIn) {
      userStore.logout();
    } else {
      router.push("/login");
    }
  };

  const bgClasses = userStore.isLoggedIn
    ? "bg-blue-600 hover:bg-blue-700"
    : "bg-gray-600 hover:bg-gray-700";

  return (
    <button
      className={`px-4 py-2 text-white rounded ${bgClasses}`}
      onClick={handleClick}
    >
      {userStore.isLoggedIn ? "Logout" : "Login"}
    </button>
  );
});

export default LoginButton;
