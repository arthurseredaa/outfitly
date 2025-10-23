<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOutfitsStore } from '@/stores/outfits'

const route = useRoute()
const router = useRouter()
const outfitsStore = useOutfitsStore()

const outfitId = route.params.id as string
const outfit = computed(() => outfitsStore.getOutfitById(outfitId))

function handleDelete() {
  if (confirm('Are you sure you want to delete this outfit?')) {
    outfitsStore.deleteOutfit(outfitId)
    router.push('/outfits')
  }
}

function handleEdit() {
  // TODO: Implement edit outfit flow
  alert('Edit outfit coming soon!')
}
</script>

<template>
  <div class="outfit-details">
    <router-link to="/outfits" class="back-link">&larr; Back to Outfits</router-link>

    <template v-if="outfit">
      <div class="details-header">
        <div class="header-content">
          <h1>{{ outfit.name }}</h1>
          <p v-if="outfit.description" class="description">{{ outfit.description }}</p>
        </div>
        <div class="header-actions">
          <button class="btn-action btn-edit" @click="handleEdit">✏️ Edit</button>
          <button class="btn-action btn-delete" @click="handleDelete">🗑️ Delete</button>
        </div>
      </div>

      <div class="details-grid">
        <div class="outfit-preview">
          <div class="preview-image">
            <div class="items-display">
              <span v-for="(item, idx) in outfit.items" :key="idx" class="item-preview-badge">
                {{ item.name.charAt(0).toUpperCase() }}
              </span>
            </div>
          </div>
        </div>

        <div class="outfit-info">
          <div class="info-section">
            <h2>Details</h2>
            <div class="info-row">
              <span class="label">Items:</span>
              <span class="value">{{ outfit.items.length }}</span>
            </div>
            <div class="info-row">
              <span class="label">Weather:</span>
              <span v-if="outfit.weather" class="value weather-badge">
                {{ outfit.weather === 'warm' ? '☀️' : outfit.weather === 'cold' ? '❄️' : '🌤️' }}
                {{ outfit.weather }}
              </span>
            </div>
            <div class="info-row">
              <span class="label">Created:</span>
              <span class="value">{{ new Date(outfit.createdAt).toLocaleDateString() }}</span>
            </div>
          </div>

          <div class="info-section">
            <h2>Occasions</h2>
            <div class="occasion-list">
              <span v-for="occ in outfit.occasions" :key="occ" class="occasion-badge">
                {{ occ }}
              </span>
            </div>
          </div>

          <div class="info-section">
            <h2>Items in this outfit</h2>
            <div class="items-list">
              <div v-for="item in outfit.items" :key="item.id" class="item-list-row">
                <div class="item-category">{{ item.category }}</div>
                <div class="item-name">{{ item.name }}</div>
                <div class="item-color">
                  <span class="color-swatch" :style="{ backgroundColor: item.color }"></span>
                  {{ item.color }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="error-state">
      <span class="error-icon">❌</span>
      <h2>Outfit not found</h2>
      <router-link to="/outfits" class="btn-back">Go Back to Outfits</router-link>
    </div>
  </div>
</template>

<style scoped>
.outfit-details {
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

.details-header {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  color: #333;
}

.description {
  color: #666;
  margin: 0;
  font-size: 1rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn-action {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-edit {
  background: #667eea;
  color: white;
}

.btn-edit:hover {
  background: #5568d3;
}

.btn-delete {
  background: #ffebee;
  color: #c62828;
}

.btn-delete:hover {
  background: #ffcdd2;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.outfit-preview {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.preview-image {
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.items-display {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}

.item-preview-badge {
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
  color: #667eea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.outfit-info {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.info-section {
  margin-bottom: 2rem;
}

.info-section:last-child {
  margin-bottom: 0;
}

.info-section h2 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #333;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f5f5f5;
}

.label {
  font-weight: 600;
  color: #666;
}

.value {
  color: #333;
}

.weather-badge {
  background: #f0f8f5;
  color: #4a9d6f;
  padding: 0.3rem 0.75rem;
  border-radius: 3px;
}

.occasion-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.occasion-badge {
  background: #f0f4ff;
  color: #667eea;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.85rem;
  text-transform: capitalize;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.item-list-row {
  display: grid;
  grid-template-columns: 100px 1fr 120px;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.item-category {
  font-weight: 600;
  color: #667eea;
  font-size: 0.85rem;
  text-transform: uppercase;
}

.item-name {
  color: #333;
}

.item-color {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.color-swatch {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid #ddd;
}

.error-state {
  text-align: center;
  background: white;
  border-radius: 8px;
  padding: 3rem 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.error-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.error-state h2 {
  margin: 0 0 1.5rem 0;
  color: #333;
}

.btn-back {
  display: inline-block;
  background: #667eea;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-back:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .details-header {
    flex-direction: column;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .item-list-row {
    grid-template-columns: 1fr;
  }
}
</style>
