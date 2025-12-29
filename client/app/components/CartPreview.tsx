"use client";

import { observer } from "mobx-react";
import { cartStore } from "@/app/stores/cartStore";
import { userStore } from "@/app/stores/userStore";
import Link from "next/link";

const CartPreview = observer(() => {
  if (!userStore.isLoggedIn) {
    return null;
  }

  const itemCount = cartStore.items.length;
  const totalPrice = cartStore.totalPrice;

  return (
    <Link
      href="/cart"
      className="flex items-center gap-2 p-2 border rounded hover:bg-gray-100"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <div className="flex flex-col">
        <span className="text-sm font-semibold">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
        <span className="text-xs text-gray-600">${totalPrice.toFixed(2)}</span>
      </div>
    </Link>
  );
});

export default CartPreview;
