<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api/axios'; 
  
// Definisikan semua variabel biar TypeScript gak teriak

const loadCategories = async () => {
  try {
    const res = await api.get('/categories');
    categories.value = res.data;
    debugger
  } catch (error) {
    console.error("Gagal muat kategori", error);
  }
};

// ... kodingan import lu tetap sama

const hospitalName = ref(''); 
const hospitalClass = ref('B'); // Default kasih 'B' biar gak kosong
const categories = ref<any[]>([]); 
const selectedPriorities = ref<number[]>([]); 
const mappingData = ref<Record<number, string>>({}); 

// ... loadCategories lu tetap sama

const submitMapping = async () => {
  // Tambah validasi kelas sekalian Lid
  if (!hospitalName.value || !hospitalClass.value || selectedPriorities.value.length === 0) {
    alert('Isi dulu nama, kelas RS, dan centang kategorinya!');
    return;
  }
  
  try {
    const payload = {
      name: hospitalName.value,
      class: hospitalClass.value, // Kirim kelas ke backend
      selectedPriorities: selectedPriorities.value, 
      mappingData: mappingData.value 
    };
    
    await api.post('/hospitals/mapping', payload);
    alert('Mapping Berhasil Disimpan!');
  } catch (error) {
    alert('Gagal menyimpan mapping. Cek konsol!');
    console.error(error);
  }
};
loadCategories()
onMounted(loadCategories);
</script>
<template>
  <div class="ml-72 p-10 bg-slate-50 min-h-screen font-sans">
    <div class="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
      <div class="p-8 bg-indigo-600 text-white flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-black italic uppercase tracking-tight">Mapping Layanan & Strata</h2>
          <p class="text-indigo-100 text-xs mt-1 font-bold">Inisialisasi Penilaian RS Suyoto / RSPPN</p>
        </div>
        <i class="fas fa-map-marked-alt text-3xl opacity-30"></i>
      </div>

      <div class="p-8 space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Rumah Sakit</label>
            <input v-model="hospitalName" type="text" class="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-bold" placeholder="Contoh: RS Dr. Suyoto" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kelas RS</label>
            <select v-model="hospitalClass" class="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-bold">
              <option value="A text-slate-900">Kelas A</option>
              <option value="B text-slate-900">Kelas B</option>
              <option value="C text-slate-900">Kelas C</option>
            </select>
          </div>
        </div>

        <hr class="border-slate-50" />

        <div class="space-y-4">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Pilih Layanan Prioritas (KJSU-KIA)</label>
          <div v-for="cat in categories" :key="cat.id" class="p-5 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:bg-white hover:shadow-md group">
            <div class="flex items-center justify-between">
              <label class="flex items-center gap-4 cursor-pointer">
                <input type="checkbox" :value="cat.id" v-model="selectedPriorities" class="w-6 h-6 rounded-lg accent-indigo-600" />
                <span class="font-black text-slate-700 uppercase italic">{{ cat.name }}</span>
              </label>
              <span v-if="selectedPriorities.includes(cat.id)" class="text-[10px] font-black text-indigo-500 italic uppercase">Pilih Strata -></span>
            </div>

            <div v-if="selectedPriorities.includes(cat.id)" class="mt-4 pl-10 border-l-2 border-indigo-200">
              <select v-model="mappingData[cat.id]" class="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold">
                <option value="Paripurna">Strata Paripurna</option>
                <option value="Utama">Strata Utama</option>
                <option value="Madya">Strata Madya</option>
                <option value="Dasar">Strata Dasar</option>
              </select>
            </div>
          </div>
        </div>

        <button @click="submitMapping" class="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/20">
          Simpan Pemetaan RS
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Kasih margin kiri supaya gak ketutup sidebar */
.main-content {
  margin-left: 280px; 
  padding: 40px;
  min-height: 100vh;
}
.priority-item { margin-bottom: 1rem; }
</style>