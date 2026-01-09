'use client';

import { observer } from 'mobx-react';
import { cartStore } from '@/app/stores/cartStore';
import { userStore } from '@/app/stores/userStore';
import CartItemCard from '@/app/components/CartItemCard';
import { useEffect } from 'react';

const CartPage = observer(() => {
  useEffect(() => {
    cartStore.fetchCart();
  }, []);

  const isLoggedIn = userStore.isLoggedIn;
  const items = cartStore.items;
  const totalPrice = cartStore.totalPrice;

  return (
    <div>
      <h1 className="w-1/5 mx-auto text-center text-3xl mt-4">Shopping Cart</h1>
      {!isLoggedIn ? (
        <h2>Please log in to view your cart.</h2>
      ) : items.length === 0 ? (
        <h2>Your cart is empty.</h2>
      ) : (
        <div className="mt-4 max-w-1/2 mx-auto">
          {items.map((item) => (
            <CartItemCard cartItem={item} key={item.productId} />
          ))}
          <div className="h-px bg-gray-400 my-4 w-full"></div>
          <h2 className="font-semibold">
            Total Price: ${totalPrice.toFixed(2)}
          </h2>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded mt-4 hover:bg-red-800"
            onClick={cartStore.clearCart}
          >
            Clear cart
          </button>
        </div>
      )}
    </div>
  );
});

export default CartPage;
