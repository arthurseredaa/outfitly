<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWardrobeStore } from '@/stores/wardrobe'
import { useOutfitsStore } from '@/stores/outfits'
import type { Clothing, Outfit } from '@/types'

const router = useRouter()
const wardrobeStore = useWardrobeStore()
const outfitsStore = useOutfitsStore()

const outfitName = ref('')
const outfitDescription = ref('')
const selectedItems = ref<Clothing[]>([])
const selectedWeather = ref<Outfit['weather']>('mild')
const selectedOccasions = ref<string[]>([])

const availableOccasions = ['casual', 'formal', 'work', 'weekend', 'date', 'evening', 'gym', 'party']

const filteredClothing = computed(() => {
  return wardrobeStore.clothing
})

const isValid = computed(() => {
  return outfitName.value.trim().length > 0 && selectedItems.value.length > 0
})

function toggleItemSelection(item: Clothing) {
  const index = selectedItems.value.findIndex((i) => i.id === item.id)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(item)
  }
}

function toggleOccasion(occasion: string) {
  const index = selectedOccasions.value.indexOf(occasion)
  if (index > -1) {
    selectedOccasions.value.splice(index, 1)
  } else {
    selectedOccasions.value.push(occasion)
  }
}

function createOutfit() {
  if (!isValid.value) return

  const newOutfit: Outfit = {
    id: `outfit_${Date.now()}`,
    name: outfitName.value,
    description: outfitDescription.value || undefined,
    items: selectedItems.value,
    weather: selectedWeather.value,
    occasions: selectedOccasions.value.length > 0 ? selectedOccasions.value : undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  outfitsStore.addOutfit(newOutfit)
  router.push(`/outfits/${newOutfit.id}`)
}
</script>

<template>
  <div class="outfit-builder">
    <router-link to="/outfits" class="back-link">&larr; Back to Outfits</router-link>

    <div class="builder-container">
      <div class="builder-form">
        <div class="form-section">
          <h2>Basic Information</h2>
          <div class="form-group">
            <label for="name" class="form-label">Outfit Name *</label>
            <input
              id="name"
              v-model="outfitName"
              type="text"
              class="form-input"
              placeholder="e.g., Casual Weekend Look"
            />
          </div>

          <div class="form-group">
            <label for="description" class="form-label">Description</label>
            <textarea
              id="description"
              v-model="outfitDescription"
              class="form-input"
              rows="3"
              placeholder="Describe this outfit..."
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Weather Type</label>
            <div class="weather-options">
              <button
                v-for="weather in ['warm', 'cold', 'mild']"
                :key="weather"
                :class="['weather-option', { active: selectedWeather === weather }]"
                @click="selectedWeather = weather as typeof selectedWeather"
              >
                <span v-if="weather === 'warm'">☀️ Warm</span>
                <span v-else-if="weather === 'cold'">❄️ Cold</span>
                <span v-else>🌤️ Mild</span>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Occasions</label>
            <div class="occasions-grid">
              <button
                v-for="occ in availableOccasions"
                :key="occ"
                :class="['occasion-btn', { active: selectedOccasions.includes(occ) }]"
                @click="toggleOccasion(occ)"
              >
                {{ occ }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="builder-preview">
        <div class="preview-card">
          <h3>Outfit Preview</h3>
          <div class="preview-display">
            <div v-if="selectedItems.length === 0" class="empty-preview">
              <span>👕</span>
              <p>Select items to build your outfit</p>
            </div>
            <div v-else class="preview-items">
              <div v-for="item in selectedItems" :key="item.id" class="preview-item">
                <div class="item-badge">{{ item.category.charAt(0).toUpperCase() }}</div>
                <div class="item-details">
                  <h4>{{ item.name }}</h4>
                  <p class="item-category">{{ item.category }}</p>
                  <p class="item-color">
                    <span class="color-dot" :style="{ backgroundColor: item.color }"></span>
                    {{ item.color }}
                  </p>
                </div>
                <button class="btn-remove" @click="toggleItemSelection(item)">✕</button>
              </div>
            </div>
          </div>
        </div>

        <div class="preview-summary">
          <h4>Summary</h4>
          <div class="summary-row">
            <span>Outfit Name:</span>
            <strong>{{ outfitName || '(not set)' }}</strong>
          </div>
          <div class="summary-row">
            <span>Items:</span>
            <strong>{{ selectedItems.length }}</strong>
          </div>
          <div class="summary-row">
            <span>Weather:</span>
            <strong class="weather-label">
              <span v-if="selectedWeather === 'warm'">☀️ Warm</span>
              <span v-else-if="selectedWeather === 'cold'">❄️ Cold</span>
              <span v-else>🌤️ Mild</span>
            </strong>
          </div>
          <div class="summary-row">
            <span>Occasions:</span>
            <strong v-if="selectedOccasions.length > 0">{{ selectedOccasions.join(', ') }}</strong>
            <strong v-else class="text-muted">(none selected)</strong>
          </div>
        </div>
      </div>
    </div>

    <div class="form-section items-section">
      <h2>Select Clothing Items</h2>
      <p class="section-hint">Click items to add them to your outfit</p>

      <div class="items-grid">
        <button
          v-for="item in filteredClothing"
          :key="item.id"
          :class="['item-selector', { selected: selectedItems.some((i) => i.id === item.id) }]"
          @click="toggleItemSelection(item)"
        >
          <div class="selector-badge">{{ item.category.charAt(0).toUpperCase() }}</div>
          <div class="selector-info">
            <h4>{{ item.name }}</h4>
            <p class="selector-category">{{ item.category }}</p>
            <p class="selector-color">
              <span class="color-dot" :style="{ backgroundColor: item.color }"></span>
              {{ item.color }}
            </p>
          </div>
          <div class="checkmark">✓</div>
        </button>
      </div>
    </div>

    <div class="form-actions">
      <router-link to="/outfits" class="btn-cancel">Cancel</router-link>
      <button :disabled="!isValid" class="btn-submit" @click="createOutfit">Create Outfit</button>
    </div>
  </div>
</template>

<style scoped>
.outfit-builder {
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

.builder-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.builder-form,
.builder-preview {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 2rem;
}

.form-section:last-child {
  margin-bottom: 0;
}

.form-section h2 {
  margin: 0 0 1.25rem 0;
  font-size: 1.1rem;
  color: #333;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.5rem;
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
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

textarea.form-input {
  resize: vertical;
}

.weather-options {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.weather-option {
  padding: 0.5rem 1rem;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.weather-option:hover {
  border-color: #667eea;
  color: #667eea;
}

.weather-option.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.occasions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.5rem;
}

.occasion-btn {
  padding: 0.5rem 0.75rem;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
  text-transform: capitalize;
}

.occasion-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.occasion-btn.active {
  background: #f0f4ff;
  border-color: #667eea;
  color: #667eea;
}

.preview-card {
  margin-bottom: 1.5rem;
}

.preview-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #333;
}

.preview-display {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 1.5rem;
  min-height: 200px;
}

.empty-preview {
  text-align: center;
  color: #999;
}

.empty-preview span {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.5rem;
}

.preview-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.preview-item {
  background: white;
  padding: 0.75rem;
  border-radius: 4px;
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.item-badge {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  margin: 0;
  font-size: 0.9rem;
  color: #333;
}

.item-category {
  font-size: 0.75rem;
  color: #999;
  margin: 0.2rem 0;
  text-transform: uppercase;
}

.item-color {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: #666;
  margin: 0;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #ddd;
  display: inline-block;
}

.btn-remove {
  width: 28px;
  height: 28px;
  border: none;
  background: #ffebee;
  color: #c62828;
  border-radius: 50%;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-remove:hover {
  background: #ffcdd2;
}

.preview-summary {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 1rem;
}

.preview-summary h4 {
  margin: 0 0 0.75rem 0;
  font-size: 0.95rem;
  color: #333;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e0e0e0;
  font-size: 0.9rem;
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-row span {
  color: #666;
}

.summary-row strong {
  color: #333;
}

.text-muted {
  color: #999;
}

.weather-label {
  color: #4a9d6f;
}

.section-hint {
  color: #999;
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
}

.items-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.item-selector {
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: left;
}

.item-selector:hover {
  border-color: #667eea;
  background: #f5f7ff;
}

.item-selector.selected {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-color: #667eea;
}

.selector-badge {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.selector-info {
  flex: 1;
}

.selector-info h4 {
  margin: 0;
  font-size: 0.95rem;
  color: #333;
}

.selector-category {
  font-size: 0.8rem;
  color: #999;
  margin: 0.2rem 0;
  text-transform: uppercase;
}

.selector-color {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: #666;
  margin: 0;
}

.checkmark {
  width: 24px;
  height: 24px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  opacity: 0;
  transition: opacity 0.2s;
}

.item-selector.selected .checkmark {
  opacity: 1;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-cancel,
.btn-submit {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  text-decoration: none;
}

.btn-cancel {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-cancel:hover {
  background: #f0f4ff;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .builder-container {
    grid-template-columns: 1fr;
  }

  .items-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
  }
}
</style>
