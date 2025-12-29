"use client";

import { useEffect } from "react";
import { userStore } from "@/app/stores/userStore";
import { cartStore } from "@/app/stores/cartStore";

export default function ClientInit() {
  useEffect(() => {
    userStore.init();
    cartStore.fetchCart();
  }, []);

  return null;
}
