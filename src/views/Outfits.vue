<script setup lang="ts">
import { ref, computed } from 'vue'
import { useOutfitsStore } from '@/stores/outfits'

const outfitsStore = useOutfitsStore()

const searchQuery = ref('')
const selectedWeather = ref<'all' | 'warm' | 'cold' | 'mild'>('all')

const filteredOutfits = computed(() => {
  let items = outfitsStore.outfits

  if (selectedWeather.value !== 'all') {
    items = items.filter((outfit) => outfit.weather === selectedWeather.value)
  }

  if (searchQuery.value) {
    items = outfitsStore.searchOutfits(searchQuery.value)
  }

  return items
})

function deleteOutfit(id: string) {
  outfitsStore.deleteOutfit(id)
}
</script>

<template>
  <div class="outfits">
    <div class="outfits-header">
      <h1>My Outfits</h1>
      <p>Your curated outfit combinations</p>
    </div>

    <div class="outfits-controls">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search outfits..."
          class="search-input"
        />
      </div>
      <router-link to="/outfit-builder" class="btn-create">
        <span>+ Create Outfit</span>
      </router-link>
    </div>

    <div class="weather-filter">
      <button
        v-for="weather in ['all', 'warm', 'cold', 'mild']"
        :key="weather"
        :class="['weather-btn', { active: selectedWeather === weather }]"
        @click="selectedWeather = weather as typeof selectedWeather"
      >
        <span v-if="weather === 'all'">All Weather</span>
        <span v-else-if="weather === 'warm'">☀️ Warm</span>
        <span v-else-if="weather === 'cold'">❄️ Cold</span>
        <span v-else>🌤️ Mild</span>
      </button>
    </div>

    <div v-if="filteredOutfits.length > 0" class="outfits-grid">
      <div v-for="outfit in filteredOutfits" :key="outfit.id" class="outfit-card">
        <router-link :to="`/outfits/${outfit.id}`" class="outfit-link">
          <div class="outfit-image">
            <div class="items-preview">
              <span v-for="(item, idx) in outfit.items.slice(0, 4)" :key="idx" class="item-dot">
                <span class="dot-label">{{ item.name.charAt(0).toUpperCase() }}</span>
              </span>
            </div>
          </div>
          <h3>{{ outfit.name }}</h3>
          <p v-if="outfit.description" class="outfit-description">{{ outfit.description }}</p>
        </router-link>

        <div class="outfit-tags">
          <span v-for="occ in outfit.occasions?.slice(0, 2)" :key="occ" class="occasion-tag">
            {{ occ }}
          </span>
          <span v-if="outfit.weather" class="weather-tag">{{ outfit.weather }}</span>
        </div>

        <div class="outfit-footer">
          <span class="item-count">{{ outfit.items.length }} items</span>
          <div class="outfit-actions">
            <router-link :to="`/outfits/${outfit.id}`" class="btn-icon view-btn" title="View">
              👁️
            </router-link>
            <button class="btn-icon edit-btn" title="Edit">✏️</button>
            <button class="btn-icon delete-btn" title="Delete" @click="deleteOutfit(outfit.id)">
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <span class="empty-icon">✨</span>
      <h2>No outfits yet</h2>
      <p>
        <span v-if="searchQuery">Try adjusting your search terms</span>
        <span v-else>Create your first outfit to get started!</span>
      </p>
      <router-link to="/outfit-builder" class="btn-create-primary">+ Create Your First Outfit</router-link>
    </div>
  </div>
</template>

<style scoped>
.outfits {
  width: 100%;
}

.outfits-header {
  margin-bottom: 2rem;
}

.outfits-header h1 {
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  color: #333;
}

.outfits-header p {
  color: #666;
  margin: 0;
}

.outfits-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
}

.search-box {
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-create {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  white-space: nowrap;
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.weather-filter {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.weather-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.weather-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.weather-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.outfits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.outfit-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
}

.outfit-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.outfit-link {
  text-decoration: none;
  color: inherit;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
}

.outfit-image {
  width: 100%;
  aspect-ratio: 1.2;
  background: linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%);
  border-radius: 6px;
  margin: -1.25rem -1.25rem 1rem -1.25rem;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.items-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.item-dot {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dot-label {
  font-weight: 700;
  color: #667eea;
  font-size: 0.85rem;
}

.outfit-link h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #333;
}

.outfit-description {
  color: #666;
  font-size: 0.85rem;
  margin: 0;
}

.outfit-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
  padding: 0 1.25rem;
}

.occasion-tag {
  font-size: 0.75rem;
  background: #f0f4ff;
  color: #667eea;
  padding: 0.3rem 0.75rem;
  border-radius: 3px;
  text-transform: capitalize;
}

.weather-tag {
  font-size: 0.75rem;
  background: #f0f8f5;
  color: #4a9d6f;
  padding: 0.3rem 0.75rem;
  border-radius: 3px;
  text-transform: capitalize;
}

.outfit-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-top: 1px solid #f0f0f0;
  margin-top: auto;
}

.item-count {
  font-size: 0.85rem;
  color: #666;
}

.outfit-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  background: #e0e0e0;
}

.delete-btn:hover {
  background: #ffebee;
}

.view-btn {
  text-decoration: none;
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 8px;
}

.empty-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

.empty-state h2 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.empty-state p {
  color: #666;
  margin: 0 0 1.5rem 0;
}

.btn-create-primary {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-create-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .outfits-controls {
    flex-direction: column;
  }

  .outfits-grid {
    grid-template-columns: 1fr;
  }
}
</style>
