import { Cart } from '@/app/types/Cart';
import { Product } from '@/app/types/Product';
import { ApiError } from '@/app/errors/ApiError';

const API_URL = 'http://localhost:5112/api';

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/cart/products`, {
    method: 'GET',
    cache: 'force-cache',
  });

  if (!res.ok) {
    throw new ApiError(res.status, res.statusText);
  }

  return res.json();
}

export async function login(userId: string): Promise<string> {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
    credentials: 'include',
  });

  if (!res.ok) {
    throw new ApiError(res.status, res.statusText);
  }

  return res.text(); // JWT as string
}

export async function refresh(): Promise<string> {
  const res = await fetch(`${API_URL}/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new ApiError(res.status, res.statusText);
  }

  return res.text(); // fresh JWT as string
}

export async function logout() {
  const res = await fetch(`${API_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new ApiError(res.status, res.statusText);
  }
}

export async function getCart(token: string): Promise<Cart> {
  const res = await fetch(`${API_URL}/cart`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new ApiError(res.status, res.statusText);
  }

  return res.json();
}

export async function clearCart(token: string) {
  const res = await fetch(`${API_URL}/cart`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new ApiError(res.status, res.statusText);
  }
}

export async function addProductToCart(
  productId: number,
  quantity: number,
  token: string
) {
  const res = await fetch(`${API_URL}/cart/${productId}?quantity=${quantity}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new ApiError(res.status, res.statusText);
  }
}

export async function removeProductFromCart(
  productId: number,
  quantity: number,
  token: string
) {
  const res = await fetch(`${API_URL}/cart/${productId}?quantity=${quantity}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new ApiError(res.status, res.statusText);
  }
}

export async function setProductQuantity(
  productId: number,
  quantity: number,
  token: string
) {
  const res = await fetch(`${API_URL}/cart/${productId}?quantity=${quantity}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new ApiError(res.status, res.statusText);
  }
}
