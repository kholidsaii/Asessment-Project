<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import api from '../api/axios';

// 1. Definisikan Interface agar TypeScript tahu bentuk datanya
interface Indicator {
  id?: number;
  section: string;
  indicator: string;
  is_paripurna: boolean;
  is_utama: boolean;
  is_madya: boolean;
  is_dasar: boolean;
  [key: string]: any; // Memperbolehkan akses dinamis seperti q[s]
}

interface Category {
  id: number;
  name: string;
}

// 2. Beri tipe data pada ref agar tidak dianggap 'never'
const categories = ref<Category[]>([]);
const selectedCat = ref<number | null>(null);
const questions = ref<Indicator[]>([]);
const isModalOpen = ref(false);
const isEdit = ref(false);
const editingId = ref<number | null>(null);
const searchQuery = ref('');

const newIndicator = ref<Indicator>({
  section: '',
  indicator: '',
  is_paripurna: false,
  is_utama: false,
  is_madya: false,
  is_dasar: false
});

const filteredQuestions = computed(() => {
  if (!searchQuery.value) return questions.value;
  const q = searchQuery.value.toLowerCase();
  return questions.value.filter(item => 
    item.indicator.toLowerCase().includes(q) || 
    item.section.toLowerCase().includes(q)
  );
});

const loadInitial = async () => {
  const res = await api.get('/categories');
  categories.value = res.data;
  
  // Gunakan optional chaining (?.) atau pastikan index ke-0 ada
  if (categories.value && categories.value.length > 0) {
    const firstCategory = categories.value[0];
    if (firstCategory) {
      selectedCat.value = firstCategory.id;
      fetchQuestions();
    }
  }
};

const fetchQuestions = async () => {
  // Gunakan optional chaining agar tidak 'possibly undefined'
  if (selectedCat.value) {
    const res = await api.get(`/questions?category_id=${selectedCat.value}`);
    questions.value = res.data;
  }
};

const openAddModal = () => {
  isEdit.value = false;
  newIndicator.value = { section: '', indicator: '', is_paripurna: false, is_utama: false, is_madya: false, is_dasar: false };
  isModalOpen.value = true;
};

const openEditModal = (q: Indicator) => {
  isEdit.value = true;
  editingId.value = q.id ?? null;
  newIndicator.value = { ...q };
  isModalOpen.value = true;
};

const saveIndicator = async () => {
  try {
    if (isEdit.value && editingId.value) {
      await api.put(`/questions/${editingId.value}`, {
        category_id: selectedCat.value,
        ...newIndicator.value
      });
    } else {
      await api.post('/questions', {
        category_id: selectedCat.value,
        ...newIndicator.value
      });
    }
    isModalOpen.value = false;
    fetchQuestions();
  } catch (e) {
    alert("Gagal simpan data!");
  }
};

const updateStrataQuick = async (q: Indicator) => {
  try {
    await api.post(`/questions/${q.id}/update-strata`, {
      is_paripurna: q.is_paripurna,
      is_utama: q.is_utama,
      is_madya: q.is_madya,
      is_dasar: q.is_dasar
    });
  } catch (e) {
    alert("Gagal update strata");
  }
};

const deleteQuestion = async (id: number) => {
  if (confirm('Yakin mau hapus, Lid? Data ini krusial buat RS Suyoto/RSPPN lho.')) {
    try {
      await api.delete(`/questions/${id}`);
      fetchQuestions();
    } catch (e) {
      alert("Gagal hapus!");
    }
  }
};

onMounted(loadInitial);
</script>

<template>
  <div class="ml-72 p-8 bg-slate-50 min-h-screen font-sans text-slate-900">
    <header class="mb-10 flex justify-between items-end">
      <div>
        <h1 class="text-3xl font-black text-slate-900 italic uppercase leading-none">Master Indikator</h1>
        <p class="text-slate-500 font-bold italic mt-2">Pusat Data Elemen Penilaian KJSU</p>
      </div>
      
      <div class="flex gap-4 items-center">
        <div class="relative">
          <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input v-model="searchQuery" type="text" placeholder="Cari..." class="pl-10 pr-4 py-3 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 w-48 font-bold shadow-sm" />
        </div>

        <button @click="openAddModal" class="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 uppercase text-xs tracking-widest">
          <i class="fas fa-plus text-xs"></i> Tambah
        </button>

        <select v-model="selectedCat" @change="fetchQuestions" class="bg-white border-2 border-slate-100 p-3 rounded-2xl font-bold outline-none focus:border-indigo-500 shadow-sm">
          <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </div>
    </header>

    <div class="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] italic">
            <th class="px-8 py-6 uppercase">Sesi / Grup</th>
            <th class="px-8 py-6">Indikator Penilaian</th>
            <th class="px-4 py-6 text-center">Pari</th>
            <th class="px-4 py-6 text-center">Utam</th>
            <th class="px-4 py-6 text-center">Mady</th>
            <th class="px-4 py-6 text-center">Dasr</th>
            <th class="px-8 py-6 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="q in filteredQuestions" :key="q.id" class="hover:bg-indigo-50/30 transition-all group">
            <td class="px-8 py-6">
              <span class="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase italic group-hover:bg-white transition-colors">
                {{ q.section }}
              </span>
            </td>
            <td class="px-8 py-6 font-bold text-slate-700 text-sm italic leading-relaxed">
              {{ q.indicator }}
            </td>
            <td class="px-4 py-6 text-center" v-for="s in (['is_paripurna', 'is_utama', 'is_madya', 'is_dasar'] as const)" :key="s">
              <input type="checkbox" v-model="q[s]" @change="updateStrataQuick(q)" class="w-5 h-5 accent-indigo-600 rounded-lg cursor-pointer shadow-inner" />
            </td>
            <td class="px-8 py-6 text-center">
              <div class="flex items-center justify-center gap-2">
                <button @click="openEditModal(q)" class="p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all">
                  <i class="fas fa-edit"></i>
                </button>
                <button v-if="q.id" @click="deleteQuestion(q.id)" class="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div class="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div class="p-8 bg-indigo-600 text-white flex justify-between items-center">
          <h2 class="text-xl font-black italic tracking-tight uppercase">{{ isEdit ? 'Update Indikator' : 'Indikator Baru' }}</h2>
          <button @click="isModalOpen = false" class="text-white/60 hover:text-white transition-colors text-2xl">&times;</button>
        </div>
        
        <div class="p-8 space-y-6">
          <div class="space-y-2">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grup / Section</label>
            <input v-model="newIndicator.section" type="text" placeholder="SDM / Sarpras..." class="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-bold" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Indikator</label>
            <textarea v-model="newIndicator.indicator" rows="3" class="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-bold italic"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <label v-for="s in (['paripurna', 'utama', 'madya', 'dasar'] as const)" :key="s" class="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-indigo-50 transition-colors">
              <input type="checkbox" v-model="newIndicator[`is_${s}` as keyof Indicator]" class="w-5 h-5 accent-indigo-600" />
              <span class="text-xs font-black uppercase text-slate-600">{{ s }}</span>
            </label>
          </div>

          <button @click="saveIndicator" class="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100">
            {{ isEdit ? 'Simpan Perubahan' : 'Tambahkan Data' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>