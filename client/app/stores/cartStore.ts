'use client';

import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { Cart, CartItem } from '@/app/types/Cart';
import { Product } from '@/app/types/Product';
import { userStore } from '@/app/stores/userStore';
import * as api from '@/app/lib/api';
import { apiMediator } from '@/app/lib/apiMediator';

class CartStore {
  items: CartItem[] = [];
  totalPrice: number = 0;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    reaction(
      () => userStore.isLoggedIn,
      (isLoggedIn: boolean) => {
        if (isLoggedIn) {
          this.fetchCart();
        } else {
          this.clearLocalCart();
        }
      }
    );
  }

  clearLocalCart() {
    this.items = [];
    this.totalPrice = 0;
  }

  clearCart() {
    this.clearLocalCart();

    apiMediator
      .handleApiCall<void>((token) => api.clearCart(token));
  }

  addProduct(product: Product) {
    const existingItem = this.items.find(
      (item) => item.productId === product.id
    );
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      const item: CartItem = {
        productId: product.id,
        title: product.title,
        unitPrice: product.price,
        quantity: 1,
        totalPrice: product.price,
        imageUrl: product.images[0],
      };
      this.items.push(item);
    }
    this.totalPrice += product.price;

    apiMediator
      .handleApiCall<void>((token) => api.addProductToCart(product.id, 1, token))
      .then(() => this.fetchCart());
  }

  addItem(item: CartItem) {
    const existingItem = this.items.find((i) => i.productId === item.productId);
    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.totalPrice += item.unitPrice;
    } else {
      this.items.push({ ...item, quantity: 1, totalPrice: item.unitPrice });
    }

    this.totalPrice += item.unitPrice;

    apiMediator
      .handleApiCall<void>((token) =>
        api.addProductToCart(item.productId, 1, token)
      )
      .then(() => this.fetchCart());
  }

  updateItem(item: CartItem, quantity: number) {
    const exist = this.items.find((ci) => ci.productId === item.productId);
    if (!exist) return;

    if (quantity > 0) {
      this.totalPrice += (quantity - exist.quantity) * item.unitPrice;
      exist.quantity = quantity;
      exist.totalPrice = exist.quantity * item.unitPrice;
    } else {
      this.totalPrice -= exist.totalPrice;
      this.items = this.items.filter((i) => i.productId !== item.productId);
    }

    apiMediator
      .handleApiCall<void>((token) =>
        api.setProductQuantity(item.productId, quantity, token)
      )
      .then(() => this.fetchCart());
  }

  removeItem(item: CartItem) {
    const exist = this.items.find((ci) => ci.productId === item.productId);
    if (!exist) return;

    if (exist.quantity === 1) {
      this.items = this.items.filter((i) => i.productId !== item.productId);
    }
    this.totalPrice -= exist.quantity;

    apiMediator
      .handleApiCall<void>((token) =>
        api.removeProductFromCart(item.productId, 1, token)
      )
      .then(() => this.fetchCart());
  }

  fetchCart() {
    const token = userStore.accessToken;
    if (!token) return;


    apiMediator
      .handleApiCall<Cart>((token) => api.getCart(token))
      .then((cart) => {
        if (!cart) return;
        runInAction(() => {
          this.items = cart.items ?? [];
          this.totalPrice = cart.totalPrice ?? 0;
        });
      })
      .catch((error) => {
        console.error('Failed to fetch cart:', error);
      });
  }
}

export const cartStore = new CartStore();
