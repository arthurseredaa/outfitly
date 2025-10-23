<script setup lang="ts">
import Navbar from './Navbar.vue'
</script>

<template>
  <div class="main-layout">
    <Navbar />
    <main class="main-content">
      <slot />
    </main>
    <footer class="main-footer">
      <div class="footer-content">
        <p>&copy; 2024 Outfitly. All rights reserved.</p>
        <div class="footer-links">
          <a href="#" class="footer-link">Privacy</a>
          <a href="#" class="footer-link">Terms</a>
          <a href="#" class="footer-link">Contact</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.main-footer {
  background: #333;
  color: #fff;
  padding: 2rem 1rem;
  text-align: center;
  margin-top: 2rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-content p {
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

.footer-link {
  color: #ccc;
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #fff;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
}
</style>
