import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User, AuthState } from '@/types'
import { mockUser } from '@/utils/mockData'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  // Fallback: Use mock user for UI testing without Clerk
  const useMockAuth = ref(true) // Set to true for testing without Clerk

  // Computed properties
  const authState = computed<AuthState>(() => ({
    user: user.value,
    isLoading: isLoading.value,
    error: error.value,
    isAuthenticated: isAuthenticated.value,
  }))

  // Actions
  async function login(email: string, password: string) {
    isLoading.value = true
    error.value = null

    try {
      // TODO: Integrate with Clerk authentication
      // const response = await clerkClient.signIn({ email, password })
      // user.value = response.user

      // Fallback: Mock authentication for UI testing
      if (useMockAuth.value) {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (email && password) {
          user.value = mockUser
        } else {
          throw new Error('Invalid credentials')
        }
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Login failed'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function register(email: string, password: string, name: string) {
    isLoading.value = true
    error.value = null

    try {
      // TODO: Integrate with Clerk authentication
      // const response = await clerkClient.signUp({ email, password, name })
      // user.value = response.user

      // Fallback: Mock registration for UI testing
      if (useMockAuth.value) {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (email && password && name) {
          user.value = {
            id: `user_${Date.now()}`,
            email,
            name,
            createdAt: new Date(),
          }
        } else {
          throw new Error('All fields are required')
        }
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Registration failed'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    isLoading.value = true

    try {
      // TODO: Integrate with Clerk authentication
      // await clerkClient.signOut()

      // Mock logout
      user.value = null
      error.value = null
    } finally {
      isLoading.value = false
    }
  }

  async function initializeAuth() {
    isLoading.value = true

    try {
      // TODO: Check Clerk session on app load
      // const session = await clerkClient.getSession()
      // if (session) {
      //   user.value = session.user
      // }

      // Fallback: Initialize with mock user if useMockAuth is true
      if (useMockAuth.value) {
        // Simulate checking for existing session
        await new Promise((resolve) => setTimeout(resolve, 300))
        user.value = mockUser // Auto-login in mock mode for testing
      }
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function setMockAuth(enabled: boolean) {
    useMockAuth.value = enabled
  }

  return {
    // State
    user,
    isLoading,
    error,
    isAuthenticated,
    authState,
    useMockAuth,
    // Actions
    login,
    register,
    logout,
    initializeAuth,
    clearError,
    setMockAuth,
  }
})
