const API_URL = 'http://localhost:5112/api'

export async function getProducts() {
  const res = await fetch(`${API_URL}/cart/products`, {
    method: 'GET',
  })

  return res.json()
}

export async function login(userId: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({userId}),
  })

  return res // JWT as string
}

export async function getCart(token: string) {
  const res = await fetch(`${API_URL}/cart`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  return res.json()
}

export async function clearCart(token: string) {
  await fetch(`${API_URL}/cart`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
}

export async function addProductToCart(productId: number, quantity: number, token: string) {
  await fetch(`${API_URL}/cart/${productId}?quantity=${quantity}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
}

export async function removeProductFromCart(productId: number, quantity: number, token: string) {
  await fetch(`${API_URL}/cart/${productId}?quantity=${quantity}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
}

export async function setProductQuantity(productId: number, quantity: number, token: string) {
  await fetch(`${API_URL}/cart/${productId}?quantity=${quantity}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
}