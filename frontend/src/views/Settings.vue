<template>
  <div class="ml-72 p-8 bg-slate-50 min-h-screen font-sans text-slate-900 transition-all duration-500">
    
    <header class="mb-10 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-black text-brand italic uppercase leading-none transition-colors duration-500">Control Panel</h1>
        <p class="text-slate-500 font-bold italic mt-2">Manajemen Pengguna & Konfigurasi Visual KJSU-APP</p>
      </div>
      <button @click="isModalOpen = true" class="px-6 py-3 bg-brand text-white rounded-2xl font-black shadow-lg hover:brightness-110 transition-all flex items-center gap-2 uppercase text-xs tracking-widest">
        <i class="fas fa-user-plus"></i> Tambah User
      </button>
    </header>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      
      <div class="xl:col-span-2 space-y-8">
        <div class="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          <div class="p-8 border-b border-slate-50 bg-slate-50/50">
            <h3 class="font-black uppercase italic text-xs text-slate-400 tracking-widest">Daftar Pengguna Sistem</h3>
          </div>
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] italic">
                <th class="px-8 py-6">Nama Pengguna</th>
                <th class="px-8 py-6">Email</th>
                <th class="px-8 py-6 text-center">Role Akses</th>
                <th class="px-8 py-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="u in users" :key="u.id" class="hover:bg-slate-50 transition-all">
                <td class="px-8 py-6 font-bold text-slate-700">
                  {{ u.name }}
                  <span v-if="u.id === currentUser.id" class="ml-2 text-[8px] bg-brand/10 text-brand px-2 py-0.5 rounded-full uppercase italic">Lu</span>
                </td>
                <td class="px-8 py-6 text-slate-500 text-sm font-medium">{{ u.email }}</td>
                <td class="px-8 py-6 text-center">
                  <select v-model="u.role" @change="updateOtherUserRole(u)" class="bg-slate-100 border-none py-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider outline-none focus:ring-2 focus:ring-brand shadow-sm">
                    <option value="super_admin">Super Admin</option>
                    <option value="admin_rs">Admin RS</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </td>
                <td class="px-8 py-6 text-center">
                  <button @click="deleteUser(u.id)" class="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-20" :disabled="u.id === currentUser.id">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="space-y-8">
        <div class="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
          <h3 class="font-black uppercase italic text-xs text-slate-400 mb-6 tracking-widest text-center">Logo Aplikasi</h3>
          <div class="flex flex-col items-center gap-6">
            <div class="w-40 h-40 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2rem] flex items-center justify-center overflow-hidden group relative transition-all hover:border-brand">
              <img v-if="logoPreview" :src="logoPreview" class="w-full h-full object-contain p-4 animate-in fade-in duration-500" />
              <i v-else class="fas fa-hospital text-4xl text-slate-200"></i>
              <label class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all">
                <span class="text-white text-[10px] font-black uppercase tracking-tighter">Ganti Logo</span>
                <input type="file" @change="handleLogoUpload" class="hidden" accept="image/*" />
              </label>
            </div>
          </div>
        </div>

        <div class="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
          <h3 class="font-black uppercase italic text-xs text-slate-400 mb-6 tracking-widest text-center">30 Palet Warna Brand</h3>
          <div class="grid grid-cols-6 gap-2">
            <button v-for="color in themeColors" :key="color.class" 
              @click="setTheme(color)"
              class="group relative h-10 rounded-lg transition-all overflow-hidden flex items-center justify-center shadow-sm"
              :class="[color.bg, currentThemeClass === color.class ? 'ring-2 ring-slate-900 ring-offset-1 scale-110 z-10' : 'hover:scale-110']"
              :title="color.name">
              <i v-if="currentThemeClass === color.class" class="fas fa-check text-white text-[8px]"></i>
            </button>
          </div>
          <p class="mt-6 text-[8px] text-slate-400 font-bold uppercase text-center italic">Pilih identitas visual sistem</p>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div class="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden p-8 border border-slate-100">
        <h2 class="text-xl font-black italic uppercase mb-6 text-slate-900">User Baru</h2>
        <div class="space-y-4">
          <input v-model="newUser.name" type="text" placeholder="Nama Lengkap" class="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-brand font-bold transition-all" />
          <input v-model="newUser.email" type="email" placeholder="Email" class="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-brand font-bold transition-all" />
          <input v-model="newUser.password" type="password" placeholder="Password" class="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-brand font-bold transition-all" />
          <div class="flex gap-3 mt-8">
            <button @click="isModalOpen = false" class="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-xs">Batal</button>
            <button @click="addUser" class="flex-1 py-4 bg-brand text-white rounded-2xl font-black uppercase text-xs shadow-lg shadow-brand/20">Simpan</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api/axios';

const currentUser = ref(JSON.parse(localStorage.getItem('user_info') || '{}'));
const users = ref<any[]>([]);
const isModalOpen = ref(false);
const newUser = ref({ name: '', email: '', password: '', role: 'admin_rs' });
const logoPreview = ref(localStorage.getItem('app_logo') || null);
const currentThemeClass = ref(localStorage.getItem('theme_color_class') || 'indigo');

// 30 PILIHAN WARNA LENGKAP
const themeColors = [
  { name: 'Indigo', class: 'indigo', hex: '#4f46e5', bg: 'bg-indigo-600' },
  { name: 'Rose', class: 'rose', hex: '#e11d48', bg: 'bg-rose-600' },
  { name: 'Emerald', class: 'emerald', hex: '#10b981', bg: 'bg-emerald-600' },
  { name: 'Ocean', class: 'blue', hex: '#2563eb', bg: 'bg-blue-600' },
  { name: 'Amber', class: 'amber', hex: '#d97706', bg: 'bg-amber-600' },
  { name: 'Violet', class: 'violet', hex: '#7c3aed', bg: 'bg-violet-600' },
  { name: 'Teal', class: 'teal', hex: '#0d9488', bg: 'bg-teal-600' },
  { name: 'Crimson', class: 'crimson', hex: '#dc2626', bg: 'bg-red-600' },
  { name: 'Sky', class: 'sky', hex: '#0284c7', bg: 'bg-sky-600' },
  { name: 'Fuchsia', class: 'fuchsia', hex: '#c026d3', bg: 'bg-fuchsia-600' },
  { name: 'Slate', class: 'slate', hex: '#475569', bg: 'bg-slate-600' },
  { name: 'Midnight', class: 'midnight', hex: '#0f172a', bg: 'bg-slate-900' },
  { name: 'Lime', class: 'lime', hex: '#65a30d', bg: 'bg-lime-600' },
  { name: 'Orange', class: 'orange', hex: '#ea580c', bg: 'bg-orange-600' },
  { name: 'Pink', class: 'pink', hex: '#db2777', bg: 'bg-pink-600' },
  { name: 'Cyan', class: 'cyan', hex: '#0891b2', bg: 'bg-cyan-600' },
  { name: 'Purple', class: 'purple', hex: '#9333ea', bg: 'bg-purple-600' },
  { name: 'Stone', class: 'stone', hex: '#57534e', bg: 'bg-stone-600' },
  { name: 'Deep Purple', class: 'deeppurple', hex: '#581c87', bg: 'bg-purple-900' },
  { name: 'Gold', class: 'gold', hex: '#b45309', bg: 'bg-amber-700' },
  { name: 'Forest', class: 'forest', hex: '#14532d', bg: 'bg-green-900' },
  { name: 'Coffee', class: 'coffee', hex: '#78350f', bg: 'bg-orange-900' },
  { name: 'Navy', class: 'navy', hex: '#1e3a8a', bg: 'bg-blue-900' },
  { name: 'Pastel Blue', class: 'pblue', hex: '#60a5fa', bg: 'bg-blue-400' },
  { name: 'Pastel Rose', class: 'prose', hex: '#fb7185', bg: 'bg-rose-400' },
  { name: 'Pastel Green', class: 'pgreen', hex: '#4ade80', bg: 'bg-green-400' },
  { name: 'Mint', class: 'mint', hex: '#2dd4bf', bg: 'bg-teal-400' },
  { name: 'Maroon', class: 'maroon', hex: '#991b1b', bg: 'bg-red-800' },
  { name: 'Charcoal', class: 'charcoal', hex: '#334155', bg: 'bg-slate-700' },
  { name: 'Lavender', class: 'lavender', hex: '#a78bfa', bg: 'bg-violet-400' }
];

const fetchUsers = async () => {
  try {
    const res = await api.get('/users');
    users.value = res.data;
  } catch (e) {
    users.value = [{ id: 1, name: 'Kholid Saifullah', email: 'admin@mail.com', role: 'super_admin' }];
  }
};

const addUser = async () => {
  try {
    await api.post('/users', newUser.value);
    isModalOpen.value = false;
    newUser.value = { name: '', email: '', password: '', role: 'admin_rs' };
    fetchUsers();
  } catch (e) { alert("Gagal menambah user!"); }
};

const handleLogoUpload = (e: any) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      logoPreview.value = event.target.result;
      localStorage.setItem('app_logo', event.target.result);
      window.location.reload();
    };
    reader.readAsDataURL(file);
  }
};

const setTheme = (colorObj: any) => {
  currentThemeClass.value = colorObj.class;
  localStorage.setItem('theme_color_class', colorObj.class);
  localStorage.setItem('theme_color_hex', colorObj.hex);
  document.documentElement.style.setProperty('--brand-color', colorObj.hex);
};

const updateOtherUserRole = async (user: any) => {
  try { await api.put(`/users/${user.id}/role`, { role: user.role }); } 
  catch (e) { alert("Gagal update role!"); }
};

const deleteUser = async (id: number) => {
  if (confirm('Hapus user ini?')) {
    try { await api.delete(`/users/${id}`); fetchUsers(); } 
    catch (e) { alert("Gagal hapus!"); }
  }
};

onMounted(() => {
  fetchUsers();
  const savedHex = localStorage.getItem('theme_color_hex') || '#4f46e5';
  document.documentElement.style.setProperty('--brand-color', savedHex);
});
</script>