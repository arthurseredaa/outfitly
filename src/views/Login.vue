<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

async function handleLogin() {
  error.value = ''
  isLoading.value = true

  try {
    await authStore.login(email.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = 'Login failed. Please check your credentials.'
  } finally {
    isLoading.value = false
  }
}

function handleDemo() {
  // Quick demo with test credentials
  email.value = 'test@example.com'
  password.value = 'password123'
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <span class="brand-icon">👗</span>
          <h1>Outfitly</h1>
          <p>Manage your wardrobe with style</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div v-if="error" class="error-alert">
            <span>⚠️</span>
            {{ error }}
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
          </div>

          <button type="submit" class="btn-login" :disabled="isLoading">
            <span v-if="!isLoading">Sign In</span>
            <span v-else>Signing in...</span>
          </button>
        </form>

        <div class="divider">OR</div>

        <button class="btn-demo" @click="handleDemo" :disabled="isLoading">
          🧪 Try Demo Account
        </button>

        <div class="login-footer">
          <p>Don't have an account? <router-link to="/register">Sign up</router-link></p>
          <p class="info-text">📝 This is a mock interface. Real Clerk auth will be integrated soon.</p>
        </div>
      </div>

      <div class="login-aside">
        <div class="aside-content">
          <h2>Welcome to Outfitly</h2>
          <p>Your personal wardrobe and outfit management application.</p>

          <div class="features">
            <div class="feature">
              <span class="feature-icon">👕</span>
              <h3>Organize Wardrobe</h3>
              <p>Catalog and categorize your clothing items</p>
            </div>

            <div class="feature">
              <span class="feature-icon">✨</span>
              <h3>Create Outfits</h3>
              <p>Mix and match items to create perfect looks</p>
            </div>

            <div class="feature">
              <span class="feature-icon">🎯</span>
              <h3>Smart Matching</h3>
              <p>Get suggestions based on weather and occasions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1000px;
  width: 100%;
  align-items: center;
}

.login-card {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.brand-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 0.5rem;
}

.login-header h1 {
  font-size: 1.8rem;
  margin: 0.5rem 0 0.25rem 0;
  color: #333;
}

.login-header p {
  color: #666;
  margin: 0;
  font-size: 0.95rem;
}

.login-form {
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

.btn-login,
.btn-demo {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-login {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.divider {
  text-align: center;
  margin: 1.5rem 0;
  color: #999;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e0e0e0;
  z-index: -1;
}

.divider {
  background: white;
  padding: 0 0.5rem;
}

.btn-demo {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-demo:hover:not(:disabled) {
  background: #f0f4ff;
}

.btn-demo:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-footer {
  text-align: center;
  margin-top: 1.5rem;
}

.login-footer p {
  margin: 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

.login-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.login-footer a:hover {
  text-decoration: underline;
}

.info-text {
  background: #f0f4ff;
  padding: 0.5rem;
  border-radius: 4px;
  color: #667eea;
}

.login-aside {
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

.features {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.feature {
  display: flex;
  gap: 1rem;
}

.feature-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.feature h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
}

.feature p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .login-container {
    grid-template-columns: 1fr;
  }

  .login-aside {
    display: none;
  }

  .login-card {
    padding: 2rem;
  }

  .login-header h1 {
    font-size: 1.5rem;
  }
}
</style>
