<template>
  <div id="app-layout">
    <Navigation v-if="$route.name !== 'Login'" />
    
    <div :class="{ 'main-content': $route.name !== 'Login' }">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import Navigation from './components/Navigation.vue';
import { onMounted } from 'vue';

onMounted(() => {
  const savedHex = localStorage.getItem('theme_color_hex') || '#4f46e5';
  document.documentElement.style.setProperty('--brand-color', savedHex);
});
</script>

<style>
/* Reset dasar biar scrollbar gak berantakan */
body {
  margin: 0;
  padding: 0;
  background-color: #f8fafc; /* bg-slate-50 senada dengan Master Indikator */
}

#app-layout { 
  display: flex; 
  min-height: 100vh;
}

.main-content { 
  /* HARUS 288px karena Navigation lu w-72 */
  margin-left: 100px; 
  
  /* Pake flex-1 biar dia ngambil sisa ruang secara otomatis */
  flex: 1; 
  
  /* Penting: width jangan 100% kalau ada margin-left besar, ntar overflow */
  width: auto; 
  
  padding: 32px; /* Setara p-8 agar judul laporannya gak mepet ke atas */
  min-width: 0;  /* Mencegah flexbox pecah saat konten tabel lebar */
  transition: all 0.3s ease;
}

/* Responsif: Jika layar kekecilan (Zoom gede banget), sidebar biasanya ilang/overlay */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
    padding: 20px;
  }
}
</style>