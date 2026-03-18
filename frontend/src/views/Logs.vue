<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api/axios';

interface AuditLog {
  id: number;
  user_name: string;
  action: string;
  description: string;
  created_at: string;
  ip_address: string;
}

const logs = ref<AuditLog[]>([]);
const isLoading = ref(true);

const fetchLogs = async () => {
  try {
    isLoading.value = true;
    const res = await api.get('/audit-logs');
    logs.value = res.data;
  } catch (e) {
    console.error("Gagal ambil log:", e);
  } finally {
    isLoading.value = false;
  }
};

const getActionClass = (action: string) => {
  const base = 'px-3 py-1 rounded-lg text-[9px] font-black uppercase italic ';
  if (action.includes('DELETE')) return base + 'bg-rose-50 text-rose-600';
  if (action.includes('CREATE') || action.includes('POST')) return base + 'bg-emerald-50 text-emerald-600';
  if (action.includes('UPDATE') || action.includes('PUT')) return base + 'bg-amber-50 text-amber-600';
  return base + 'bg-indigo-50 text-indigo-600';
};

onMounted(fetchLogs);
</script>

<template>
  <div class="ml-72 p-8 bg-slate-50 min-h-screen font-sans text-slate-900">
    <header class="mb-10 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-black text-slate-900 italic uppercase leading-none">Audit <span class="text-indigo-600">Logs</span></h1>
        <p class="text-slate-500 font-bold italic mt-2 text-sm tracking-widest uppercase">Jejak Aktiviti & Keselamatan Sistem</p>
      </div>
      <button @click="fetchLogs" class="w-12 h-12 bg-white text-slate-400 rounded-2xl shadow-sm hover:text-indigo-600 transition-all flex items-center justify-center border border-slate-100">
        <i class="fas fa-sync-alt" :class="{'animate-spin': isLoading}"></i>
      </button>
    </header>

    <div class="bg-white rounded-4xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
      <div v-if="isLoading" class="p-20 text-center font-bold text-slate-300 italic animate-pulse">
        Menarik data aktiviti...
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] italic">
              <th class="px-8 py-6">Masa & Tarikh</th>
              <th class="px-8 py-6">Pengguna</th>
              <th class="px-8 py-6">Tindakan</th>
              <th class="px-8 py-6">Perincian Aktiviti</th>
              <th class="px-8 py-6 text-right">IP Address</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 text-sm">
            <tr v-for="log in logs" :key="log.id" class="hover:bg-slate-50 transition-all group">
              <td class="px-8 py-6 font-bold text-slate-400 tabular-nums">
                {{ log.created_at }}
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-[10px] font-black">
                    {{ log.user_name.charAt(0).toUpperCase() }}
                  </div>
                  <span class="font-black text-slate-700 italic">{{ log.user_name }}</span>
                </div>
              </td>
              <td class="px-8 py-6">
                <span :class="getActionClass(log.action)">{{ log.action }}</span>
              </td>
              <td class="px-8 py-6 font-medium text-slate-600">
                {{ log.description }}
              </td>
              <td class="px-8 py-6 text-right font-mono text-[10px] text-slate-300">
                {{ log.ip_address }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>