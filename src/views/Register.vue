<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const isLoading = ref(false)

function validateForm(): boolean {
  if (!name.value.trim()) {
    error.value = 'Name is required'
    return false
  }
  if (!email.value.trim()) {
    error.value = 'Email is required'
    return false
  }
  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return false
  }
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return false
  }
  return true
}

async function handleRegister() {
  error.value = ''

  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    await authStore.register(email.value, password.value, name.value)
    router.push('/')
  } catch (e) {
    error.value = 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-aside">
        <div class="aside-content">
          <h2>Join Outfitly</h2>
          <p>Start organizing your wardrobe today and create amazing outfits!</p>

          <div class="benefits">
            <div class="benefit">
              <span class="benefit-icon">📱</span>
              <h3>Digital Wardrobe</h3>
              <p>Keep all your clothes in one place</p>
            </div>

            <div class="benefit">
              <span class="benefit-icon">⚡</span>
              <h3>Quick Creation</h3>
              <p>Build outfits in seconds</p>
            </div>

            <div class="benefit">
              <span class="benefit-icon">🎨</span>
              <h3>Style Ideas</h3>
              <p>Get inspired by your saved outfits</p>
            </div>
          </div>
        </div>
      </div>

      <div class="register-card">
        <div class="register-header">
          <h1>Create Account</h1>
          <p>Join thousands of stylish users</p>
        </div>

        <form @submit.prevent="handleRegister" class="register-form">
          <div v-if="error" class="error-alert">
            <span>⚠️</span>
            {{ error }}
          </div>

          <div class="form-group">
            <label for="name" class="form-label">Full Name</label>
            <input
              id="name"
              v-model="name"
              type="text"
              class="form-input"
              placeholder="John Doe"
              required
              :disabled="isLoading"
            />
          </div>

          <div class="form-group">
            <label for="email" class="form-label">Email Address</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="form-input"
              placeholder="your@example.com"
              required
              :disabled="isLoading"
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-input"
              placeholder="••••••••"
              required
              :disabled="isLoading"
            />
            <p class="form-hint">At least 6 characters</p>
          </div>

          <div class="form-group">
            <label for="confirm-password" class="form-label">Confirm Password</label>
            <input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              class="form-input"
              placeholder="••••••••"
              required
              :disabled="isLoading"
            />
          </div>

          <button type="submit" class="btn-register" :disabled="isLoading">
            <span v-if="!isLoading">Create Account</span>
            <span v-else>Creating account...</span>
          </button>
        </form>

        <div class="register-footer">
          <p>Already have an account? <router-link to="/login">Sign in</router-link></p>
          <p class="info-text">📝 This is a mock interface. Real Clerk auth will be integrated soon.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.register-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1000px;
  width: 100%;
  align-items: center;
}

.register-aside {
  color: white;
  padding: 2rem;
}

.aside-content h2 {
  font-size: 2rem;
  margin: 0 0 1rem 0;
}

.aside-content > p {
  font-size: 1.1rem;
  margin: 0 0 2rem 0;
  opacity: 0.95;
}

.benefits {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.benefit {
  display: flex;
  gap: 1rem;
}

.benefit-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.benefit h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
}

.benefit p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.95rem;
}

.register-card {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-header h1 {
  font-size: 1.8rem;
  margin: 0 0 0.5rem 0;
  color: #333;
}

.register-header p {
  color: #666;
  margin: 0;
  font-size: 0.95rem;
}

.register-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
  box-sizing: border-box;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.form-input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.form-hint {
  font-size: 0.8rem;
  color: #999;
  margin: 0.3rem 0 0 0;
}

.error-alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #ffebee;
  color: #c62828;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.btn-register {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-register:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-register:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.register-footer {
  text-align: center;
  margin-top: 1.5rem;
}

.register-footer p {
  margin: 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

.register-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.register-footer a:hover {
  text-decoration: underline;
}

.info-text {
  background: #f0f4ff;
  padding: 0.5rem;
  border-radius: 4px;
  color: #667eea;
}

@media (max-width: 768px) {
  .register-container {
    grid-template-columns: 1fr;
  }

  .register-aside {
    display: none;
  }

  .register-card {
    padding: 2rem;
  }

  .register-header h1 {
    font-size: 1.5rem;
  }
}
</style>
