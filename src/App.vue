<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  // Initialize auth on app load
  authStore.initializeAuth()
})
</script>

<template>
  <router-view />
</template>

<style scoped></style>
