import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Outfit } from '@/types'
import { mockOutfits } from '@/utils/mockData'

export const useOutfitsStore = defineStore('outfits', () => {
  const outfits = ref<Outfit[]>(mockOutfits)
  const selectedOutfitId = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const selectedOutfit = computed(() =>
    outfits.value.find((outfit) => outfit.id === selectedOutfitId.value),
  )

  const outfitsByWeather = computed(() => {
    return (weather: Outfit['weather']) => outfits.value.filter((outfit) => outfit.weather === weather)
  })

  const outfitsByOccasion = computed(() => {
    return (occasion: string) =>
      outfits.value.filter((outfit) => outfit.occasions?.includes(occasion))
  })

  // Actions
  function addOutfit(outfit: Outfit) {
    // TODO: Call Supabase API to add outfit
    outfits.value.push(outfit)
  }

  function deleteOutfit(id: string) {
    // TODO: Call Supabase API to delete outfit
    const index = outfits.value.findIndex((outfit) => outfit.id === id)
    if (index > -1) {
      outfits.value.splice(index, 1)
    }
    if (selectedOutfitId.value === id) {
      selectedOutfitId.value = null
    }
  }

  function updateOutfit(id: string, updates: Partial<Outfit>): void {
    // TODO: Call Supabase API to update outfit
    const outfit = outfits.value.find((o) => o.id === id)
    if (outfit) {
      Object.assign(outfit, updates)
    }
  }

  function selectOutfit(id: string) {
    selectedOutfitId.value = id
  }

  function deselectOutfit() {
    selectedOutfitId.value = null
  }

  function getOutfitById(id: string) {
    return outfits.value.find((outfit) => outfit.id === id)
  }

  function searchOutfits(query: string) {
    const lowerQuery = query.toLowerCase()
    return outfits.value.filter(
      (outfit) =>
        outfit.name.toLowerCase().includes(lowerQuery) ||
        outfit.description?.toLowerCase().includes(lowerQuery) ||
        outfit.occasions?.some((occ) => occ.toLowerCase().includes(lowerQuery)),
    )
  }

  return {
    outfits,
    selectedOutfitId,
    selectedOutfit,
    isLoading,
    error,
    outfitsByWeather,
    outfitsByOccasion,
    addOutfit,
    deleteOutfit,
    updateOutfit,
    selectOutfit,
    deselectOutfit,
    getOutfitById,
    searchOutfits,
  }
})
