<template>
  <nav class="fixed top-0 left-0 w-72 h-screen bg-brand text-white p-6 shadow-2xl z-50 flex flex-col transition-all duration-500">
    
    <div class="mb-10 px-2 flex items-center gap-4">
      <div v-if="logoSrc" class="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-sm">
        <img :src="logoSrc" class="max-w-full max-h-full object-contain" />
      </div>
      
      <div v-else class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shadow-lg backdrop-blur-md">
        <i class="fas fa-hospital text-xs"></i>
      </div>

      <div>
        <h2 class="text-white text-2xl font-black italic tracking-tighter leading-none">
          KJSU<span class="text-indigo-400 brightness-150">APP</span>
        </h2>
        <p class="text-[8px] font-bold text-white/50 uppercase tracking-[0.3em] mt-1 italic">Assessment System</p>
      </div>
    </div>

    <div class="space-y-2 font-sans flex-1">
      <router-link to="/" class="flex items-center gap-3 p-4 rounded-2xl hover:bg-white/10 text-white/80 hover:text-white transition-all group" 
        active-class="bg-white/20 text-white shadow-lg backdrop-blur-md">
        <i class="fas fa-th-large text-xs"></i>
        <span class="font-bold text-sm">Dashboard Utama</span>
      </router-link>

      <router-link to="/reports" class="flex items-center gap-3 p-4 rounded-2xl hover:bg-white/10 text-white/80 hover:text-white transition-all group" 
        active-class="bg-white/20 text-white shadow-lg backdrop-blur-md">
        <i class="fas fa-file-medical text-xs"></i>
        <span class="font-bold text-sm">Laporan Asesmen</span>
      </router-link>

      <router-link v-if="role === 'super_admin'" to="/mapping" class="flex items-center gap-3 p-4 rounded-2xl hover:bg-white/10 text-white/80 hover:text-white transition-all group" 
        active-class="bg-white/20 text-white shadow-lg backdrop-blur-md">
        <i class="fas fa-hospital text-xs"></i>
        <span class="font-bold text-sm">Mapping Rumah Sakit</span>
      </router-link>

      <router-link v-if="role === 'super_admin'" to="/IndicatorManager" class="flex items-center gap-3 p-4 rounded-2xl hover:bg-white/10 text-white/80 hover:text-white transition-all group" 
        active-class="bg-white/20 text-white shadow-lg backdrop-blur-md">
        <i class="fas fa-list-check text-xs"></i>
        <span class="font-bold text-sm">Master Indikator</span>
      </router-link>

      <router-link v-if="role === 'super_admin'" to="/logs" class="flex items-center gap-3 p-4 rounded-2xl hover:bg-white/10 text-white/80 transition-all group" 
        active-class="bg-white/20 text-white shadow-lg backdrop-blur-md">
        <i class="fas fa-history text-xs"></i>
        <span class="font-bold text-sm">Audit Logs</span>
      </router-link>
    </div>
    

    <div class="space-y-3">
      <router-link to="/settings" class="flex items-center justify-between p-4 bg-black/10 rounded-2xl hover:bg-black/20 text-white transition-all group" 
        active-class="bg-white text-brand shadow-xl">
        <div class="flex items-center gap-3">
          <i class="fas fa-cog text-xs animate-spin-slow"></i>
          <span class="font-bold text-xs uppercase tracking-widest">Pengaturan</span>
        </div>
        <i class="fas fa-chevron-right text-[10px] opacity-30 group-hover:opacity-100"></i>
      </router-link>

      <button @click="logout" class="w-full p-4 bg-black/20 text-white font-bold rounded-2xl hover:bg-rose-600 transition-all text-sm flex items-center justify-center gap-2 shadow-lg">
        <i class="fas fa-power-off"></i> Logout System
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const role = ref(JSON.parse(localStorage.getItem('user_info') || '{}').role);
const logoSrc = ref(localStorage.getItem('app_logo'));

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user_info');
  router.push('/login');
};
onMounted(() => {

});
</script>