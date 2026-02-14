import { expect, test, vi, describe, beforeEach } from 'vitest'
import { middleware } from '@/middleware'
import { NextRequest } from 'next/server'

// Mock createServerClient
const mockGetUser = vi.fn()
const mockSupabase = {
  auth: {
    getUser: mockGetUser
  }
}

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => mockSupabase)
}))

// Mock env
vi.mock('@/lib/env', () => ({
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://example.com',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'key'
  }
}))

describe('Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('redirects to /admin-login if unauthenticated user accesses /admin', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    const req = new NextRequest('http://localhost:3000/admin')
    const res = await middleware(req)

    expect(res.status).toBe(307) // Temporary redirect
    expect(res.headers.get('location')).toBe('http://localhost:3000/admin-login')
  })

  test('redirects to /login if unauthenticated user accesses /dashboard', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    const req = new NextRequest('http://localhost:3000/dashboard')
    const res = await middleware(req)

    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('http://localhost:3000/login')
  })

  test('allows access to /admin if authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: '1' } } })

    const req = new NextRequest('http://localhost:3000/admin')
    const res = await middleware(req)

    expect(res.status).toBe(200)
    expect(res.headers.get('location')).toBeNull()
  })

  test('redirects to /dashboard if authenticated user accesses /login', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: '1' } } })

    const req = new NextRequest('http://localhost:3000/login')
    const res = await middleware(req)

    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('http://localhost:3000/dashboard')
  })
})
