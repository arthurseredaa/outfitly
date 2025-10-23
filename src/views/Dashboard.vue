<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useWardrobeStore } from '@/stores/wardrobe'
import { useOutfitsStore } from '@/stores/outfits'

const authStore = useAuthStore()
const wardrobeStore = useWardrobeStore()
const outfitsStore = useOutfitsStore()

const user = computed(() => authStore.user)
const recentOutfits = computed(() => outfitsStore.outfits.slice(0, 4))
const stats = computed(() => ({
  totalItems: wardrobeStore.clothing.length,
  totalOutfits: outfitsStore.outfits.length,
  tops: wardrobeStore.topCount,
  bottoms: wardrobeStore.bottomCount,
}))
</script>

<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Welcome back, {{ user?.name }}! 👋</h1>
      <p class="subtitle">Here's an overview of your wardrobe</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">👕</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalItems }}</div>
          <div class="stat-label">Total Items</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">👔</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.tops }}</div>
          <div class="stat-label">Tops</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">👖</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.bottoms }}</div>
          <div class="stat-label">Bottoms</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">✨</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalOutfits }}</div>
          <div class="stat-label">Outfits</div>
        </div>
      </div>
    </div>

    <div class="quick-actions">
      <router-link to="/outfit-builder" class="action-btn primary">
        <span class="btn-icon">✚</span>
        <span>Create New Outfit</span>
      </router-link>
      <router-link to="/wardrobe" class="action-btn secondary">
        <span class="btn-icon">👜</span>
        <span>Browse Wardrobe</span>
      </router-link>
    </div>

    <div class="recent-section">
      <h2>Recent Outfits</h2>
      <div class="outfits-grid">
        <router-link
          v-for="outfit in recentOutfits"
          :key="outfit.id"
          :to="`/outfits/${outfit.id}`"
          class="outfit-card"
        >
          <div class="outfit-image">
            <div class="image-placeholder">
              <span v-for="(item, idx) in outfit.items.slice(0, 3)" :key="idx" class="item-badge">
                {{ item.name.charAt(0).toUpperCase() }}
              </span>
            </div>
          </div>
          <h3>{{ outfit.name }}</h3>
          <p v-if="outfit.occasions" class="occasions">
            {{ outfit.occasions.join(', ') }}
          </p>
          <div class="outfit-meta">
            <span class="item-count">{{ outfit.items.length }} items</span>
            <span v-if="outfit.weather" class="weather-badge">{{ outfit.weather }}</span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  width: 100%;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  color: #333;
}

.subtitle {
  color: #666;
  margin: 0;
  font-size: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 2rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
}

.stat-label {
  color: #666;
  font-size: 0.85rem;
}

.quick-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.action-btn.secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.action-btn.secondary:hover {
  background: #f0f4ff;
}

.btn-icon {
  font-size: 1.2rem;
}

.recent-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.recent-section h2 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.3rem;
}

.outfits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
}

.outfit-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.outfit-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  background: white;
}

.outfit-image {
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%);
  border-radius: 6px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

.item-badge {
  width: 28px;
  height: 28px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: #667eea;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.outfit-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: #333;
}

.occasions {
  color: #666;
  font-size: 0.8rem;
  margin: 0 0 0.75rem 0;
}

.outfit-meta {
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #999;
}

.item-count {
  background: rgba(102, 126, 234, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  color: #667eea;
}

.weather-badge {
  background: rgba(100, 200, 100, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  color: #4a9d6f;
}

@media (max-width: 768px) {
  .dashboard-header h1 {
    font-size: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .quick-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }

  .outfits-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>
