"use client";

import { observer } from "mobx-react";
import { CartItem } from "@/app/types/Cart";
import { cartStore } from "@/app/stores/cartStore";
import { useState } from "react";

const CartItemCard = observer((props: { cartItem: CartItem }) => {
  const { cartItem } = props;
  const [quantity, setQuantity] = useState(cartItem.quantity.toString());

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setQuantity(value);
    }
  };

  const handleQuantityBlur = () => {
    const num = parseInt(quantity) || 0;
    cartStore.updateItem(cartItem, num);
    setQuantity(num.toString());
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleQuantityBlur();
    }
  };

  const handleIncrement = () => {
    const newQty = cartItem.quantity + 1;
    cartStore.addItem(cartItem);
    setQuantity(newQty.toString());
  };

  const handleDecrement = () => {
    const newQty = Math.max(0, cartItem.quantity - 1);
    cartStore.removeItem(cartItem);
    setQuantity(newQty.toString());
  };

  const handleRemove = () => {
    cartStore.updateItem(cartItem, 0);
  };

  return (
    <div className="border p-4 mb-4 rounded flex gap-4">
      <img
        src={cartItem.imageUrl}
        alt={cartItem.title}
        className="w-24 h-24 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{cartItem.title}</h3>
        <p className="text-gray-600">
          Unit Price: ${cartItem.unitPrice.toFixed(2)}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={handleDecrement}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            -
          </button>
          <input
            type="text"
            value={quantity}
            onChange={handleQuantityChange}
            onBlur={handleQuantityBlur}
            onKeyDown={handleKeyPress}
            className="w-16 text-center border rounded px-2 py-1"
          />
          <button
            onClick={handleIncrement}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            +
          </button>
          <span className="ml-2">Quantity: {cartItem.quantity}</span>
        </div>
        <p className="font-semibold mt-2">
          Total: ${cartItem.totalPrice.toFixed(2)}
        </p>
      </div>
      <button
        onClick={handleRemove}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 self-start"
        title="Remove from cart"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
});

export default CartItemCard;
