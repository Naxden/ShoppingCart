'use client';

import { observer } from 'mobx-react';
import { CartItem } from '@/app/types/Cart';
import { cartStore } from '@/app/stores/cartStore';
import { useState } from 'react';

const CartItemCard = observer((props: { cartItem: CartItem }) => {
  const { cartItem } = props;
  const [quantity, setQuantity] = useState(cartItem.quantity.toString());

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setQuantity(value);
    }
  };

  const handleQuantityBlur = () => {
    const num = parseInt(quantity) || 0;
    cartStore.updateItem(cartItem, num);
    setQuantity(num.toString());
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
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
    <div className="relative flex gap-6 p-6 bg-gray-200 rounded-xl max-w-3xl my-10">
      {/*Image*/}
      <img
        className="rounded-2xl object-cover flex w-1/3"
        src={cartItem.imageUrl}
        alt={`${cartItem.title} image`}
      />
      <div className="flex flex-col justify-between w-2/3">
        {/*Title*/}
        <h2 className="text-black text-2xl font-bold">{cartItem.title}</h2>

        {/*Quantity Controls*/}
        <div className="flex items-center gap-3 bg-gray-400 p-2 rounded-lg mx-auto">
          <button
            onClick={handleDecrement}
            className="m-2 px-3 text-xl py-1 bg-gray-200 text-gray-500 rounded hover:bg-gray-300"
          >
            -
          </button>
          <input
            type="text"
            value={quantity}
            onChange={handleQuantityChange}
            onBlur={handleQuantityBlur}
            onKeyDown={handleKeyPress}
            className="w-16 text-center bg-gray-300 text-gray-700 font-semibold rounded px-2 py-1"
          />
          <button
            onClick={handleIncrement}
            className="m-2 px-3 text-xl py-1 bg-gray-200 text-gray-500 rounded hover:bg-gray-300"
          >
            +
          </button>
        </div>

        {/*Unit Price*/}
        <p className="text-black italic text-center">
          Unit price: ${cartItem.unitPrice.toFixed(2)}
        </p>

        {/*Total Price*/}
        <p className="text-black text-xl font-bold">
          Total Price: ${cartItem.totalPrice.toFixed(2)}
        </p>
      </div>

      {/*Remove item button*/}
      <button
        onClick={handleRemove}
        className="absolute top-4 right-4 px-3 py-3 bg-red-500 text-white rounded hover:bg-red-600 self-start"
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
