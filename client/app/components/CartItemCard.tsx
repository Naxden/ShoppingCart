'use client'

import React, { useEffect, useState } from 'react'
import { CartItem } from '../types/Cart'
import { addProductToCart, removeProductFromCart, setProductQuantity } from '../lib/api'
import { getToken } from '../lib/auth'

type Props = {
  item: CartItem
  onUpdate?: () => void
}

export default function CartItemCard({ item, onUpdate }: Props) {
  const [inputValue, setInputValue] = useState<string>(String(item.quantity))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setInputValue(String(item.quantity))
  }, [item.quantity])

  async function handleDecrease() {
    const token = getToken()
    if (!token) return

    setLoading(true)
    try {
      await removeProductFromCart(item.productId, 1, token)
      onUpdate?.()
    } finally {
      setLoading(false)
    }
  }

  async function handleIncrease() {
    const token = getToken()
    if (!token) return

    setLoading(true)
    try {
      await addProductToCart(item.productId, 1, token)
      onUpdate?.()
    } finally {
      setLoading(false)
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^\d]/g, '')
    setInputValue(raw)
  }

  async function handleBlur() {
    const n = parseInt(inputValue || '', 10)
    if (Number.isNaN(n) || n < 1) {
      setInputValue(String(item.quantity))
      return
    }

    const token = getToken()
    if (!token) return

    const newQty = Math.max(1, Math.floor(n))
    setInputValue(String(newQty))

    if (newQty === item.quantity) return

    setLoading(true)
    try {
      await setProductQuantity(item.productId, newQty, token)
      onUpdate?.()
    } finally {
      setLoading(false)
    }
  }

  async function handleRemove() {
    const token = getToken()
    if (!token) return

    setLoading(true)
    try {
      await removeProductFromCart(item.productId, item.quantity, token)
      onUpdate?.()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      padding: 12,
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      marginBottom: 12
    }}>
      <img src={item.imageUrl} alt={item.title} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6 }} />

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.title}</div>
        <div style={{ color: '#6b7280', fontSize: 14 }}>
          Unit price: ${item.unitPrice.toFixed(2)}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          aria-label="Decrease quantity"
          onClick={handleDecrease}
          disabled={loading || item.quantity <= 1}
          style={{ width: 32, height: 32 }}
        >
          -
        </button>

        <input
          aria-label="Quantity"
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          disabled={loading}
          style={{
            width: 56,
            textAlign: 'center',
            padding: '6px 8px',
            borderRadius: 4,
            border: '1px solid #d1d5db'
          }}
        />

        <button
          aria-label="Increase quantity"
          onClick={handleIncrease}
          disabled={loading}
          style={{ width: 32, height: 32 }}
        >
          +
        </button>
      </div>

      <div style={{ minWidth: 100, textAlign: 'right', fontWeight: 600, fontSize: 16 }}>
        ${item.totalPrice.toFixed(2)}
      </div>

      <button
        onClick={handleRemove}
        disabled={loading}
        style={{
          padding: '8px 16px',
          backgroundColor: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        Remove
      </button>
    </div>
  )
}