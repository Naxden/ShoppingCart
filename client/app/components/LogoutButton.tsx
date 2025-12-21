'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {isLoggedIn, logout, onAuthChange} from '../lib/auth'

export default function LogoutButton() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Mark as mounted and check auth state
    setMounted(true)
    setLoggedIn(isLoggedIn())

    // Subscribe to auth changes
    const unsubscribe = onAuthChange((newLoggedIn) => {
      setLoggedIn(newLoggedIn)
    })

    return unsubscribe
  }, [])

  function handleLogout() {
    logout()
    setLoggedIn(false)
    router.push('/')
  }

  function handleLogin() {
    router.push('/login')
  }

  if (loggedIn) {
    return (
      <button
        onClick={handleLogout}
        style={{
          padding: '8px 16px',
          backgroundColor: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          fontWeight: 500
        }}
      >
        Logout
      </button>
    )
  }

  return (
    <button
      onClick={handleLogin}
      style={{
        padding: '8px 16px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer',
        fontWeight: 500
      }}
    >
      Login
    </button>
  )
}