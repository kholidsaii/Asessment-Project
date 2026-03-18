<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios';
import * as XLSX from 'xlsx';

// 1. CARA IMPORT PALING PASTI UNTUK VITE
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; 

const router = useRouter();

interface AssessmentReport {
  id: string;
  hospital_id: number;
  hospital_name: string;
  category: string;
  score: number;
  strata: string;
  date: string;
}

const reports = ref<AssessmentReport[]>([]);
const searchQuery = ref('');
const selectedCategory = ref('');
const isLoading = ref(true);

const fetchReports = async () => {
  try {
    isLoading.value = true;
    const res = await api.get('/reports/all');
    reports.value = res.data;
  } catch (e) {
    console.error("Gagal ambil laporan:", e);
  } finally {
    isLoading.value = false;
  }
};
const downloadPDF = (report: AssessmentReport) => {
  try {
    // 2. INISIALISASI JSPDF
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    // Gambar Header Navy (HEX Murni)
    doc.setFillColor(15, 23, 42); 
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(report.hospital_name.toUpperCase(), 20, 22);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('SISTEM PENILAIAN MANDIRI KJSU-APP', 20, 30);

    // 

    // 3. PANGGIL autoTable SECARA LANGSUNG (Bukan sebagai method doc)
    // Ini solusi paling ampuh untuk error 'is not a function'
    autoTable(doc, {
      startY: 50,
      margin: { left: 20, right: 20 },
      head: [['PARAMETER ASESMEN', 'HASIL / DETAIL']],
      body: [
        ['Nama Rumah Sakit', report.hospital_name],
        ['Kategori Layanan', report.category],
        ['Tanggal Penilaian', report.date],
        ['Skor Kesiapan Akhir', `${report.score}%`],
        ['Target Strata', report.strata],
      ],
      headStyles: { fillColor: [79, 70, 229], fontStyle: 'bold' },
      styles: { font: 'helvetica', fontSize: 10, cellPadding: 5 },
      theme: 'grid'
    });

    // 4. AMBIL POSISI Y TERAKHIR
    // @ts-ignore
    const finalY = (doc as any).lastAutoTable.finalY || 120;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text('Petugas Pemeriksa,', 20, finalY + 20);
    doc.text('Direktur Rumah Sakit,', pageWidth - 70, finalY + 20);
    
    doc.line(20, finalY + 45, 70, finalY + 45); 
    doc.line(pageWidth - 70, finalY + 45, pageWidth - 20, finalY + 45);

    doc.save(`Laporan_KJSU_${report.hospital_name.replace(/\s+/g, '_')}.pdf`);

  } catch (error) {
    console.error("Detail Error PDF:", error);
    alert("Gagal cetak PDF. Cek console log!");
  }
};

const viewDetail = (report: AssessmentReport) => {
  router.push({ path: '/', query: { hospital_id: report.hospital_id } });
};

const exportData = () => {
  if (filteredReports.value.length === 0) return alert("Gak ada data!");
  const dataToExport = filteredReports.value.map(r => ({
    "Nama Rumah Sakit": r.hospital_name,
    "Kategori Layanan": r.category,
    "Skor Asesmen (%)": r.score,
    "Target Strata": r.strata,
    "Tanggal": r.date
  }));
  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan KJSU");
  XLSX.writeFile(workbook, `Laporan_KJSU_${new Date().getTime()}.xlsx`);
};

const filteredReports = computed(() => {
  return reports.value.filter(r => {
    const matchSearch = r.hospital_name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchCat = selectedCategory.value ? r.category.toUpperCase() === selectedCategory.value.toUpperCase() : true;
    return matchSearch && matchCat;
  });
});

const getStrataClass = (strata: string) => {
  const base = 'px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border-2 ';
  const s = strata.toUpperCase();
  if (s === 'PARIPURNA') return base + 'bg-emerald-50 text-emerald-600 border-emerald-100';
  if (s === 'UTAMA') return base + 'bg-blue-50 text-blue-600 border-blue-100';
  if (s === 'MADYA') return base + 'bg-amber-50 text-amber-600 border-amber-100';
  return base + 'bg-rose-50 text-rose-600 border-rose-100';
};

onMounted(fetchReports);
</script>

    <template>
    <div class="ml-72 p-8 bg-slate-50 min-h-screen font-sans text-slate-900">
        <header class="mb-10 flex justify-between items-end">
        <div>
            <h1 class="text-3xl font-black text-slate-900 italic uppercase leading-none">Laporan <span class="text-indigo-600">Asesmen</span></h1>
            <p class="text-slate-500 font-bold italic mt-2">Pusat Rekapitulasi Penilaian KJSU</p>
        </div>
        <div class="flex flex-wrap gap-3 items-center">
            <input v-model="searchQuery" type="text" placeholder="Cari RS..." class="pl-10 pr-4 py-3 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 w-64 font-bold shadow-sm" />
            <select v-model="selectedCategory" class="bg-white border-2 border-slate-100 p-3 rounded-2xl font-bold shadow-sm">
            <option value="">Semua Layanan</option>
            <option value="KIA">KIA</option>
            <option value="STROKE">STROKE</option>
            <option value="DIABETES">DIABETES</option>
            <option value="URONEFRO">URONEFROLOGI</option>
            </select>
            <button @click="exportData" class="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2 uppercase text-xs">
            <i class="fas fa-file-excel"></i> Excel
            </button>
        </div>
        </header>

        <div class="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
        <div v-if="isLoading" class="p-20 text-center font-bold animate-pulse text-slate-400 italic">Memuat data...</div>
        <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
            <thead>
                <tr class="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] italic">
                <th class="px-8 py-6">RS / Tanggal</th>
                <th class="px-8 py-6 text-center">Kategori</th>
                <th class="px-8 py-6 text-center">Skor</th>
                <th class="px-8 py-6 text-center">Strata</th>
                <th class="px-8 py-6 text-center">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="report in filteredReports" :key="report.id" class="hover:bg-indigo-50/30 transition-all group">
                    <td class="px-8 py-6 text-sm font-bold">{{ report.hospital_name }} <br> <span class="text-[10px] text-slate-400 uppercase tracking-widest">{{ report.date }}</span></td>
                    <td class="px-8 py-6 text-center"><span class="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase italic">{{ report.category }}</span></td>
                    <td class="px-8 py-6 text-center font-black text-indigo-600 text-xl">{{ report.score }}%</td>
                    <td class="px-8 py-6 text-center"><span :class="getStrataClass(report.strata)">{{ report.strata }}</span></td>
                    <td class="px-8 py-6 text-center">
                    <div class="flex justify-center gap-2">
                        <button @click="viewDetail(report)" class="w-10 h-10 bg-slate-100 text-slate-400 hover:bg-indigo-600 hover:text-white rounded-xl flex items-center justify-center"><i class="fas fa-eye text-xs"></i></button>
                        <button @click="downloadPDF(report)" class="w-10 h-10 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl flex items-center justify-center"><i class="fas fa-file-pdf text-xs"></i></button>
                    </div>
                    </td>
                </tr>
            </tbody>
            </table>
        </div>
        </div>
    </div>
    </template>