import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Clothing } from '@/types'
import { mockClothing } from '@/utils/mockData'

export const useWardrobeStore = defineStore('wardrobe', () => {
  const clothing = ref<Clothing[]>(mockClothing)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties for filtering
  const clothingByCategory = computed(() => {
    return (category: Clothing['category']) =>
      clothing.value.filter((item) => item.category === category)
  })

  const topCount = computed(() => clothing.value.filter((c) => c.category === 'top').length)
  const bottomCount = computed(() => clothing.value.filter((c) => c.category === 'bottom').length)
  const outerwearCount = computed(() => clothing.value.filter((c) => c.category === 'outerwear').length)
  const footwearCount = computed(() => clothing.value.filter((c) => c.category === 'footwear').length)
  const accessoryCount = computed(() => clothing.value.filter((c) => c.category === 'accessory').length)

  // Actions
  function addClothing(item: Clothing) {
    // TODO: Call Supabase API to add clothing
    clothing.value.push(item)
  }

  function deleteClothing(id: string) {
    // TODO: Call Supabase API to delete clothing
    const index = clothing.value.findIndex((item) => item.id === id)
    if (index > -1) {
      clothing.value.splice(index, 1)
    }
  }

  function updateClothing(id: string, updates: Partial<Clothing>): void {
    // TODO: Call Supabase API to update clothing
    const item = clothing.value.find((c) => c.id === id)
    if (item) {
      Object.assign(item, updates)
    }
  }

  function getClothingById(id: string) {
    return clothing.value.find((item) => item.id === id)
  }

  function searchClothing(query: string) {
    const lowerQuery = query.toLowerCase()
    return clothing.value.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)),
    )
  }

  return {
    clothing,
    isLoading,
    error,
    clothingByCategory,
    topCount,
    bottomCount,
    outerwearCount,
    footwearCount,
    accessoryCount,
    addClothing,
    deleteClothing,
    updateClothing,
    getClothingById,
    searchClothing,
  }
})
