"use client";

import { makeAutoObservable, runInAction } from "mobx";
import { CartItem } from "@/app/types/Cart";
import { Product } from "@/app/types/Product";
import { userStore } from "@/app/stores/userStore";
import * as api from "@/app/lib/api";

class CartStore {
  items: CartItem[] = [];
  totalPrice: number = 0;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get token() {
    return userStore.token;
  }

  clearCart() {
    this.items = [];
    this.totalPrice = 0;

    if (this.token) api.clearCart(this.token);
  }

  addProduct(product: Product) {
    const existingItem = this.items.find(
      (item) => item.productId === product.id,
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

    if (this.token)
      api
        .addProductToCart(product.id, 1, this.token)
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

    if (this.token)
      api
        .addProductToCart(item.productId, 1, this.token)
        .then(() => this.fetchCart());
  }

  updateItem(item: CartItem, quantity: number) {
    const exist = this.items.find((item) => item.productId === item.productId);
    if (!exist) return;

    if (quantity > 0) {
      this.totalPrice += (quantity - exist.quantity) * item.unitPrice;
      exist.quantity = quantity;
      exist.totalPrice = exist.quantity * item.unitPrice;
    } else {
      this.totalPrice -= exist.totalPrice;
      this.items = this.items.filter((i) => i.productId !== item.productId);
    }

    if (this.token)
      api
        .setProductQuantity(item.productId, quantity, this.token)
        .then(() => this.fetchCart());
  }

  removeItem(item: CartItem) {
    const exist = this.items.find((item) => item.productId === item.productId);
    if (!exist) return;

    if (exist.quantity === 1) {
      this.items = this.items.filter((i) => i.productId !== item.productId);
    }
    this.totalPrice -= exist.quantity;

    if (this.token)
      api
        .removeProductFromCart(item.productId, 1, this.token)
        .then(() => this.fetchCart());
  }

  async fetchCart() {
    const token = userStore.token;
    if (!token) return;

    try {
      const cart = await api.getCart(token);
      if (!cart) return;
      runInAction(() => {
        this.items = cart.items ?? [];
        this.totalPrice = cart.totalPrice ?? 0;
      });
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  }
}

export const cartStore = new CartStore();
