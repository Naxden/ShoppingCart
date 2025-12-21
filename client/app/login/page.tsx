'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '../lib/api'
import { setToken, isLoggedIn, logout, onAuthChange } from '../lib/auth'

export default function LoginPage() {
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    setLoggedIn(isLoggedIn())

    const unsubscribe = onAuthChange((newLoggedIn) => {
      setLoggedIn(newLoggedIn)
      if (newLoggedIn) {
        router.push('/')
      }
    })

    return unsubscribe
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!userId.trim()) {
      setError('Please enter a user id')
      return
    }

    setLoading(true)
    try {
      const res = await login(userId.trim())
      if (!res.ok) {
        const msg = await res.text().catch(() => 'Login failed')
        setError(msg || 'Login failed')
        setLoading(false)
        return
      }

      const token = await res.text()
      setToken(token)
      setLoggedIn(true)
      router.push('/')
    } catch {
      setError('Cannot reach server')
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    logout()
    setLoggedIn(false)
    setError(null)
  }

  if (!mounted) {
    return (
      <main style={{ maxWidth: 480, margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ height: 200 }} />
      </main>
    )
  }

  if (loggedIn) {
    return (
      <main style={{ maxWidth: 480, margin: '2rem auto', padding: '0 1rem' }}>
        <h1>Logged in</h1>
        <p>You are already logged in.</p>
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
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 480, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="userId">User ID</label>
        <input
          id="userId"
          name="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          disabled={loading}
          style={{ display: 'block', width: '100%', margin: '0.5rem 0' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 500
          }}
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
      {error && (
        <p role="alert" style={{ color: 'red', marginTop: '1rem' }}>
          {error}
        </p>
      )}
    </main>
  )
}