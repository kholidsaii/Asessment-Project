<?php
namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Hospital;
use App\Models\HospitalPriority;
use Illuminate\Http\Request;

  class MappingController extends Controller
    {
        public function store(Request $request) 
        {
            // Validasi data yang masuk dari Vue
            $request->validate([
                'name' => 'required|string',
                'selectedPriorities' => 'required|array',
                'mappingData' => 'required|array',
              
            ]);

            // 1. Simpan Rumah Sakit baru dengan kode otomatis
            $hospital = Hospital::create([
                'name' => $request->name,
                'class' => $request->class,
                'code' => strtoupper(substr($request->name, 0, 3)) . rand(100, 999) // Contoh: SUY123

            ]);
            // 2. Simpan Mapping (Kategori + Strata)
            // mappingData berisi ID Kategori sebagai Key dan Strata sebagai Value
            foreach ($request->selectedPriorities as $categoryId) {
                    HospitalPriority::create([
                        'hospital_id' => $hospital->id,
                        'category_id' => $categoryId,
                        'target_strata' => $request->mappingData[$categoryId] // Akan mengambil "Paripurna"
                    ]);
                }

            return response()->json([
                'message' => 'Mapping Berhasil!', 
                'hospital_id' => $hospital->id
            ]);
        }
        public function getActiveHospital()
    {
        // Mengambil data RS terakhir yang di-input
        $hospital = Hospital::latest()->first();

        if (!$hospital) {
            return response()->json(['message' => 'Belum ada RS yang di-mapping'], 404);
        }

        // Ambil juga mapping kategorinya
        $mappings = HospitalPriority::with('category')
            ->where('hospital_id', $hospital->id)
            ->get();

        return response()->json([
            'hospital' => $hospital,
            'mappings' => $mappings
        ]);
    }
    }