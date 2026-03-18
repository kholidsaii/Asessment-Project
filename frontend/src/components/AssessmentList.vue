<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="max-w-6xl mx-auto">
      <header class="mb-8 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-800">Dashboard Asesmen Watsar</h1>
        <span class="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold">
          Status: Aktif
        </span>
      </header>

      <div v-for="category in categories" :key="category.id" class="mb-10 bg-white shadow-lg rounded-xl overflow-hidden">
        <div class="bg-indigo-600 p-4">
          <h2 class="text-xl font-bold text-white flex items-center">
            <span class="mr-2">🏥</span> Asesmen Prioritas {{ category.name }}
          </h2>
        </div>

        <div class="p-6">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b-2 border-gray-100">
                <th class="py-3 px-2 text-gray-600">Bagian</th>
                <th class="py-3 px-2 text-gray-600">Indikator</th>
                <th class="py-3 px-2 text-center text-gray-600">Target (Min)</th>
                <th class="py-3 px-2 text-center text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="q in category.questions" :key="q.id" class="hover:bg-gray-50 border-b border-gray-50 transition">
                <td class="py-4 px-2 font-medium text-gray-700">
                  <span class="px-2 py-1 bg-gray-200 rounded text-xs">{{ q.section }}</span>
                </td>
                <td class="py-4 px-2 text-gray-800">{{ q.indicator }}</td>
                <td class="py-4 px-2 text-center font-bold text-indigo-600">{{ q.required_count }}</td>
                <td class="py-4 px-2 text-center">
                  <span class="text-yellow-500 font-bold italic text-sm">Menunggu Input...</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/axios'; // Pastikan path ke config axios kamu benar

const categories = ref([]);

const fetchData = async () => {
  try {
    const response = await api.get('/categories');
    categories.value = response.data; // Sesuaikan jika API kamu bungkus 'data' lagi
    console.log("Data loaded!", categories.value);
  } catch (error) {
    alert("Cek server Laravel kamu! Kayaknya mati.");
  }
};

onMounted(fetchData);
</script>