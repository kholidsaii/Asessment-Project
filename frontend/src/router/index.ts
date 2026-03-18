import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue'; 
import HospitalMapping from '../views/HospitalMapping.vue';
import IndicatorManager from '../views/IndicatorManager.vue'
const routes = [
  { path: '/login', name: 'Login', component: Login },
  { 
    path: '/', 
    name: 'Dashboard', 
    component: Dashboard, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/mapping', 
    name: 'HospitalMapping', 
    component: HospitalMapping, 
    meta: { requiresAuth: true, role: 'super_admin' } // Hanya untuk Super Admin
  },
  { 
    path: '/IndicatorManager', 
    name: 'IndicatorManager',
    component: IndicatorManager 
  },
  { 
    path: '/reports', 
    name: 'Reports',
    component: () => import('../views/Reports.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/settings', 
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
    meta: { requiresAuth: true, role: 'super_admin' }
  },
  { 
  path: '/logs', 
  name: 'AuditLogs', 
  component: () => import('../views/Logs.vue'),
  meta: { requiresAuth: true, role: 'super_admin' }
},
];

// 1. Definisikan variabel router di sini
const router = createRouter({
  history: createWebHistory(),
  routes
});

// 2. Penjaga Pintu: Cek token dan Role sebelum masuk
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token');
  const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
  const userRole = userInfo.role;

  // Cek Auth: Kalau butuh login tapi token kosong, tendang ke login
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } 
  // Cek Role: Kalau halaman butuh role 'super_admin' tapi user bukan admin
  else if (to.meta.role && to.meta.role !== userRole) {
    alert('Anda tidak memiliki akses ke halaman ini!');
    next('/'); // Balikkan ke Dashboard biasa
  } 
  else {
    next();
  }
});

export default router;