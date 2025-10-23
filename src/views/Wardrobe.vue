<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWardrobeStore } from '@/stores/wardrobe'
import type { Clothing } from '@/types'

const wardrobeStore = useWardrobeStore()

const searchQuery = ref('')
const selectedCategory = ref<Clothing['category'] | 'all'>('all')

const filteredClothing = computed(() => {
  let items = wardrobeStore.clothing

  if (selectedCategory.value !== 'all') {
    items = items.filter((item) => item.category === selectedCategory.value)
  }

  if (searchQuery.value) {
    items = wardrobeStore.searchClothing(searchQuery.value)
  }

  return items
})

const categories: Array<{ value: Clothing['category'] | 'all'; label: string; emoji: string }> = [
  { value: 'all', label: 'All Items', emoji: '👕' },
  { value: 'top', label: 'Tops', emoji: '👔' },
  { value: 'bottom', label: 'Bottoms', emoji: '👖' },
  { value: 'outerwear', label: 'Outerwear', emoji: '🧥' },
  { value: 'footwear', label: 'Footwear', emoji: '👟' },
  { value: 'accessory', label: 'Accessories', emoji: '💍' },
]

function deleteItem(id: string) {
  wardrobeStore.deleteClothing(id)
}
</script>

<template>
  <div class="wardrobe">
    <div class="wardrobe-header">
      <h1>My Wardrobe</h1>
      <p>Manage and organize your clothing items</p>
    </div>

    <div class="wardrobe-controls">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search items..."
          class="search-input"
        />
      </div>
      <router-link to="/add-item" class="btn-add">
        <span>+ Add Item</span>
      </router-link>
    </div>

    <div class="category-filter">
      <button
        v-for="cat in categories"
        :key="cat.value"
        :class="['category-btn', { active: selectedCategory === cat.value }]"
        @click="selectedCategory = cat.value"
      >
        <span class="cat-emoji">{{ cat.emoji }}</span>
        <span>{{ cat.label }}</span>
      </button>
    </div>

    <div v-if="filteredClothing.length > 0" class="clothing-grid">
      <div v-for="item in filteredClothing" :key="item.id" class="clothing-card">
        <div class="item-image">
          <div class="image-placeholder">
            <span class="placeholder-text">{{ item.category.toUpperCase() }}</span>
          </div>
        </div>
        <div class="item-content">
          <h3>{{ item.name }}</h3>
          <p v-if="item.description" class="item-description">{{ item.description }}</p>
          <div class="item-meta">
            <span class="color-badge">
              <span class="color-dot" :style="{ backgroundColor: item.color }"></span>
              {{ item.color }}
            </span>
            <span class="category-tag">{{ item.category }}</span>
          </div>
          <div v-if="item.tags && item.tags.length > 0" class="tags">
            <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
        <div class="item-actions">
          <button class="btn-icon edit-btn" title="Edit">✏️</button>
          <button class="btn-icon delete-btn" title="Delete" @click="deleteItem(item.id)">
            🗑️
          </button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <span class="empty-icon">👕</span>
      <h2>No items found</h2>
      <p>
        <span v-if="searchQuery">Try adjusting your search terms</span>
        <span v-else>Start by adding some items to your wardrobe!</span>
      </p>
      <router-link to="/add-item" class="btn-add-primary">+ Add Your First Item</router-link>
    </div>
  </div>
</template>

<style scoped>
.wardrobe {
  width: 100%;
}

.wardrobe-header {
  margin-bottom: 2rem;
}

.wardrobe-header h1 {
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  color: #333;
}

.wardrobe-header p {
  color: #666;
  margin: 0;
}

.wardrobe-controls {
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

.btn-add {
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

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.category-filter {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.category-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.category-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.cat-emoji {
  font-size: 1.1rem;
}

.clothing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.clothing-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
}

.clothing-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.item-image {
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  text-align: center;
}

.placeholder-text {
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  opacity: 0.5;
}

.item-content {
  flex: 1;
  padding: 1.25rem;
}

.item-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #333;
}

.item-description {
  margin: 0 0 0.75rem 0;
  color: #666;
  font-size: 0.85rem;
}

.item-meta {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.color-badge {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: #666;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #ddd;
}

.category-tag {
  font-size: 0.75rem;
  background: #f0f4ff;
  color: #667eea;
  padding: 0.25rem 0.75rem;
  border-radius: 3px;
  text-transform: capitalize;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tag {
  display: inline-block;
  font-size: 0.7rem;
  background: #f0f0f0;
  color: #666;
  padding: 0.25rem 0.6rem;
  border-radius: 3px;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.25rem 0;
  border-top: 1px solid #f0f0f0;
}

.btn-icon {
  flex: 1;
  padding: 0.5rem;
  border: none;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #e0e0e0;
}

.delete-btn:hover {
  background: #ffebee;
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

.btn-add-primary {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-add-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .wardrobe-controls {
    flex-direction: column;
  }

  .clothing-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }

  .category-filter {
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
}
</style>
