'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '../types/Product'
import { addProductToCart } from '../lib/api'
import { getToken, isLoggedIn } from '../lib/auth'

type Props = {
  product: Product
  className?: string
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

export default function ProductCard({ product, className }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const image = product.images && product.images.length > 0 ? product.images[0] : undefined
  const shortDescription =
    product.description && product.description.length > 120
      ? `${product.description.slice(0, 120).trim()}…`
      : product.description

  async function handleAddToCart() {
    if (!isLoggedIn()) {
      router.push('/login')
      return
    }

    const token = getToken()
    if (!token) return

    setLoading(true)
    try {
      await addProductToCart(product.id, 1, token)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`product-card ${className ?? ''}`}
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: 12,
        maxWidth: 320,
        background: '#fff',
      }}
    >
      <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 6, marginBottom: 8 }}>
        {image ? (
          <img src={image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', background: '#f3f4f6' }}>
            No image
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h3 style={{ margin: 0, fontSize: 16, lineHeight: 1.2 }}>{product.title}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <small style={{ color: '#6b7280' }}>{product.category?.name}</small>
          <strong style={{ fontSize: 16 }}>{formatPrice(product.price)}</strong>
        </div>

        {shortDescription ? (
          <p style={{ margin: '8px 0 0 0', color: '#374151', fontSize: 13 }}>{shortDescription}</p>
        ) : null}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <small style={{ color: '#9ca3af' }}>{new Date(product.creationAt).toLocaleDateString()}</small>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={loading}
            style={{
              background: loading ? '#9ca3af' : '#3b82f6',
              color: '#fff',
              border: 'none',
              padding: '6px 10px',
              borderRadius: 6,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}