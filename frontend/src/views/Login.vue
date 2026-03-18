<template>
  <div class="fixed inset-0 w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4 font-sans z-[999]">
    
    <div class="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
      
      <div class="absolute -top-20 -left-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>

      <div class="relative z-10 text-center mb-8">
        <h2 class="text-white text-4xl font-black italic tracking-tighter uppercase leading-none">
          KJSU<span class="text-indigo-400">APP</span>
        </h2>
        <p class="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-4">
          Assessment System Login
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6 relative z-10">
        <div class="space-y-2">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Administrator</label>
          <input 
            v-model="form.email" 
            type="email" 
            placeholder="admin@mail.com" 
            class="w-full px-6 py-4 bg-slate-800/50 border-2 border-slate-700/50 rounded-2xl text-white font-bold outline-none focus:border-indigo-500 transition-all"
            required 
          />
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
          <input 
            v-model="form.password" 
            type="password" 
            placeholder="••••••••" 
            class="w-full px-6 py-4 bg-slate-800/50 border-2 border-slate-700/50 rounded-2xl text-white font-bold outline-none focus:border-indigo-500 transition-all"
            required 
          />
        </div>

        <button 
          type="submit" 
          class="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-900/40 transition-all active:scale-95"
        >
          Masuk ke Sistem
        </button>
      </form>

      <div class="mt-10 text-center">
        <p class="text-slate-500 text-[8px] font-bold uppercase tracking-widest">
          Integrated Assessment for Watsar
        </p>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios';

const router = useRouter();
const loading = ref(false);
const form = ref({ email: '', password: '' });

const handleLogin = async () => {
  loading.value = true;
  try {
    const res = await api.post('/login', form.value);
    
    // Simpan Token & Info User
    localStorage.setItem('token', res.data.access_token);
    localStorage.setItem('user_info', JSON.stringify(res.data.user));
    
    router.push('/'); 
  } catch (err) {
    alert('Email atau password salah, Lid! Cek lagi ya.');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Menghapus semua margin/padding bawaan yang mungkin bikin putih di samping */
:deep(body) { 
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>