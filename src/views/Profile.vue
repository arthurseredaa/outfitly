<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useWardrobeStore } from '@/stores/wardrobe'
import { useOutfitsStore } from '@/stores/outfits'

const router = useRouter()
const authStore = useAuthStore()
const wardrobeStore = useWardrobeStore()
const outfitsStore = useOutfitsStore()

const user = computed(() => authStore.user)
const stats = computed(() => ({
  items: wardrobeStore.clothing.length,
  outfits: outfitsStore.outfits.length,
  categories: new Set(wardrobeStore.clothing.map((c) => c.category)).size,
}))

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="profile">
    <router-link to="/" class="back-link">&larr; Back to Dashboard</router-link>

    <div class="profile-header">
      <div class="profile-avatar">
        <img v-if="user?.avatar" :src="user.avatar" :alt="user.name" />
        <span v-else class="avatar-placeholder">👤</span>
      </div>
      <div class="profile-info">
        <h1>{{ user?.name }}</h1>
        <p class="profile-email">{{ user?.email }}</p>
        <p class="profile-member">
          Member since {{ new Date(user?.createdAt || '').toLocaleDateString() }}
        </p>
      </div>
    </div>

    <div class="profile-grid">
      <div class="stats-section">
        <h2>Your Statistics</h2>
        <div class="stats-cards">
          <div class="stat-box">
            <span class="stat-icon">👕</span>
            <div class="stat-details">
              <div class="stat-value">{{ stats.items }}</div>
              <div class="stat-label">Items</div>
            </div>
          </div>

          <div class="stat-box">
            <span class="stat-icon">✨</span>
            <div class="stat-details">
              <div class="stat-value">{{ stats.outfits }}</div>
              <div class="stat-label">Outfits</div>
            </div>
          </div>

          <div class="stat-box">
            <span class="stat-icon">📦</span>
            <div class="stat-details">
              <div class="stat-value">{{ stats.categories }}</div>
              <div class="stat-label">Categories</div>
            </div>
          </div>
        </div>
      </div>

      <div class="quick-links">
        <h2>Quick Links</h2>
        <div class="links-list">
          <router-link to="/wardrobe" class="link-item">
            <span class="link-icon">👜</span>
            <span>View Wardrobe</span>
            <span class="link-arrow">→</span>
          </router-link>
          <router-link to="/outfits" class="link-item">
            <span class="link-icon">✨</span>
            <span>Manage Outfits</span>
            <span class="link-arrow">→</span>
          </router-link>
          <router-link to="/outfit-builder" class="link-item">
            <span class="link-icon">✚</span>
            <span>Create Outfit</span>
            <span class="link-arrow">→</span>
          </router-link>
        </div>
      </div>

      <div class="settings-section">
        <h2>Settings</h2>
        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <h3>Account</h3>
              <p>Manage your account information</p>
            </div>
            <button class="btn-setting" disabled>Coming Soon</button>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3>Preferences</h3>
              <p>Customize your experience</p>
            </div>
            <button class="btn-setting" disabled>Coming Soon</button>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3>Privacy</h3>
              <p>Control your privacy settings</p>
            </div>
            <button class="btn-setting" disabled>Coming Soon</button>
          </div>
        </div>
      </div>

      <div class="danger-zone">
        <h2>⚠️ Danger Zone</h2>
        <button class="btn-logout" @click="handleLogout">
          <span>🚪</span>
          Sign Out
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile {
  width: 100%;
}

.back-link {
  display: inline-block;
  color: #667eea;
  text-decoration: none;
  margin-bottom: 1.5rem;
  font-weight: 500;
  transition: opacity 0.2s;
}

.back-link:hover {
  opacity: 0.8;
}

.profile-header {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  display: flex;
  gap: 2rem;
  align-items: center;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.profile-avatar {
  flex-shrink: 0;
}

.profile-avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #667eea;
}

.avatar-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
}

.profile-info h1 {
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  color: #333;
}

.profile-email {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 1rem;
}

.profile-member {
  margin: 0;
  color: #999;
  font-size: 0.9rem;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.stats-section,
.quick-links,
.settings-section,
.danger-zone {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.settings-section,
.danger-zone {
  grid-column: 1 / -1;
}

h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.2rem;
  color: #333;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.75rem;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.stat-box {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.stat-icon {
  font-size: 2rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
}

.stat-label {
  color: #666;
  font-size: 0.8rem;
}

.links-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.link-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}

.link-item:hover {
  background: #f0f4ff;
  color: #667eea;
  transform: translateX(4px);
}

.link-icon {
  font-size: 1.5rem;
}

.link-arrow {
  margin-left: auto;
  color: #ccc;
}

.link-item:hover .link-arrow {
  color: #667eea;
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.setting-info h3 {
  margin: 0;
  font-size: 1rem;
  color: #333;
}

.setting-info p {
  margin: 0.25rem 0 0 0;
  color: #666;
  font-size: 0.85rem;
}

.btn-setting {
  padding: 0.5rem 1rem;
  border: none;
  background: #e0e0e0;
  color: #999;
  border-radius: 4px;
  cursor: not-allowed;
  font-weight: 500;
}

.danger-zone {
  background: #ffebee;
  border: 2px solid #ffcdd2;
}

.danger-zone h2 {
  color: #c62828;
  border-bottom-color: #ffcdd2;
}

.btn-logout {
  width: 100%;
  padding: 1rem;
  border: none;
  background: #c62828;
  color: white;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-logout:hover {
  background: #b71c1c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(198, 40, 40, 0.3);
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .profile-grid {
    grid-template-columns: 1fr;
  }

  .settings-section,
  .danger-zone {
    grid-column: 1;
  }

  .setting-item {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .btn-setting {
    width: 100%;
  }
}
</style>
