<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <router-link to="/" class="brand-link">
          <span class="brand-icon">👗</span>
          <span class="brand-name">Outfitly</span>
        </router-link>
      </div>

      <div class="navbar-menu">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/wardrobe" class="nav-link">Wardrobe</router-link>
        <router-link to="/outfits" class="nav-link">Outfits</router-link>
        <router-link to="/outfit-builder" class="nav-link">Create</router-link>
      </div>

      <div class="navbar-end">
        <div v-if="user" class="user-section">
          <div class="user-info">
            <img
              v-if="user.avatar"
              :src="user.avatar"
              :alt="user.name"
              class="user-avatar"
            />
            <span class="user-name">{{ user.name }}</span>
          </div>
          <button class="btn-logout" @click="handleLogout">Logout</button>
        </div>
        <div v-else class="auth-buttons">
          <router-link to="/login" class="btn-link">Login</router-link>
          <router-link to="/register" class="btn-link btn-primary">Sign Up</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.navbar-brand {
  flex-shrink: 0;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.3rem;
  transition: opacity 0.2s;
}

.brand-link:hover {
  opacity: 0.8;
}

.brand-icon {
  font-size: 1.5rem;
}

.navbar-menu {
  display: flex;
  gap: 2rem;
  flex: 1;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.nav-link:hover {
  opacity: 0.8;
}

.nav-link.router-link-active {
  opacity: 1;
  border-bottom: 2px solid white;
}

.navbar-end {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-size: 0.9rem;
}

.btn-logout {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid white;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.2s;
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.3);
}

.auth-buttons {
  display: flex;
  gap: 1rem;
}

.btn-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.btn-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.btn-primary {
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid white;
}

.btn-primary:hover {
  background: rgba(255, 255, 255, 0.4);
}

@media (max-width: 768px) {
  .navbar-container {
    flex-direction: column;
    gap: 1rem;
  }

  .navbar-menu {
    width: 100%;
    flex-direction: column;
    gap: 0.5rem;
  }

  .navbar-end {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
