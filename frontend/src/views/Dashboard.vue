<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import api from '../api/axios';
import { useRouter, useRoute } from 'vue-router';
import VueApexCharts from "vue3-apexcharts";
import type { ApexOptions } from 'apexcharts'; // 1. Tambahkan Import Type ini

const router = useRouter();
const route = useRoute();

const categories = ref<any[]>([]);
const currentHospital = ref<any>(null);
const hospitals = ref<any[]>([]); 
const selectedHospitalId = ref<number | null>(null);
const isLoading = ref(false);

// --- 1. Analytics Radar State dengan Type ApexOptions ---
const radarSeries = ref([{ name: 'Kesiapan Layanan (%)', data: [] }]);

// Gunakan tipe ApexOptions biar TS gak marah soal 'type: radar'
const radarOptions = ref<ApexOptions>({
  chart: { 
    type: 'radar', // Sekarang TS tau ini valid radar
    toolbar: { show: false },
    dropShadow: { enabled: true, blur: 8, left: 1, top: 1, opacity: 0.1 }
  },
  colors: ['#4f46e5'],
  xaxis: { 
    categories: [],
    labels: { style: { colors: '#64748b', fontSize: '10px', fontWeight: 900 } }
  },
  yaxis: { show: false, max: 100 },
  fill: { opacity: 0.3 },
  markers: { size: 4, colors: ['#4f46e5'], strokeWidth: 2 }
});

// --- 2. Fungsi Load Data Radar ---
const fetchRadarData = async (hospitalId: number) => {
  try {
    const res = await api.get(`/analytics/radar?hospital_id=${hospitalId}`);
    
    // Cek dulu apakah radarSeries[0] ada isinya
    if (radarSeries.value[0]) {
      radarSeries.value[0].data = res.data.scores;
    }
    
    radarOptions.value = {
      ...radarOptions.value,
      xaxis: {
        ...(radarOptions.value.xaxis || {}),
        categories: res.data.labels
      }
    };
  } catch (e) {
    console.error("Gagal muat data radar", e);
  }
};

// ... (fungsi loadInitialData, fetchAssessments, watch, dll tetap sama) ...

const loadInitialData = async () => {
  isLoading.value = true;
  try {
    const res = await api.get('/hospitals'); 
    hospitals.value = res.data;
    
    const queryId = route.query.hospital_id;
    if (queryId) {
      selectedHospitalId.value = Number(queryId);
    } else if (hospitals.value.length > 0) {
      selectedHospitalId.value = hospitals.value[0].id;
    }
  } catch (error) {
    console.error("Gagal muat daftar RS", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchAssessments = async (hospitalId: number) => {
  isLoading.value = true;
  try {
    const response = await api.get('/dashboard/assessments', {
      params: { hospital_id: hospitalId }
    });
    categories.value = response.data;
    currentHospital.value = hospitals.value.find((h: any) => h.id === hospitalId);
    await fetchRadarData(hospitalId);
  } catch (error) {
    console.error("Gagal tarik data asesmen", error);
  } finally {
    isLoading.value = false;
  }
};

watch(selectedHospitalId, (newId) => {
  if (newId) fetchAssessments(newId);
});

const submitSkor = async (questionId: number, score: number) => {
  if (score > 10) score = 10;
  if (score < 0) score = 0;

  try {
    await api.post('/assessments/save', {
      hospital_id: selectedHospitalId.value,
      question_id: questionId,
      score: score
    });
    if (selectedHospitalId.value) fetchRadarData(selectedHospitalId.value);
  } catch (error) {
    console.error("Gagal simpan skor", error);
  }
};

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user_info');
  router.push('/login');
};

const getScoreClass = (score: number) => {
  if (score >= 10) return 'border-emerald-500 text-emerald-700 bg-emerald-50';
  if (score > 0) return 'border-amber-500 text-amber-700 bg-amber-50';
  return 'border-slate-200 text-slate-400 bg-slate-50';
};

onMounted(loadInitialData);

// --- Perhitungan Statistik (Computed) ---
const totalSkorKeseluruhan = computed(() => {
  return categories.value.reduce((acc, cat) => {
    const catScore = cat.questions.reduce((sum: number, q: any) => sum + (Number(q.score) || 0), 0);
    return acc + catScore;
  }, 0);
});

const totalSoal = computed(() => {
  return categories.value.reduce((acc, cat) => acc + (cat.questions?.length || 0), 0);
});

const persentaseKesiapan = computed(() => {
  if (totalSoal.value === 0) return 0;
  const maxSkor = totalSoal.value * 10;
  return ((totalSkorKeseluruhan.value / maxSkor) * 100).toFixed(1);
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 ml-72 p-8 font-sans text-slate-900 border-l border-slate-200/50">
    
    <header class="flex items-center justify-between bg-white rounded-3xl shadow-sm p-8 mb-8 border border-slate-100">
      <div class="flex items-center gap-6">
        <div>
          <h1 class="text-3xl font-black tracking-tighter text-indigo-950 uppercase italic leading-none">
            KJSU <span class="text-indigo-600">Dashboard</span>
          </h1>
          
          <div class="mt-4 flex items-center gap-3">
            <div class="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-200">
              <i class="fas fa-hospital-alt text-sm"></i>
            </div>
            <div class="relative">
              <select v-model="selectedHospitalId" 
                class="appearance-none bg-slate-50 border-2 border-slate-100 text-indigo-700 font-black rounded-xl px-4 py-2.5 pr-10 outline-none focus:border-indigo-500 transition-all shadow-inner text-sm">
                <option v-for="h in hospitals" :key="h.id" :value="h.id">{{ h.name }}</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-indigo-500">
                <i class="fas fa-chevron-down text-[10px]"></i>
              </div>
            </div>
            <span v-if="currentHospital" class="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-200">
              Kelas {{ currentHospital.class }}
            </span>
          </div>
        </div>
      </div>
      
      <button @click="handleLogout" class="px-6 py-3 bg-white text-rose-600 font-black rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm border-2 border-rose-100 text-xs uppercase tracking-widest active:scale-95">
        Logout System
      </button>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
      <div class="lg:col-span-2 bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/30 border border-slate-100 relative overflow-hidden">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Analisis Radar Kesiapan</h3>
          <span class="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-lg italic">Real-time Data</span>
        </div>
        <VueApexCharts height="350" :options="radarOptions" :series="radarSeries" />
      </div>

      <div class="flex flex-col gap-6">
        <div class="bg-indigo-600 p-8 rounded-[3rem] shadow-xl shadow-indigo-200 text-white flex flex-col justify-center flex-1 relative overflow-hidden">
          <p class="text-4xl font-black italic">{{ persentaseKesiapan }}%</p>
          <p class="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] mt-2">Kesiapan Layanan Total</p>
          <i class="fas fa-chart-line absolute right-8 top-1/2 -translate-y-1/2 text-white/10 text-6xl"></i>
        </div>
        
        <div class="bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/30 border border-slate-100 flex items-center gap-6">
          <div class="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl shadow-inner"><i class="fas fa-check-double"></i></div>
          <div>
            <p class="text-2xl font-black text-slate-800 leading-none">{{ totalSoal }}</p>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Indikator Terpetakan</p>
          </div>
        </div>
      </div>
    </div>

    <main class="space-y-12">
      <div v-if="isLoading" class="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
        <p class="mt-6 font-black text-slate-300 uppercase tracking-widest italic text-sm">Menyusun Data Asesmen...</p>
      </div>

      <div v-else v-for="cat in categories" :key="cat.id" class="bg-white rounded-[3.5rem] shadow-xl shadow-slate-200/40 overflow-hidden border border-slate-100 transition-all hover:shadow-2xl">
        <div class="px-12 py-10 border-b border-slate-50 bg-gradient-to-r from-slate-50 to-transparent flex justify-between items-center">
          <div class="flex items-center gap-6">
            <div class="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center shadow-lg text-white text-2xl font-black italic uppercase">
              {{ cat.name.charAt(0) }}
            </div>
            <div>
              <h2 class="text-2xl font-black text-slate-800 tracking-tight uppercase italic leading-none">{{ cat.name }}</h2>
              <div class="flex items-center gap-2 mt-2">
                <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                <p class="text-[10px] font-black text-indigo-500 uppercase tracking-widest italic">Instrumen Penilaian Mandiri</p>
              </div>
            </div>
          </div>
          <span class="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase italic shadow-xl shadow-indigo-100">
            STRATA {{ cat.target_strata }}
          </span>
        </div>

        <div class="p-10 overflow-x-auto">
          <table class="w-full border-separate border-spacing-y-4">
            <thead>
              <tr class="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] italic">
                <th class="px-6 pb-2 text-left">Grup Sesi</th>
                <th class="px-6 pb-2 text-left">Elemen Penilaian</th>
                <th class="px-6 pb-2 text-center">Skor (0/5/10)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="q in cat.questions" :key="q.id" class="group hover:bg-slate-50 transition-all bg-white shadow-sm">
                <td class="px-8 py-6 align-top w-48 first:rounded-l-[2rem] border-y border-l border-slate-100 group-hover:border-indigo-100">
                  <span class="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl uppercase tracking-wider">{{ q.section }}</span>
                </td>
                <td class="px-8 py-6 align-top border-y border-slate-100 group-hover:border-indigo-100">
                   <p class="text-sm font-bold text-slate-700 leading-relaxed italic group-hover:text-slate-950">"{{ q.indicator }}"</p>
                </td>
                <td class="px-8 py-6 align-top text-center last:rounded-r-[2rem] border-y border-r border-slate-100 group-hover:border-indigo-100">
                  <div class="flex items-center justify-center gap-3">
                    <input 
                      type="number" 
                      v-model="q.score" 
                      min="0" max="10" step="5"
                      @change="submitSkor(q.id, q.score)"
                      :class="getScoreClass(q.score)"
                      class="w-20 h-14 text-center font-black text-xl rounded-2xl border-2 outline-none transition-all shadow-inner focus:ring-4 focus:ring-indigo-100"
                    />
                    <span class="text-slate-300 font-black text-xs">/ 10</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>