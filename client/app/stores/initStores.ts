import { reaction } from "mobx";
import { userStore } from "@/app/stores/userStore";
import { cartStore } from "@/app/stores/cartStore";

export function initStores() {
  reaction(
    () => userStore.isLoggedIn,
    (isLoggedIn) => {
      if (!isLoggedIn) {
        cartStore.clearCart();
      } else {
        cartStore.fetchCart();
      }
    },
  );
}
