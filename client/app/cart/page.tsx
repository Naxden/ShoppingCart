'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCart, clearCart } from '../lib/api'
import { getToken, isLoggedIn } from '../lib/auth'
import { Cart } from '../types/Cart'
import CartItemCard from '../components/CartItemCard'

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function loadCart() {
    const token = getToken()
    if (!token) {
      router.push('/login')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await getCart(token)
      setCart(data)
    } catch {
      setError('Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login')
      return
    }
    loadCart()
  }, [])

  async function handleClearCart() {
    const token = getToken()
    if (!token) return

    setLoading(true)
    try {
      await clearCart(token)
      await loadCart()
    } finally {
      setLoading(false)
    }
  }

  if (loading && !cart) {
    return (
      <main style={{ maxWidth: 960, margin: '2rem auto', padding: '0 1rem' }}>
        <p>Loading cart...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main style={{ maxWidth: 960, margin: '2rem auto', padding: '0 1rem' }}>
        <p style={{ color: 'red' }}>{error}</p>
      </main>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main style={{ maxWidth: 960, margin: '2rem auto', padding: '0 1rem' }}>
        <h1>Shopping Cart</h1>
        <p>Your cart is empty</p>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 960, margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>Shopping Cart</h1>
        <button
          onClick={handleClearCart}
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Clear Cart
        </button>
      </div>

      <div>
        {cart.items.map((item) => (
          <CartItemCard key={item.productId} item={item} onUpdate={loadCart} />
        ))}
      </div>

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        textAlign: 'right'
      }}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>
          Total: ${cart.totalPrice.toFixed(2)}
        </div>
      </div>
    </main>
  )
}