'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {Cart} from "@/app/types/Cart";
import {getCart} from "@/app/lib/api";
import {getToken, isLoggedIn, onAuthChange} from "@/app/lib/auth";

export default function CartButton() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [cart, setCart] = useState<Cart | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const logged = isLoggedIn()
    setLoggedIn(logged)

    if (logged) {
      loadCart()
    }

    const unsubscribe = onAuthChange((newLoggedIn) => {
      setLoggedIn(newLoggedIn)
      if (newLoggedIn) {
        loadCart()
      } else {
        setCart(null)
        setExpanded(false)
      }
    })

    return unsubscribe
  }, [])

  async function loadCart() {
    const token = getToken()
    if (!token) return

    setLoading(true)
    try {
      const data = await getCart(token)
      setCart(data)
    } catch {
      setCart(null)
    } finally {
      setLoading(false)
    }
  }

  function handleClick() {
    if (!loggedIn) {
      router.push('/login')
      return
    }
    setExpanded(!expanded)
  }

  if (!mounted || !loggedIn) {
    return null
  }

  const totalPrice = cart?.totalPrice ?? 0

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={handleClick}
        disabled={loading}
        style={{
          padding: '8px 16px',
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 500
        }}
      >
        Cart: ${totalPrice.toFixed(2)}
      </button>

      {expanded && cart && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 8,
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: 6,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            minWidth: 320,
            maxHeight: 400,
            overflowY: 'auto',
            zIndex: 50
          }}
        >
          {cart.items.length === 0 ? (
            <div style={{ padding: 16, textAlign: 'center', color: '#6b7280' }}>
              Cart is empty
            </div>
          ) : (
            <div>
              {cart.items.map((item) => (
                <div
                  key={item.productId}
                  style={{
                    display: 'flex',
                    gap: 12,
                    padding: 12,
                    borderBottom: '1px solid #e5e7eb'
                  }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: 'cover',
                      borderRadius: 4
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                      ${item.unitPrice.toFixed(2)} × {item.quantity}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>
                      ${item.totalPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}